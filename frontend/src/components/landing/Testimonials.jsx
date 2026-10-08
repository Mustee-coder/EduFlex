import { Quote, Star } from "lucide-react";

// Illustrative placeholder stories only; replace with learner-approved testimonials.
const testimonialExamples = [
  {
    quote: "EduFlex made learning web development much easier for me. I could learn at my own pace and track my progress.",
    name: "Web Development Learner",
    detail: "Illustrative learner story",
    initials: "WD",
  },
  {
    quote: "Having my lessons and progress together helped me stay focused and keep showing up each week.",
    name: "Design Learner",
    detail: "Illustrative learner story",
    initials: "DL",
  },
  {
    quote: "The flexible format made it easier to fit learning around work and put new ideas into practice.",
    name: "Business Learner",
    detail: "Illustrative learner story",
    initials: "BL",
  },
];

const Testimonials = () => (
  <section className="bg-slate-50 py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Learning that fits real life</p>
        <h2 className="landing-heading mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Made for the way you grow</h2>
        <p className="mt-3 text-xs text-slate-500">Illustrative stories for page design; not verified reviews.</p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {testimonialExamples.map((item) => (
          <article key={item.initials} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <Quote size={21} className="text-indigo-300" aria-hidden="true" />
              <span className="flex gap-0.5 text-amber-400" aria-label="Illustrative five-star rating">
                {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={14} className="fill-current" aria-hidden="true" />)}
              </span>
            </div>
            <blockquote className="mt-5 flex-1 text-sm leading-7 text-slate-700">“{item.quote}”</blockquote>
            <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700" aria-hidden="true">{item.initials}</span>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
