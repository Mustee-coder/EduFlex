import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => (
  <section id="contact" className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
    <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-indigo-600 px-6 py-12 text-center shadow-xl shadow-indigo-900/10 sm:px-12 sm:py-16">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white"><BookOpen size={23} aria-hidden="true" /></span>
      <h2 className="landing-heading mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to start learning?</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-indigo-100">Take the next step toward your goals with EduFlex.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/browse-courses" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600">
          Explore Courses <ArrowRight size={17} aria-hidden="true" />
        </Link>
        <Link to="/signup" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600">
          Get Started
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCTA;
