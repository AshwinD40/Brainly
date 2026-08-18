import { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ConfirmationModal } from "../common/confModal";
import favicon from "../../assets/favicon.png";

const UserIconSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSignOutOpen, setSignOutOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    setSignOutOpen(false);
    navigate("/signin", { replace: true });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-[90%] max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={favicon}
              alt="Brainly Logo"
              className="h-8 w-8 object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-violet-200 transition-colors">
              Brainly
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username ?? "User avatar"}
                  className="h-10 w-10 rounded-full object-cover border border-neutral-600"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-700 border border-white/5">
                  <UserIconSvg />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSignOutOpen(true)}
              className="flex items-center rounded-full border border-red-500/30 bg-red-500/80 px-2.5 py-2.5 text-red-100 shadow-sm transition-all duration-200 hover:border-red-500/50 hover:bg-red-500 hover:text-red-50 hover:shadow-red-500/10 active:scale-95"
              title="Log out of account"
            >
              <IoLogOutOutline className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <ConfirmationModal
        open={isSignOutOpen}
        title="Sign out of Brainly?"
        description="You will need to sign in again to access your saved notes and links."
        confirmText="Sign Out"
        variant="danger"
        onCancel={() => setSignOutOpen(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
};
