const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeMap[size]} border-purple-600 border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <p className="text-gray-500 text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;