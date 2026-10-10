import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Users } from "lucide-react";
import { useInstructorCourses } from "@/hooks/useInstructorCourses";

const formatNumber = (value) => Number(value || 0).toLocaleString("en-NG");
const getEnrollmentCount = (course) => course.studentsCount ?? course.studentsEnrolled?.length ?? 0;
const EMPTY_COURSES = [];

const Students = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useInstructorCourses();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const courses = data?.data ?? EMPTY_COURSES;
  const stats = data?.stats || {};

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch = course.courseName?.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "All" || course.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [courses, search, status]);

  const totalEnrollments = stats.totalStudents ?? courses.reduce(
    (total, course) => total + getEnrollmentCount(course),
    0
  );

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-semibold text-[#6C5CE7]">LEARNER ACTIVITY</p>
          <h1 className="mt-2 break-words font-[Syne] text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">Student enrollments</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review enrollment totals for your courses. A learner enrolled in multiple courses is counted in each one.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-slate-500">Course enrollments</p>{isLoading ? <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-100" /> : <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{formatNumber(totalEnrollments)}</p>}</div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C5CE7]"><Users size={21} aria-hidden="true" /></span>
            </div>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-slate-500">Courses with enrollments</p>{isLoading ? <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-100" /> : <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{formatNumber(courses.filter((course) => getEnrollmentCount(course) > 0).length)}</p>}</div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C5CE7]"><BookOpen size={21} aria-hidden="true" /></span>
            </div>
          </article>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="enrollment-courses-heading">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 id="enrollment-courses-heading" className="text-lg font-semibold text-slate-950">By course</h2><p className="mt-1 text-sm text-slate-500">{courses.length} course{courses.length === 1 ? "" : "s"}</p></div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,12rem)]">
              <label className="relative min-w-0"><span className="sr-only">Search courses</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses" className="min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6C5CE7] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15" /></label>
              <label className="min-w-0"><span className="sr-only">Filter by course status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-[#6C5CE7] focus:outline-none focus:ring-4 focus:ring-[#6C5CE7]/15"><option value="All">All statuses</option><option value="Published">Published</option><option value="Draft">Draft</option></select></label>
            </div>
          </div>

          {isError ? (
            <div className="p-8 text-center" role="alert"><h3 className="font-semibold text-slate-900">Enrollment data couldn’t load</h3><p className="mt-1 text-sm text-slate-600">Try again to reload your course data.</p><button type="button" onClick={() => refetch()} className="mt-4 rounded-lg bg-[#6C5CE7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5749C8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6C5CE7]/25">Try again</button></div>
          ) : isLoading ? (
            <div className="space-y-3 p-5" aria-label="Loading enrollment data">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-10 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><BookOpen size={22} aria-hidden="true" /></span><h3 className="mt-4 font-semibold text-slate-900">{courses.length ? "No matching courses" : "No courses yet"}</h3><p className="mt-1 text-sm text-slate-600">{courses.length ? "Adjust your search or status filter." : "Create a course to start seeing enrollment totals here."}</p>{!courses.length && <button type="button" onClick={() => navigate("/add-course")} className="mt-4 rounded-lg bg-[#6C5CE7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5749C8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6C5CE7]/25">Create course</button>}</div>
          ) : (
            <>
            <div className="space-y-3 p-4 lg:hidden">
              {filteredCourses.map((course) => (
                <article key={course._id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    {course.thumbnail ? <img src={course.thumbnail} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover" /> : <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F0EDFF] text-[#6C5CE7]"><BookOpen size={17} aria-hidden="true" /></span>}
                    <h3 className="min-w-0 flex-1 break-words text-sm font-semibold leading-5 text-slate-900">{course.courseName}</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${course.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{course.status || "Draft"}</span>
                    <span className="text-sm font-semibold tabular-nums text-slate-900">{formatNumber(getEnrollmentCount(course))} enrollments</span>
                    <button type="button" onClick={() => navigate(`/course-builder/${course._id}`)} className="min-h-11 rounded-lg px-3 py-2 font-semibold text-[#5749C8] transition-colors hover:bg-[#F0EDFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]">Manage</button>
                  </div>
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-5 py-3 font-semibold">Course</th><th scope="col" className="px-5 py-3 font-semibold">Status</th><th scope="col" className="px-5 py-3 text-right font-semibold">Enrollments</th><th scope="col" className="px-5 py-3 text-right font-semibold">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="transition-colors hover:bg-slate-50/80">
                      <th scope="row" className="w-[52%] px-5 py-4 font-medium text-slate-900"><div className="flex min-w-0 items-center gap-3">{course.thumbnail ? <img src={course.thumbnail} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" /> : <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F0EDFF] text-[#6C5CE7]"><BookOpen size={17} aria-hidden="true" /></span>}<span className="break-words">{course.courseName}</span></div></th>
                      <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${course.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{course.status || "Draft"}</span></td>
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-slate-900">{formatNumber(getEnrollmentCount(course))}</td>
                      <td className="px-5 py-4 text-right"><button type="button" onClick={() => navigate(`/course-builder/${course._id}`)} className="rounded-lg px-3 py-2 font-semibold text-[#5749C8] transition-colors hover:bg-[#F0EDFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]">Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
};

export default Students;
