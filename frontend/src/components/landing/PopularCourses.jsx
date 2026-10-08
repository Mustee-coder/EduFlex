import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock3, GraduationCap, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllCourses } from "@/services/courseService";
import { useAuth } from "@/context/AuthContext";

const CourseCard = ({ course }) => {
  const instructor = course.instructor;
  const instructorName = [instructor?.firstName, instructor?.lastName].filter(Boolean).join(" ");
  const rating = Number(course.rating);
  const studentCount = Array.isArray(course.studentsEnrolled) ? course.studentsEnrolled.length : null;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={`${course.courseName} course thumbnail`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/90" aria-hidden="true">
            <BookOpen size={44} strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-indigo-700">Popular course</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-900">{course.courseName}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{course.courseDescription || "Build practical skills with a focused, instructor-led course."}</p>
        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
          <GraduationCap size={15} className="shrink-0 text-indigo-600" aria-hidden="true" />
          <span className="truncate">{instructorName || "EduFlex instructor"}</span>
        </p>
        {(Number.isFinite(rating) || studentCount !== null) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
            {Number.isFinite(rating) && (
              <span className="inline-flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" /> {rating.toFixed(1)}</span>
            )}
            {studentCount !== null && (
              <span className="inline-flex items-center gap-1"><Users size={14} aria-hidden="true" /> {studentCount.toLocaleString()} learners</span>
            )}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Course price</p>
            <p className="mt-1 text-lg font-extrabold text-slate-900">₦{Number(course.price || 0).toLocaleString()}</p>
          </div>
          <Link
            to={`/course-preview/${course._id}`}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label={`View ${course.courseName}`}
          >
            View course <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

const CourseSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-hidden="true">
    <div className="h-44 animate-pulse bg-slate-200" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="h-3 animate-pulse rounded bg-slate-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
    </div>
  </div>
);

const PopularCourses = () => {
  const { user, loading: authLoading } = useAuth();
  const canLoadCourses = !authLoading && user?.accountType === "Student";
  const { data, isLoading, isError } = useQuery({
    queryKey: ["landing-courses", user?._id],
    queryFn: getAllCourses,
    enabled: canLoadCourses,
    retry: false,
  });

  const courses = Array.isArray(data?.data)
    ? data.data.filter((course) => course.status === "Published").slice(0, 3)
    : [];

  return (
    <section id="popular-courses" className="scroll-mt-24 bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Find your next skill</p>
            <h2 className="landing-heading mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Learn something new today</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Explore courses designed to help you build practical skills and move closer to your goals.</p>
          </div>
          <Link to="/browse-courses" className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg px-1 text-sm font-bold text-indigo-700 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 sm:self-auto">
            View All Courses <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        {authLoading || isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading popular courses">
            {[0, 1, 2].map((item) => <CourseSkeleton key={item} />)}
          </div>
        ) : isError ? (
          <div className="mt-10 rounded-2xl border border-amber-200 bg-white p-8 text-center">
            <p className="font-semibold text-slate-900">Courses are temporarily unavailable.</p>
            <p className="mt-2 text-sm text-slate-600">You can still explore the course catalog or try again later.</p>
            <Link to="/browse-courses" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">Browse courses</Link>
          </div>
        ) : courses.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => <CourseCard key={course._id} course={course} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center sm:px-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Clock3 size={22} aria-hidden="true" /></span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Your next course is waiting</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              {user?.accountType === "Student" ? "New courses are being added. Visit the catalog to see what is available." : "Create a free account to explore the EduFlex course catalog."}
            </p>
            <Link to={user?.accountType === "Student" ? "/browse-courses" : "/signup"} className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
              {user?.accountType === "Student" ? "Browse courses" : "Get started"} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCourses;
