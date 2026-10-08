import { Activity, BookOpen, CheckCircle2, Clock3, Play, TrendingUp } from "lucide-react";

const LearningExperience = () => (
  <section className="overflow-hidden bg-white py-20 sm:py-24">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
      <div className="order-2 lg:order-1">
        <div className="relative mx-auto max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_-35px_rgba(30,41,59,0.4)] sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-semibold text-indigo-600">LEARNING OVERVIEW</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Your week at a glance</h3>
            </div>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">This week</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-indigo-50 p-3.5 sm:p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600"><Clock3 size={17} aria-hidden="true" /></span>
              <p className="mt-3 text-xl font-extrabold text-slate-900">4.5 hrs</p>
              <p className="mt-0.5 text-xs text-slate-600">Time learning</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3.5 sm:p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-700"><CheckCircle2 size={17} aria-hidden="true" /></span>
              <p className="mt-3 text-xl font-extrabold text-slate-900">12</p>
              <p className="mt-0.5 text-xs text-slate-600">Lessons completed</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Activity size={16} className="text-indigo-600" aria-hidden="true" /> Weekly activity</div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><TrendingUp size={13} aria-hidden="true" /> +18%</span>
            </div>
            <div className="mt-5 flex h-24 items-end justify-between gap-2" role="img" aria-label="Illustrative weekly learning activity chart">
              {[38, 62, 47, 82, 55, 94, 70].map((height, index) => (
                <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div className={`w-full rounded-t-md ${index === 5 ? "bg-indigo-600" : "bg-indigo-100"}`} style={{ height: `${height}%` }} />
                  <span className="text-center text-[9px] text-slate-400">{"MTWTFSS"[index]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white"><BookOpen size={19} aria-hidden="true" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Continue your course</p>
              <p className="truncate text-sm font-bold text-slate-900">Design Foundations</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm"><Play size={14} aria-hidden="true" /></div>
          </div>
        </div>
      </div>

      <div className="order-1 max-w-xl lg:order-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Made for real progress</p>
        <h2 className="landing-heading mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Your learning journey, all in one place.</h2>
        <p className="mt-5 text-base leading-7 text-slate-600">Stay organized, track your progress, and keep learning from one simple dashboard.</p>
        <ul className="mt-7 space-y-4">
          {[
            "Pick up right where you left off",
            "See completed lessons and course progress",
            "Build a consistent learning routine",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={14} aria-hidden="true" /></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default LearningExperience;
