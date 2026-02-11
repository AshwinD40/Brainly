import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";

import { auth } from "../../utils/auth";
import { ConfirmationModal } from "../common/confModal";

export const Navbar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const user = auth.get();
  const username = user?.username;

  return (
    <>
      <aside className="fixed w-full top-0 h-16 bg-transparent text-white backdrop-blur-xs border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-xl font-semibold tracking-tight relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-white after:transition-all hover:after:w-full">
            Brainly
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="max-w-fit text-sm font-semibold bg-neutral-800/60 border border-white/10 px-3 py-1 rounded-full">
            {username}
          </div>
          <button type="button" onClick={() => setShowLogout(true)}>
            <HiOutlineLogout size={20} className="text-neutral-300 hover:text-white transition" />
          </button>
        </div>
      </aside>

      <ConfirmationModal
        open={showLogout}
        title="Logout?"
        description="You'll need to sign in again."
        confirmText="Logout"
        variant="danger"
        onCancel={() => setShowLogout(false)}
        onConfirm={() => {
          auth.clear();
          setShowLogout(false);
          navigate("/signin", { replace: true });
        }}
      />
    </>
  );
};
