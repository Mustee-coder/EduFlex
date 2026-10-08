import { createElement } from "react";
import { BookOpenCheck, Clock3, ShieldCheck, TrendingUp } from "lucide-react";

const features = [
  { title: "Learn at Your Pace", description: "Study whenever and wherever you want.", icon: Clock3, color: "bg-sky-50 text-sky-700" },
  { title: "Learn from Experts", description: "Build practical knowledge from experienced instructors.", icon: BookOpenCheck, color: "bg-indigo-50 text-indigo-700" },
  { title: "Track Your Progress", description: "See your progress and stay motivated throughout your learning journey.", icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
  { title: "Secure Learning Experience", description: "Your account, progress, and payments are protected.", icon: ShieldCheck, color: "bg-violet-50 text-violet-700" },
];

const WhyEduFlex = () => (
  <section id="why-eduflex" className="scroll-mt-24 bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">A better way to learn</p>
        <h2 className="landing-heading mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Everything you need to grow</h2>
        <p className="mt-4 text-base leading-7 text-slate-600">A focused learning experience that helps you make progress and put new skills into practice.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, description, icon: Icon, color }, index) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>{createElement(Icon, { size: 22, "aria-hidden": true })}</span>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">0{index + 1}</p>
            <h3 className="mt-2 text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WhyEduFlex;
