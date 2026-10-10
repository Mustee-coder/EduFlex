import React from "react";
import { Camera, Check, Pencil } from "lucide-react";

const ProfileHeader = ({ user, previewImage, profileCompletion, onEdit, fileInputRef, isUploading }) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your profile";
  const role = user?.accountType || "Student";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label="Profile summary">
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <img
            src={previewImage || user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`}
            alt={`${fullName} profile`}
            className="h-24 w-24 rounded-full border border-slate-200 bg-slate-100 object-cover sm:h-28 sm:w-28"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Choose profile photo"
            disabled={isUploading}
            className="absolute bottom-0 right-0 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{role}</span>
            {profileCompletion === 100 && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Complete</span>}
          </div>
          <h2 className="profile-title mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{fullName}</h2>
          <p className="mt-1 break-all text-sm text-slate-600">{user?.email || "Email not provided"}</p>
          <div className="mt-5" aria-label={`Profile completion ${profileCompletion}%`}>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-slate-600">Profile completion</span>
              <span className="font-semibold tabular-nums text-slate-800">{profileCompletion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={profileCompletion} aria-label="Profile completion">
              <div className="h-full rounded-full bg-indigo-600 transition-[width]" style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
        </div>

        <button type="button" onClick={onEdit} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto">
          <Pencil className="h-4 w-4" aria-hidden="true" /> Edit profile
        </button>
      </div>
    </section>
  );
};

export default ProfileHeader;
