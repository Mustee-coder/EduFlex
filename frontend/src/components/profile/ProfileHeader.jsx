import React from "react";
import { Camera } from "lucide-react";

const ProfileHeader = ({ user, previewImage, profileCompletion, onEdit, fileInputRef, isUploading }) => {
  return (
    <div
      className="profile-card bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Avatar */}
        <div className="relative group flex-shrink-0">
          <img
            src={
              previewImage ||
              user?.image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}`
            }
            alt={`${user?.firstName} ${user?.lastName}`}
            className="profile-image w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-0 right-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>


        {/* User Info */}
        <div className="flex-1 text-center md:text-left">

          <h2 className="profile-title text-3xl font-black text-gray-900">
            {user?.firstName} {user?.lastName}
          </h2>

          <p className="text-gray-600 mt-1">
            📧 {user?.email}
          </p>

          <span className="inline-block mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold">
            {user?.accountType || "Student"}
          </span>


          <div className="mt-6 hidden md:block">

            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
              Profile Completion
            </p>

            <div className="flex items-center gap-3">

              <div className="flex-1 max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="progress-fill h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  style={{
                    width: `${profileCompletion}%`
                  }}
                />
              </div>

              <span className="text-sm font-bold text-gray-700">
                {profileCompletion}%
              </span>

            </div>

          </div>

        </div>


        {/* Edit */}
        <button
          onClick={onEdit}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg"
        >
          ✏️ Edit Profile
        </button>


      </div>
    </div>
  );
};

export default ProfileHeader;