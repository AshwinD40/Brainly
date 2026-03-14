import { useAuth, useClerk, useUser } from "@clerk/react-router";
import { useEffect, useRef, useState } from "react";
import { IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { clearTokenGetter } from "../../api/axios";
import { ConfirmationModal } from "../common/confModal";

export const Navbar = () => {
  const { openUserProfile, signOut } = useClerk();
  const { sessionId } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSignOutOpen, setSignOutOpen] = useState(false);
  const [isSigningOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

  const handleManageAccount = () => {
    setMenuOpen(false);
    openUserProfile();
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const signOutOptions = sessionId ? { sessionId } : undefined;
      await signOut(signOutOptions);
      clearTokenGetter();
      navigate("/signin", { replace: true });
    } finally {
      setSigningOut(false);
      setSignOutOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-neutral-800/50 bg-neutral-950/80 px-4 backdrop-blur-md sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-neutral-100">
            Brainly
          </span>
          <span className="hidden text-xs font-normal text-neutral-600 sm:inline">
            second brain
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden max-w-35 truncate text-xs text-neutral-500 sm:block">
              {user.primaryEmailAddress?.emailAddress ?? user.username}
            </span>
          )}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-2 py-1 transition-all hover:border-neutral-500"
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName ?? "User avatar"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-sm font-medium text-neutral-200">
                  {(user?.firstName ?? user?.username ?? "U")
                    .slice(0, 1)
                    .toUpperCase()}
                </div>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleManageAccount}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
                >
                  <IoPersonCircleOutline className="text-lg text-neutral-500" />
                  Manage account
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setSignOutOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                >
                  <IoLogOutOutline className="text-lg text-red-400" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmationModal
        open={isSignOutOpen}
        title="Sign out now?"
        description="You'll be returned to the sign-in screen and your current session will end on this browser."
        confirmText="Sign out"
        variant="danger"
        loading={isSigningOut}
        onCancel={() => {
          if (!isSigningOut) {
            setSignOutOpen(false);
          }
        }}
        onConfirm={handleSignOut}
      />
    </>
  );
};
