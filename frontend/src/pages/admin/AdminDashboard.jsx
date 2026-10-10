import React from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAdminStats } from "@/hooks/admin/hooks";
import StatCard from "./component/StatCard";
import { Users, GraduationCap, BookOpen, Wallet, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const { data, isLoading, isError, error, refetch } = useAdminStats();

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading dashboard">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white" />)}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-10">
        <section role="alert" className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-rose-600" aria-hidden="true" />
          <h1 className="text-xl font-bold text-slate-900">Dashboard data unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">{error?.message || "We couldn't load platform metrics."}</p>
          <button type="button" onClick={() => refetch()} className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Try again</button>
        </section>
      </main>
    );
  }

  const stats = data?.data || {};
  const dashboardStats = [
    { title: "Total students", value: stats.totalStudents || 0, icon: Users, color: "from-blue-600 to-blue-600", bgColor: "bg-blue-50", textColor: "text-blue-700" },
    { title: "Total instructors", value: stats.totalInstructors || 0, icon: GraduationCap, color: "from-slate-700 to-slate-700", bgColor: "bg-slate-100", textColor: "text-slate-700" },
    { title: "Total courses", value: stats.totalCourses || 0, icon: BookOpen, color: "from-indigo-600 to-indigo-600", bgColor: "bg-indigo-50", textColor: "text-indigo-700" },
    { title: "Reported revenue", value: `₦${(stats.totalRevenue || 0).toLocaleString("en-NG")}`, icon: Wallet, color: "from-sky-600 to-sky-600", bgColor: "bg-sky-50", textColor: "text-sky-700" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-700">EDUFLEX OPERATIONS</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">A current overview of platform activity.</p>
          </div>
          <Link to="/admin/users" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Manage users <span aria-hidden="true" className="ml-2">→</span></Link>
        </Motion.header>
        <section aria-label="Platform metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item, index) => (
            <Motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <StatCard {...item} />
            </Motion.div>
          ))}
        </section>
        <p className="mt-5 text-xs text-slate-500">Metrics are supplied by the platform dashboard service.</p>
      </div>
    </main>
  );
};

export default AdminDashboard;
