const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <div className="grid gap-6">
        {/* Account Settings */}
        <div className="bg-white rounded-lg border p-5">
          <h2 className="text-lg font-semibold mb-3">
            Account Settings
          </h2>

          <button className="text-blue-600 hover:underline">
            Change Password
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border p-5">
          <h2 className="text-lg font-semibold mb-3">
            Notifications
          </h2>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Course Updates
          </label>

          <label className="flex items-center gap-3 mt-2">
            <input type="checkbox" />
            New Messages
          </label>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg border p-5">
          <h2 className="text-lg font-semibold text-red-600 mb-3">
            Danger Zone
          </h2>

          <button className="bg-red-600 text-white px-4 py-2 rounded">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;