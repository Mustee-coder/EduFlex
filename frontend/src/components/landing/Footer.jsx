import { BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer id="landing-footer" className="border-t border-slate-200 bg-slate-50">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg text-lg font-extrabold tracking-tight text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"><BookOpen size={17} aria-hidden="true" /></span>
          Edu<span className="-ml-2 text-indigo-600">Flex</span>
        </Link>
        <p className="mt-3 text-sm text-slate-600">Learn. Grow. Succeed.</p>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900">Product</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li><Link className="text-slate-600 hover:text-indigo-700" to="/browse-courses">Courses</Link></li>
          <li><Link className="text-slate-600 hover:text-indigo-700" to="/signup">Become an Instructor</Link></li>
          <li><Link className="text-slate-600 hover:text-indigo-700" to="/dashboard">Dashboard</Link></li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900">Company</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li><a className="text-slate-600 hover:text-indigo-700" href="#why-eduflex">About</a></li>
          <li><a className="text-slate-600 hover:text-indigo-700" href="#contact">Contact</a></li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900">Legal</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li><span className="text-slate-400" title="Privacy page is not available yet">Privacy Policy</span></li>
          <li><span className="text-slate-400" title="Terms page is not available yet">Terms</span></li>
        </ul>
        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-slate-400"><ExternalLink size={12} className="mt-0.5 shrink-0" aria-hidden="true" /> Legal pages are not available yet.</p>
      </div>
    </div>

    <div className="border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
      © 2026 EduFlex. All rights reserved.
    </div>
  </footer>
);

export default Footer;
