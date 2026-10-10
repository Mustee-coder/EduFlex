import React, { useEffect, useRef, useState } from "react";
import { useUserDetails } from "@/hooks/useProfile";
import { useUpdateProfileImage } from "@/hooks/useUpdateProfileImage";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { AlertCircle, CheckCircle2, LoaderCircle, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import "@/index.css";
import ProfileHeader from "@/components/profile/ProfileHeader";

const Profile = () => {
  const { data, isLoading, isError, refetch, isFetching } = useUserDetails();
  const user = data?.data;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);
  const { mutate: uploadImage, isPending: isUploading } = useUpdateProfileImage();

  useEffect(() => () => {
    if (previewImage?.startsWith("blob:")) URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Choose a JPG, PNG, WebP, or GIF image.");
      setUploadSuccess("");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5 MB.");
      setUploadSuccess("");
      event.currentTarget.value = "";
      return;
    }
    setUploadError("");
    setUploadSuccess("");
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUploadImage = () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    setUploadError("");
    setUploadSuccess("");
    uploadImage(formData, {
      onSuccess: (response) => {
        setPreviewImage(response?.data?.image || "");
        setSelectedImage(null);
        setUploadSuccess("Your profile photo has been updated.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("Profile picture updated successfully");
      },
      onError: (error) => {
        setUploadError(error?.response?.data?.message || "We couldn’t upload your photo. Please try again.");
      },
    });
  };

  const profileCompletion = user ? Math.round(([
    user.firstName, user.lastName, user.email, user.image,
    user.additionalDetails?.contactNumber, user.additionalDetails?.gender,
    user.additionalDetails?.dateOfBirth, user.additionalDetails?.about,
  ].filter(Boolean).length / 8) * 100) : 0;

  if (isLoading) {
    return (
      <main className="profile-root student-page min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" aria-label="Loading profile" aria-busy="true">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2"><div className="h-7 w-40 animate-pulse rounded bg-slate-200" /><div className="h-4 w-64 max-w-full animate-pulse rounded bg-slate-200" /></div>
          <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="profile-root student-page min-h-[60vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sm:p-8" role="alert">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700"><AlertCircle className="h-5 w-5" aria-hidden="true" /></div>
          <h1 className="profile-title mt-4 text-2xl font-semibold text-slate-900">Profile couldn’t load</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">We couldn’t retrieve your account details. Check your connection and try again.</p>
          <button type="button" onClick={() => refetch()} disabled={isFetching} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60">
            {isFetching && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{isFetching ? "Retrying…" : "Try again"}
          </button>
        </section>
      </main>
    );
  }

  const details = [
    { label: "First name", value: user?.firstName },
    { label: "Last name", value: user?.lastName },
    { label: "Email address", value: user?.email },
    { label: "Phone number", value: user?.additionalDetails?.contactNumber },
    { label: "Gender", value: user?.additionalDetails?.gender },
    { label: "Date of birth", value: user?.additionalDetails?.dateOfBirth },
  ];

  return (
    <main className="profile-root student-page min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">Account</p>
          <h1 className="profile-title mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My profile</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your personal details and profile photo.</p>
        </header>

        <ProfileHeader user={user} previewImage={previewImage} profileCompletion={profileCompletion} fileInputRef={fileInputRef} isUploading={isUploading} onEdit={() => setOpenEditModal(true)} />

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="personal-information-title">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 id="personal-information-title" className="text-base font-semibold text-slate-900">Personal information</h2>
            <p className="mt-1 text-sm text-slate-600">Details associated with your EduFlex account.</p>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {details.map(({ label, value }) => (
              <div key={label} className="min-w-0 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:px-6">
                <dt className="text-xs font-medium text-slate-500">{label}</dt>
                <dd className="mt-1 break-words text-sm font-medium text-slate-900">{value || <span className="font-normal text-slate-400">Not provided</span>}</dd>
              </div>
            ))}
            <div className="min-w-0 px-5 py-4 sm:col-span-2 sm:px-6">
              <dt className="text-xs font-medium text-slate-500">About</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">{user?.additionalDetails?.about || <span className="text-slate-400">Not provided</span>}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="profile-photo-title">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><UserRound className="h-5 w-5" aria-hidden="true" /></div>
            <div className="min-w-0">
              <h2 id="profile-photo-title" className="text-base font-semibold text-slate-900">Profile photo</h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">JPG, PNG, WebP, or GIF. Maximum file size 5 MB.</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} className="sr-only" aria-label="Choose profile photo file" />
          {selectedImage && <div className="mt-5 flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <img src={previewImage} alt="Selected profile photo preview" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
            <p className="min-w-0 flex-1 break-all text-sm font-medium text-slate-800">{selectedImage.name}</p>
          </div>}
          {uploadError && <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">{uploadError}</p>}
          {uploadSuccess && <p role="status" className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />{uploadSuccess}</p>}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:w-auto"><Upload className="h-4 w-4" aria-hidden="true" />Choose photo</button>
            {selectedImage && <button type="button" onClick={handleUploadImage} disabled={isUploading} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto">{isUploading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{isUploading ? "Uploading…" : "Upload photo"}</button>}
          </div>
        </section>
      </div>
      {openEditModal && <EditProfileModal user={user} onClose={() => setOpenEditModal(false)} />}
    </main>
  );
};

export default Profile;
