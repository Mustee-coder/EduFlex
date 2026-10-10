
import React, { useMemo } from "react";
import { BookOpen, DollarSign, Users } from "lucide-react";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";
import EnrollmentTrendChart from "@/pages/instructor/component/EnrollmentTrendChart";

const formatNumber = (value) => Number(value || 0).toLocaleString("en-NG");
const enrollmentCount = (course) => course.studentsCount ?? course.studentsEnrolled?.length ?? 0;
const EMPTY_COURSES = [];

const Analytics = () => {
  const { data, isLoading, isError, refetch } = useInstructorCourses();
  const courses = data?.data ?? EMPTY_COURSES;
  const stats = data?.stats || {};
  const leadingCourses = useMemo(
    () => [...courses].sort((a, b) => enrollmentCount(b) - enrollmentCount(a)).slice(0, 5),
    [courses]
  );

  const metrics = [
    { label: "Courses", value: formatNumber(stats.totalCourses ?? courses.length), icon: BookOpen },
    { label: "Course enrollments", value: formatNumber(stats.totalStudents), icon: Users },
    { label: "Estimated revenue", value: `₦${formatNumber(stats.totalRevenue)}`, icon: DollarSign },
  ];

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-semibold text-[#6C5CE7]">PERFORMANCE</p>
          <h1 className="mt-2 font-[Syne] text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Analytics</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Course totals and monthly successful enrollments from your account data.</p>
        </header>

        {isError ? (
          <section className="rounded-2xl border border-rose-200 bg-white p-6" role="alert">
            <h2 className="font-semibold text-slate-900">Course analytics couldn’t load</h2>
            <p className="mt-1 text-sm text-slate-600">Try again to reload your Instructor data.</p>
            <button type="button" onClick={() => refetch()} className="mt-4 rounded-lg bg-[#6C5CE7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5749C8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6C5CE7]/25">Try again</button>
          </section>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {metrics.map(({ label, value, icon }) => (
                <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="text-sm font-medium text-slate-500">{label}</p>{isLoading ? <div className="mt-3 h-8 w-28 animate-pulse rounded bg-slate-100" /> : <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>}</div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C5CE7]">{React.createElement(icon, { size: 21, "aria-hidden": true })}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
              <EnrollmentTrendChart />

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="course-performance-heading">
                <div className="border-b border-slate-200 p-5">
                  <h2 id="course-performance-heading" className="text-lg font-semibold text-slate-950">Enrollments by course</h2>
                  <p className="mt-1 text-sm text-slate-500">Top courses by enrollment count</p>
                </div>
                {isLoading ? (
                  <div className="space-y-3 p-5">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div>
                ) : leadingCourses.length ? (
                  <ol className="divide-y divide-slate-100">
                    {leadingCourses.map((course) => (
                      <li key={course._id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <span className="min-w-0 truncate text-sm font-medium text-slate-800">{course.courseName}</span>
                        <span className="shrink-0 rounded-full bg-[#F0EDFF] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#5749C8]">{formatNumber(enrollmentCount(course))}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="p-6 text-sm text-slate-600">Create a course to see course performance here.</p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Analytics;
