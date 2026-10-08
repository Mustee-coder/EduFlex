import { ArrowRight, GraduationCap, Lightbulb, Users } from "lucide-react";
import { Link } from "react-router-dom";

const InstructorCTA = () => (
  <section id="instructor-cta" className="scroll-mt-24 bg-slate-950 py-16 sm:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-indigo-200"><GraduationCap size={15} aria-hidden="true" /> For instructors</span>
        <h2 className="landing-heading mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Turn your knowledge into impact.</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Share what you know, build your audience, and help learners develop valuable skills.</p>
        <Link to="/signup" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          Become an Instructor <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200"><Lightbulb size={21} aria-hidden="true" /></span>
          <p className="mt-5 text-sm font-bold text-white">Teach what you know</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Turn your experience into clear, useful lessons.</p>
        </div>
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5 sm:mt-9 sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200"><Users size={21} aria-hidden="true" /></span>
          <p className="mt-5 text-sm font-bold text-white">Reach learners</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Help people take a confident next step.</p>
        </div>
      </div>
    </div>
  </section>
);

export default InstructorCTA;
