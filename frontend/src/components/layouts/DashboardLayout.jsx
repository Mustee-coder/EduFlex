import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const drawer = drawerRef.current;
    const menuButton = menuButtonRef.current;
    const getFocusable = () => drawer?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])') || [];
    getFocusable()[0]?.focus();
    const handleKeys = (event) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("keydown", handleKeys);
      menuButton?.focus();
    };
  }, [open]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR (DRAWER) */}
      {open && (
        <div ref={drawerRef} className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Main navigation">
          {/* overlay */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="absolute inset-0 w-full border-0 bg-slate-950/45"
          />

          {/* sidebar */}
          <div className="relative h-full w-[min(18rem,86vw)] bg-white shadow-xl">
            <Sidebar closeSidebar={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        <div inert={open} aria-hidden={open} className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar menuButtonRef={menuButtonRef} openSidebar={() => setOpen((value) => !value)} isSidebarOpen={open} />

        <main className="min-w-0 flex-1 bg-slate-50">
          <Outlet />
        </main>
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;