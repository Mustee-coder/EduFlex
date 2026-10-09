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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5" onKeyDown={(event) => { if (event.key === "Escape" && !isPending) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="max-h-[min(90dvh,48rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">

        <h2 id="edit-profile-title" className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
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
              <label htmlFor="profile-first-name" className="mb-1 block text-sm font-medium text-slate-700">
                First Name
              </label>

              <input
                id="profile-first-name"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="profile-last-name" className="mb-1 block text-sm font-medium text-slate-700">
                Last Name
              </label>

              <input
                id="profile-last-name"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="profile-contact-number" className="mb-1 block text-sm font-medium text-slate-700">
                Contact Number
              </label>

              <input
                id="profile-contact-number"
                type="tel"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label htmlFor="profile-gender" className="mb-1 block text-sm font-medium text-slate-700">
                Gender
              </label>

              <select
                id="profile-gender"
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
              <label htmlFor="profile-date-of-birth" className="mb-1 block text-sm font-medium text-slate-700">
                Date of Birth
              </label>

              <input
                id="profile-date-of-birth"
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

          </div>

          <div>
            <label htmlFor="profile-about" className="mb-1 block text-sm font-medium text-slate-700">
              About
            </label>

            <textarea
              id="profile-about"
              rows="4"
              name="about"
              value={form.about}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
  <button
    type="button"
    onClick={onClose}
    disabled={isPending}
    className="student-button-secondary w-full disabled:opacity-50 sm:w-auto"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={isPending}
    className="student-button-primary w-full disabled:opacity-50 sm:w-auto"
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