import { Link } from "react-router-dom";
import { useUserDetails, useEnrolledCourses } from "@/hooks/useProfile";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { AlertCircle, ArrowRight, BookOpen, CheckCircle2, Play, Search } from "lucide-react";

const getProgress = (course) => {
  const value = Number(course.progress?.progressPercent ?? course.progressPercentage ?? 0);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
};

const Dashboard = () => {
  const { data: user, isLoading: userLoading, error: userError } = useUserDetails();
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useEnrolledCourses();
  const loading = userLoading || coursesLoading;
  const enrolledCourses = courses?.data || [];
  const inProgress = enrolledCourses.filter((course) => getProgress(course) < 100);
  const completedCount = enrolledCourses.length - inProgress.length;
  const nextCourse = [...inProgress].sort((a, b) => getProgress(b) - getProgress(a))[0];

  if (loading) return <DashboardSkeleton />;

  if (userError || coursesError) {
    return (
      <section className="student-page mx-auto max-w-5xl px-4 py-8 sm:px-6" role="alert">
        <div className="student-panel flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <span className="student-icon-tile bg-rose-50 text-rose-700"><AlertCircle aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-slate-900">We couldn’t load your learning dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Please try again. Your account and course data haven’t been changed.</p>
          </div>
          <button type="button" onClick={() => window.location.reload()} className="student-button-secondary">Try again</button>
        </div>
      </section>
    );
  }

  return (
    <div className="student-page mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="student-eyebrow">Your learning space</p>
          <h1 className="student-heading mt-2">Welcome back{user?.data?.firstName ? `, ${user.data.firstName}` : ""}</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">Pick up where you left off and keep your momentum going.</p>
        </div>
        <Link to="/browse-courses" className="student-button-primary"><Search size={17} aria-hidden="true" /> Explore courses</Link>
      </header>

      <section aria-labelledby="continue-heading" className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="student-eyebrow">Up next</p>
            <h2 id="continue-heading" className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Continue learning</h2>
          </div>
          {enrolledCourses.length > 0 && <Link to="/my-courses" className="student-link hidden sm:inline-flex">All courses <ArrowRight size={15} aria-hidden="true" /></Link>}
        </div>

        {nextCourse ? (
          <Link to={`/course/${nextCourse._id}`} className="student-feature group grid min-w-0 overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(250px,0.82fr)]">
            <div className="flex min-w-0 flex-col justify-between p-5 sm:p-7 lg:p-9">
              <div>
                <span className="student-chip"><Play size={13} aria-hidden="true" /> In progress</span>
                <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{nextCourse.courseName}</h3>
                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-slate-600">{nextCourse.courseDescription || "Continue with your next lesson."}</p>
              </div>
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600"><span>Your progress</span><span>{getProgress(nextCourse)}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${nextCourse.courseName} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={getProgress(nextCourse)}><div className="h-full rounded-full bg-indigo-600 transition-[width]" style={{ width: `${getProgress(nextCourse)}%` }} /></div>
                <span className="student-button-primary mt-5 w-fit">Resume course <ArrowRight size={16} aria-hidden="true" /></span>
              </div>
            </div>
            <div className="student-feature-image relative min-h-48 md:min-h-full">
              {nextCourse.thumbnail ? <img src={nextCourse.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-indigo-600"><BookOpen size={48} strokeWidth={1.4} aria-hidden="true" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent md:bg-gradient-to-l md:from-transparent md:to-white/5" />
            </div>
          </Link>
        ) : (
          <div className="student-panel flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="student-icon-tile bg-indigo-50 text-indigo-700"><BookOpen aria-hidden="true" /></span>
            <div className="min-w-0 flex-1"><h3 className="text-lg font-semibold text-slate-900">{enrolledCourses.length ? "You’ve completed your courses" : "Your learning journey starts here"}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{enrolledCourses.length ? "Explore another course to keep building your skills." : "Browse courses and enroll in one that matches your goals."}</p></div>
            <Link to="/browse-courses" className="student-button-primary">Explore courses <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        )}
      </section>

      <section aria-label="Learning overview" className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="student-stat"><span className="student-icon-tile bg-indigo-50 text-indigo-700"><BookOpen aria-hidden="true" /></span><div><p className="text-sm text-slate-600">Enrolled courses</p><p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950">{enrolledCourses.length}</p></div></div>
        <div className="student-stat"><span className="student-icon-tile bg-emerald-50 text-emerald-700"><CheckCircle2 aria-hidden="true" /></span><div><p className="text-sm text-slate-600">Completed courses</p><p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950">{completedCount}</p></div></div>
      </section>

      {inProgress.length > 1 && <section aria-labelledby="more-courses-heading">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="student-eyebrow">Keep your rhythm</p><h2 id="more-courses-heading" className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Your courses</h2></div><Link to="/my-learning" className="student-link">View progress <ArrowRight size={15} aria-hidden="true" /></Link></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {inProgress.filter((course) => course._id !== nextCourse?._id).slice(0, 3).map((course) => <Link key={course._id} to={`/course/${course._id}`} className="student-course-card group">
            <div className="student-course-image">{course.thumbnail ? <img src={course.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /> : <BookOpen className="text-indigo-600" aria-hidden="true" />}</div>
            <div className="p-4"><h3 className="line-clamp-2 font-semibold text-slate-900">{course.courseName}</h3><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${getProgress(course)}%` }} /></div><p className="mt-2 text-xs text-slate-500">{getProgress(course)}% complete</p></div>
          </Link>)}
        </div>
      </section>}
    </div>
  );
};

export default Dashboard;
