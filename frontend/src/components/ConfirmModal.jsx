const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-6 shadow-lg">

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-2">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;