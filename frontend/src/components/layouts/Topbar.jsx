import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Topbar = ({ openSidebar }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white border-b px-4 py-3">

      {/* LEFT */}
      <button onClick={openSidebar} className="md:hidden text-2xl">
        ☰
      </button>

      {/* SEARCH BAR (UDEMY STYLE) */}
      <input
        placeholder="Search courses..."
        className="hidden md:block w-1/2 px-4 py-2 border rounded-full"
      />

      {/* PROFILE */}
      <div className="relative">

        <img
          onClick={() => setOpen(!open)}
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
          className="w-9 h-9 rounded-full cursor-pointer"
        />

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-lg">

            <div className="p-3 border-b">
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Profile
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
              Settings
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
};

export default Topbar;