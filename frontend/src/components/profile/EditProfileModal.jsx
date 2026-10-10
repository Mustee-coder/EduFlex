import { useEffect, useRef, useState } from "react";
import { AlertCircle, LoaderCircle, X } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

const fieldClass = "mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50";

const EditProfileModal = ({ user, onClose }) => {
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    gender: user?.additionalDetails?.gender || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    about: user?.additionalDetails?.about || "",
  });
  const dialogRef = useRef(null);
  const { mutate, isPending, isError, error } = useUpdateProfile();

  useEffect(() => {
    dialogRef.current?.querySelector("input")?.focus();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutate(form, { onSuccess: onClose });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && !isPending) onClose();
    if (event.key === "Tab" && dialogRef.current) {
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isPending) onClose(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" aria-describedby="edit-profile-description" onKeyDown={handleKeyDown} className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="edit-profile-title" className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Edit profile</h2>
            <p id="edit-profile-description" className="mt-1 text-sm text-slate-600">Update your personal information.</p>
          </div>
          <button type="button" onClick={onClose} disabled={isPending} aria-label="Close edit profile dialog" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>

        {isError && <div role="alert" className="mt-5 flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>{error?.response?.data?.message || "We couldn’t save your profile. Please review your details and try again."}</span></div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="profile-first-name">First name<input id="profile-first-name" type="text" name="firstName" autoComplete="given-name" value={form.firstName} onChange={handleChange} className={fieldClass} disabled={isPending} /></label>
            <label className="block text-sm font-medium text-slate-700" htmlFor="profile-last-name">Last name<input id="profile-last-name" type="text" name="lastName" autoComplete="family-name" value={form.lastName} onChange={handleChange} className={fieldClass} disabled={isPending} /></label>
            <label className="block text-sm font-medium text-slate-700" htmlFor="profile-contact-number">Contact number<input id="profile-contact-number" type="tel" name="contactNumber" autoComplete="tel" value={form.contactNumber} onChange={handleChange} className={fieldClass} disabled={isPending} /></label>
            <label className="block text-sm font-medium text-slate-700" htmlFor="profile-gender">Gender<select id="profile-gender" name="gender" value={form.gender} onChange={handleChange} className={fieldClass} disabled={isPending}><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option></select></label>
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2" htmlFor="profile-date-of-birth">Date of birth<input id="profile-date-of-birth" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={fieldClass} disabled={isPending} /></label>
          </div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="profile-about">About<textarea id="profile-about" rows="4" name="about" value={form.about} onChange={handleChange} className={`${fieldClass} resize-y`} disabled={isPending} /></label>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={isPending} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:w-auto">Cancel</button>
            <button type="submit" disabled={isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{isPending ? "Saving changes…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditProfileModal;
