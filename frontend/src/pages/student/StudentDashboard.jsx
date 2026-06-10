import { useAuth } from "@/context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        Welcome, {user?.firstName} 👋
      </h1>

      <p className="text-gray-600 mt-1">
        Student Dashboard
      </p>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold">My Courses</h2>
          <p className="text-gray-500">0 courses enrolled</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold">Progress</h2>
          <p className="text-gray-500">0% completed</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold">Certificates</h2>
          <p className="text-gray-500">0 earned</p>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;