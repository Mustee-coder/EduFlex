import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  // prevent background scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR (DRAWER) */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* overlay */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          {/* sidebar */}
          <div className="relative w-64 h-full bg-white">
            <Sidebar closeSidebar={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        <Topbar openSidebar={() => setOpen(true)} />

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;