import { createElement } from "react";
import { BookOpen, GraduationCap, Smile, Users } from "lucide-react";

// Presentation placeholders; replace when a public statistics API is available.
const stats = [
  { value: "10K+", label: "Students", icon: Users },
  { value: "250+", label: "Courses", icon: BookOpen },
  { value: "50+", label: "Instructors", icon: GraduationCap },
  { value: "95%", label: "Satisfaction", icon: Smile },
];

const Stats = () => (
  <section aria-label="EduFlex at a glance" className="border-y border-slate-100 bg-white">
    <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-100 px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
      {stats.map(({ value, label, icon: Icon }) => (
        <div key={label} className="flex items-center justify-center gap-3 px-3 py-6 sm:gap-4 sm:py-8">
          <span className="hidden h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:flex">
            {createElement(Icon, { size: 20, "aria-hidden": true })}
          </span>
          <div className="text-center sm:text-left">
            <p className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;
