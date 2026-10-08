import { createElement } from "react";
import { ArrowDown, ArrowRight, Compass, GraduationCap, Play, TrendingUp } from "lucide-react";

const steps = [
  { number: "01", title: "Discover", description: "Find courses that match your goals.", icon: Compass },
  { number: "02", title: "Enroll", description: "Choose a course and start your learning journey.", icon: GraduationCap },
  { number: "03", title: "Learn", description: "Watch lessons, practice, and track your progress.", icon: Play },
  { number: "04", title: "Grow", description: "Build valuable skills and move toward your goals.", icon: TrendingUp },
];

const HowItWorks = () => (
  <section className="bg-slate-50 py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Your path starts here</p>
        <h2 className="landing-heading mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Start learning in four simple steps</h2>
      </div>
      <div className="relative mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-indigo-200 lg:block" aria-hidden="true" />
        {steps.map(({ number, title, description, icon: Icon }, index) => (
          <article key={number} className="relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:flex-col lg:border-0 lg:bg-transparent lg:p-0">
            <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-600 shadow-sm">
              {createElement(Icon, { size: 23, "aria-hidden": true })}
            </div>
            <div className="pt-1 lg:pt-4">
              <p className="text-xs font-bold tracking-widest text-indigo-600">STEP {number}</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
            </div>
            {index < steps.length - 1 && <ArrowDown size={16} className="absolute bottom-3 right-4 text-indigo-300 sm:hidden" aria-hidden="true" />}
            {index < steps.length - 1 && <ArrowRight size={17} className="absolute right-3 top-6 hidden text-indigo-300 lg:block" aria-hidden="true" />}
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
