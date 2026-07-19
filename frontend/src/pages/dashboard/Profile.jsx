import { useUserDetails } from "@/hooks/useProfile";
import {useState} from "react"
import EditProfileModal from "@/components/profile/EditProfileModal"

const Profile = () => {
  const { data, isLoading, isError } = useUserDetails();
const [openEditModal, setOpenEditModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-80 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  const user = data?.data;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            user?.image ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}`
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h2>

          <p className="text-gray-600">{user?.email}</p>

          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-600 text-white text-sm">
            {user?.accountType}
          </span>
        </div>

        <button
        onClick={() => setOpenEditModal(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
      {openEditModal && (
  <EditProfileModal
    user={user}
    onClose={() => setOpenEditModal(false)}
  />
)}

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="font-medium">{user?.firstName || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-medium">{user?.lastName || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Contact Number</p>
            <p className="font-medium">
              {user?.additionalDetails?.contactNumber || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">
              {user?.additionalDetails?.gender || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">
              {user?.additionalDetails?.dateOfBirth || "-"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">About</p>
            <p className="font-medium">
              {user?.additionalDetails?.about || "No bio added yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Change Profile Picture */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Change Profile Picture
        </h2>

        <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Upload New Picture
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-2xl shadow p-6 border border-red-200">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Danger Zone
        </h2>

        <p className="text-gray-600 mb-4">
          Deleting your account is permanent and cannot be undone.
        </p>

        <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;