import React, { useState, useRef, useEffect } from "react";
import { useUserDetails } from "@/hooks/useProfile";
import { useUpdateProfileImage } from "@/hooks/useUpdateProfileImage";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { toast } from "sonner";
import "@/index.css";
import ProfileHeader from "@/components/profile/ProfileHeader";

const Profile = () => {
  const { data, isLoading, isError } = useUserDetails();
  const user = data?.data;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.image || "");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const { mutate: uploadImage, isPending: isUploading } = useUpdateProfileImage();

useEffect(() => {
  if (user?.image) {
    setPreviewImage(user.image);
  }
}, [user]);

  // ━━ CLEANUP ━━
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // ━━ IMAGE VALIDATION ━━
  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!validTypes.includes(file.type)) {
      setUploadError("Please upload a valid image (JPG, PNG, WebP, GIF)");
      return false;
    }

    if (file.size > maxSize) {
      setUploadError("Image size must be less than 5MB");
      return false;
    }

    setUploadError("");
    return true;
  };

  // ━━ HANDLERS ━━
  const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!validateImage(file)) {
    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setSelectedImage(null);
    setPreviewImage(user?.image || "");
    e.currentTarget.value = "";
    return;
  }

  // Share old blob URL
  if (previewImage?.startsWith("blob:")) {
    URL.revokeObjectURL(previewImage);
  }

  const newPreview = URL.createObjectURL(file);

  setSelectedImage(file);
  setPreviewImage(newPreview);
};

  const handleUploadImage = () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedImage);

    uploadImage(formData, {
      onSuccess: (data) => {
        toast.success("Profile picture updated successfully! 🎉");
        setSelectedImage(null);
        setUploadError("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (err) => {
        const errMsg = err?.response?.data?.message || "Failed to upload image";
        toast.error(errMsg);
        setUploadError(errMsg);
      },
    });
  };

  // ━━ PROFILE COMPLETION ━━
  const getProfileCompletion = () => {
    if (!user) return 0;
    const fields = [
      user?.firstName,
      user?.lastName,
      user?.email,
      user?.image,
      user?.additionalDetails?.contactNumber,
      user?.additionalDetails?.gender,
      user?.additionalDetails?.dateOfBirth,
      user?.additionalDetails?.about,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const profileCompletion = getProfileCompletion();

  // ━━ SKELETON LOADER ━━
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="bg-white rounded-2xl p-6 h-48 animate-pulse" />
        <div className="bg-white rounded-2xl p-6 space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // ━━ ERROR STATE ━━
  if (isError) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Failed to Load Profile</h2>
          <p className="text-red-600 text-center mb-6">
            We couldn't load your profile information. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      

      <div className="profile-root min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8 px-0 flex-center md:px-8">
        <div className="max-w-xl mx-auto space-y-8">
            
          
          {/* Header */}
          <div>
            <h1 className="profile-title text-4xl md:text-5xl font-black text-gray-900 text-center">
              My Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your account information</p>
          </div>

          {/* ━━ PROFILE HEADER ━━ */}
          <ProfileHeader
  user={user}
  previewImage={previewImage}
  profileCompletion={profileCompletion}
  fileInputRef={fileInputRef}
  isUploading={isUploading}
  onEdit={() => setOpenEditModal(true)}
/>
          {/* ━━ PERSONAL INFORMATION ━━ */}
          <div
            className="profile-card bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="profile-title text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="p-3 bg-indigo-100 rounded-xl">ℹ️</span>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "First Name", value: user?.firstName },
                { label: "Last Name", value: user?.lastName },
                { label: "Email", value: user?.email },
                { label: "Phone Number", value: user?.additionalDetails?.contactNumber },
                { label: "Gender", value: user?.additionalDetails?.gender },
                { label: "Date of Birth", value: user?.additionalDetails?.dateOfBirth },
              ].map((field, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    {field.label}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {field.value || "Not provided"}
                  </p>
                </div>
              ))}

              {/* About Section - Full Width */}
              <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                  About You
                </p>
                <p className="text-gray-900 leading-relaxed">
                  {user?.additionalDetails?.about || "No bio added yet. Add one to help others know you better!"}
                </p>
              </div>
            </div>
          </div>

          {/* ━━ CHANGE PROFILE PICTURE ━━ */}
          <div
            className="profile-card bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-sm border border-blue-100 p-8 hover:shadow-lg transition-shadow"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="profile-title text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="p-3 bg-blue-100 rounded-xl">🖼️</span>
              Change Profile Picture
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Preview */}
            {selectedImage && (
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-600 mb-3">Preview</p>
                <div className="relative inline-block">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm font-semibold">
                <AlertCircle className="w-5 h-5" />
                {uploadError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Choose Picture
              </button>

              {selectedImage && (
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Upload Picture
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-xs text-gray-600 mt-4">
              📋 Supported: JPG, PNG, WebP, GIF (Max 5MB)
            </p>
          </div>
        </div>

        {/* Edit Modal */}
        {openEditModal && (
          <EditProfileModal
            user={user}
            onClose={() => setOpenEditModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
