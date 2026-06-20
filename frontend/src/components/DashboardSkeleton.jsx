const DashboardSkeleton = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 animate-pulse">

      {/* HEADER SKELETON */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>

      {/* STATS SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow space-y-3">
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* COURSES SKELETON */}
      <div className="space-y-3">
        <div className="h-5 w-1/4 bg-gray-200 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
              
              {/* HEADER */}
              <div className="h-28 bg-gray-200" />

              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-5/6 bg-gray-200 rounded" />

                {/* PROGRESS BAR */}
                <div className="h-2 w-full bg-gray-200 rounded" />

                <div className="flex justify-between">
                  <div className="h-3 w-1/4 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardSkeleton;