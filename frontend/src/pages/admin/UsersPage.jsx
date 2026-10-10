import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Users, GraduationCap } from "lucide-react";
import StudentsTable from "@/pages/admin/StudentsTable";
import InstructorsTable from "@/pages/admin/InstructorsTable";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    {
      id: "students",
      label: "Students",
      icon: Users,
      color: "from-blue-600 to-blue-500",
    },
    {
      id: "instructors",
      label: "Instructors",
      icon: GraduationCap,
      color: "from-slate-800 to-slate-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .admin-root {
          font-family: 'Poppins', sans-serif;
        }

        .admin-title {
          font-family: 'Syne', sans-serif;
        }
      `}</style>

      <div className="admin-root mx-auto max-w-7xl">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="admin-title text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                User Management
              </h1>
              <p className="mt-2 text-sm text-slate-600 md:text-base">
                Manage students and instructors on EduFlex
              </p>
            </div>
          </div>
        </Motion.div>

        {/* Tabs */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div role="tablist" aria-label="User type" className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 sm:gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <Motion.button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`admin-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls="admin-user-tab-panel"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-11 items-center gap-2 rounded-t-lg border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-base ${
                    isActive
                      ? "border-blue-700 text-blue-800"
                      : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </Motion.button>
              );
            })}
          </div>
        </Motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <Motion.div
            id="admin-user-tab-panel"
            role="tabpanel"
            aria-labelledby={`admin-tab-${activeTab}`}
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "students" && <StudentsTable />}
            {activeTab === "instructors" && <InstructorsTable />}
          </Motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default UsersPage;
