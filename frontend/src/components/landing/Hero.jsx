import { createElement } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  CirclePlay,
  Clock3,
  Flame,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const HeroProductVisual = () => (
  <div className="relative mx-auto w-full max-w-[570px]">
    <div className="absolute -right-5 -top-6 h-28 w-28 rounded-full bg-indigo-200/60 blur-2xl" aria-hidden="true" />
    <div className="absolute -bottom-5 -left-4 h-32 w-32 rounded-full bg-sky-200/70 blur-2xl" aria-hidden="true" />

    <div className="relative rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_-30px_rgba(30,41,59,0.35)] sm:p-4">
      <div className="rounded-[1.25rem] bg-slate-50 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BookOpen size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">My learning</p>
              <p className="text-[10px] text-slate-500">Your space to grow</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Learning streak · 4 days</span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Good morning, Alex</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Keep your momentum.</h2>
          </div>
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 sm:flex">
            <Sparkles size={20} aria-hidden="true" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { value: "06", label: "Courses", icon: BookOpen },
            { value: "18h", label: "Learning", icon: Clock3 },
            { value: "04", label: "Day streak", icon: Flame },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3">
              {createElement(Icon, { size: 15, className: "text-indigo-600", "aria-hidden": true })}
              <p className="mt-2 text-lg font-bold leading-none text-slate-900 sm:text-xl">{value}</p>
              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <CirclePlay size={22} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">Continue learning</p>
                <p className="truncate text-sm font-bold text-slate-900">Web Development</p>
                <p className="text-[10px] text-slate-500">Lesson 8 · Responsive layouts</p>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-slate-700">68%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-label="Course progress: 68 percent" role="img">
            <div className="h-full w-[68%] rounded-full bg-indigo-600" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-indigo-50/80 px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-600">
              <GraduationCap size={17} aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold text-slate-700">You’re making steady progress</p>
          </div>
          <TrendingUp size={17} className="shrink-0 text-indigo-600" aria-hidden="true" />
        </div>
      </div>
    </div>

    <div className="absolute -left-3 top-1/2 hidden -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-3 shadow-lg sm:block">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check size={17} aria-hidden="true" />
      </div>
      <p className="mt-2 text-[10px] font-bold text-slate-900">Lesson complete</p>
      <p className="text-[10px] text-slate-500">Nice work today</p>
    </div>
  </div>
);

const Hero = () => (
  <section className="overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-24">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
          <Sparkles size={14} aria-hidden="true" /> Build skills that move you forward
        </span>
        <h1 className="landing-heading mt-6 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Learn Skills.<br />Build Your <span className="text-indigo-600">Future.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Learn practical skills from expert instructors through flexible, engaging online courses designed to help you grow.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/browse-courses"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Explore Courses <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link
            to="/signup"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Become an Instructor
          </Link>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" aria-hidden="true" /> Learn on your schedule</span>
          <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600" aria-hidden="true" /> Track your progress</span>
        </div>
      </div>

      <HeroProductVisual />
    </div>
  </section>
);

export default Hero;
