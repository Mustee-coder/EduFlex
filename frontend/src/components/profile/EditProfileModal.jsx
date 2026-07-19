import { useState } from "react";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";

const EditProfileModal = ({ user, onClose }) => {
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    gender: user?.additionalDetails?.gender || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    about: user?.additionalDetails?.about || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const { mutate, isPending } = useUpdateProfile();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(form, {
  onSuccess: () => {
    onClose();
  },
});
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold">
          Edit Profile
        </h2>

        <p className="text-gray-500 mb-6">
          Update your personal information.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm mb-1">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Contact Number
              </label>

              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">
                Date of Birth
              </label>

              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm mb-1">
              About
            </label>

            <textarea
              rows="4"
              name="about"
              value={form.about}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-end gap-3">
  <button
    type="button"
    onClick={onClose}
    disabled={isPending}
    className="px-5 py-2 rounded-lg border disabled:opacity-50"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={isPending}
    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
  >
    {isPending ? "Saving..." : "Save Changes"}
  </button>
</div>
        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;