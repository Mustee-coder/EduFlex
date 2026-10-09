import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetails } from "@/hooks/useGetCourseDetails";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Clock3, PlayCircle, Share2, Star, Users } from "lucide-react";
import { Loading } from "@/components/Loader";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetails(courseId);
  const course = data?.data?.courseDetails;
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => setOpenSections((previous) => ({ ...previous, [id]: !previous[id] }));
  const handleEnroll = () => courseId ? navigate(`/checkout/${courseId}`) : toast.error("Course ID is missing");
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: course.courseName, text: course.courseDescription, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Course link copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") toast.error("Could not share this course");
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !course) return (
    <div className="student-page mx-auto flex min-h-[60vh] max-w-5xl items-center px-4 py-8 sm:px-6">
      <div className="student-panel w-full p-6 sm:p-8" role="alert">
        <AlertCircle className="mb-3 text-rose-600" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-slate-900">Course details aren’t available</h1>
        <p className="mt-2 text-sm text-slate-600">Please try again, or return to course discovery.</p>
        <button type="button" onClick={() => navigate("/browse-courses")} className="student-button-primary mt-5">Browse courses</button>
      </div>
    </div>
  );

  const price = Number(course.price ?? course.amount ?? 0);
  const sections = course.sections || [];
  const lessons = sections.reduce((count, section) => count + (section.subSections?.length || 0), 0);
  const reviews = course.ratingAndReviews || [];
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : null;
  const enrolledCount = Array.isArray(course.studentsEnrolled) ? course.studentsEnrolled.length : null;
  const durationValue = Number(course.totalDuration || 0);
  const durationUnit = course.durationUnit || "seconds";
  const durationMinutes = durationUnit === "hours" ? durationValue * 60 : durationUnit === "minutes" ? durationValue : durationValue / 60;
  const durationLabel = durationMinutes >= 60 ? `${(durationMinutes / 60).toFixed(1)} hours of content` : `${Math.round(durationMinutes)} minutes of content`;

  return (
    <div className="student-page min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate(-1)} className="student-link min-h-11"><ArrowLeft size={17} aria-hidden="true" /> Back</button>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <main className="min-w-0">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative aspect-[16/8] max-h-[25rem] bg-slate-100">
                {course.thumbnail ? <img src={course.thumbnail} alt={`${course.courseName} course cover`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-indigo-700"><BookOpen size={52} strokeWidth={1.3} aria-hidden="true" /></div>}
              </div>
              <div className="p-5 sm:p-8">
                {course.category?.name && <p className="student-eyebrow">{course.category.name}</p>}
                <h1 className="student-heading mt-2">{course.courseName}</h1>
                <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">{course.courseDescription}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
                  <span>By <strong className="font-semibold text-slate-900">{[course.instructor?.firstName, course.instructor?.lastName].filter(Boolean).join(" ") || "Course instructor"}</strong></span>
                  {rating !== null && <span className="inline-flex items-center gap-1.5"><Star size={15} className="fill-amber-400 text-amber-500" aria-hidden="true" /><strong className="text-slate-900">{rating.toFixed(1)}</strong><span>({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span></span>}
                  {enrolledCount !== null && <span className="inline-flex items-center gap-1.5"><Users size={15} aria-hidden="true" />{enrolledCount.toLocaleString()} enrolled</span>}
                  <span className="inline-flex items-center gap-1.5"><BookOpen size={15} aria-hidden="true" />{sections.length} sections · {lessons} lessons</span>
                </div>
              </div>
            </section>

            {course.whatYouWillLearn && <section className="student-panel mt-5 p-5 sm:p-7">
              <h2 className="text-lg font-semibold text-slate-900">What you’ll learn</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{course.whatYouWillLearn}</p>
            </section>}

            <section className="student-panel mt-5 overflow-hidden">
              <div className="border-b border-slate-100 p-5 sm:p-7">
                <h2 className="text-lg font-semibold text-slate-900">Course curriculum</h2>
                <p className="mt-1 text-sm text-slate-600">{sections.length} sections · {lessons} lessons</p>
              </div>
              {sections.length ? <div className="divide-y divide-slate-100">
                {sections.map((section) => {
                  const isOpen = Boolean(openSections[section._id]);
                  return <div key={section._id}>
                    <button type="button" aria-expanded={isOpen} onClick={() => toggleSection(section._id)} className="flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 sm:px-6">
                      <span className="min-w-0"><span className="block font-medium text-slate-900">{section.sectionName}</span><span className="mt-1 block text-xs text-slate-500">{section.subSections?.length || 0} lessons</span></span>
                      {isOpen ? <ChevronUp size={18} className="shrink-0 text-slate-500" aria-hidden="true" /> : <ChevronDown size={18} className="shrink-0 text-slate-500" aria-hidden="true" />}
                    </button>
                    {isOpen && <ul className="space-y-1 bg-slate-50 px-4 py-3 sm:px-6">{section.subSections?.map((lesson) => <li key={lesson._id} className="flex items-start gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-700"><PlayCircle size={17} className="mt-0.5 shrink-0 text-indigo-600" aria-hidden="true" /><span className="min-w-0 flex-1">{lesson.title}</span>{lesson.timeDuration && <span className="shrink-0 text-xs text-slate-500"><Clock3 size={13} className="mr-1 inline" aria-hidden="true" />{lesson.timeDuration}</span>}</li>)}</ul>}
                  </div>;
                })}
              </div> : <p className="p-5 text-sm text-slate-600">The instructor hasn’t added lesson details yet.</p>}
            </section>
          </main>

          <aside className="lg:sticky lg:top-24">
            <div className="student-panel p-5 sm:p-6">
              <p className="text-sm font-medium text-slate-500">Course price</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">₦{price.toLocaleString()}</p>
              <button type="button" onClick={handleEnroll} className="student-button-primary mt-5 w-full">Enroll now <PlayCircle size={17} aria-hidden="true" /></button>
              <button type="button" onClick={handleShare} className="student-button-secondary mt-2 w-full"><Share2 size={16} aria-hidden="true" /> Share course</button>
              {durationValue > 0 && <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600"><Clock3 size={15} className="mr-2 inline" aria-hidden="true" />{durationLabel}</p>}
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />Your course access is added after successful enrollment and payment.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
