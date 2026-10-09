import { ArrowUpRight, BookOpenCheck, GraduationCap, ShieldCheck } from "lucide-react";
import "@/index.css";

const AuthLayout = ({ title, subtitle, children }) => (
  <main className="auth-shell min-h-[100svh] bg-[#f5f7fb] px-4 py-5 sm:px-6 sm:py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:gap-8 lg:p-8 xl:gap-14 xl:p-12">
    <aside className="auth-story relative hidden min-h-[calc(100svh-4rem)] overflow-hidden rounded-[2rem] bg-[#18233b] p-10 text-white lg:flex lg:flex-col xl:p-14">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 inline-flex w-fit items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-700"><BookOpenCheck size={22} /></span>
        <span className="font-[var(--edu-font-display)] text-xl font-bold tracking-tight">EduFlex</span>
      </div>
      <div className="relative z-10 my-auto max-w-xl py-12">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-200"><GraduationCap size={15} /> A clearer path to what’s next</span>
        <h1 className="font-[var(--edu-font-display)] text-4xl font-bold leading-[1.12] tracking-tight xl:text-5xl">Make room for your next big idea.</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-slate-300">Learn at your pace, build practical skills, and keep moving toward your goals with EduFlex.</p>
        <div className="mt-10 flex items-center gap-3 text-sm text-slate-300"><ShieldCheck size={18} className="text-emerald-300" /> Your account and learning stay yours.</div>
      </div>
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400"><span>Learn with purpose.</span><span className="inline-flex items-center gap-1">EduFlex <ArrowUpRight size={13} /></span></div>
    </aside>

    <section className="flex min-h-[calc(100svh-2.5rem)] items-center justify-center lg:min-h-[calc(100svh-4rem)]">
      <div className="w-full max-w-[460px] rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_-36px_rgba(24,35,59,0.28)] sm:rounded-[1.75rem] sm:p-8 lg:p-9">
        <div className="mb-7 lg:hidden">
          <div className="inline-flex items-center gap-2.5 text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-700 text-white"><BookOpenCheck size={19} /></span>
            <span className="font-[var(--edu-font-display)] text-lg font-bold tracking-tight">EduFlex</span>
          </div>
        </div>
        <header className="mb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Your learning space</p>
          <h2 className="font-[var(--edu-font-display)] text-2xl font-bold tracking-tight text-slate-950 sm:text-[1.8rem]">{title}</h2>
          {subtitle && <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>}
        </header>
        {children}
        <footer className="mt-7 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">A thoughtful place to keep learning.</footer>
      </div>
    </section>
  </main>
);

export default AuthLayout;
