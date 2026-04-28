import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { ArrowRight, BookOpen, Calculator, FlaskConical, Globe2, PenLine, Puzzle } from "lucide-react";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "Learning Content — Yashwant Singh" },
      { name: "description", content: "Worksheets, study guides, activities and parent resources to make learning joyful." },
      { property: "og:title", content: "Learning Content — Yashwant Singh" },
      { property: "og:description", content: "Explore worksheets, guides and activities for every learner." },
    ],
  }),
  component: LearningPage,
});

const subjects = [
  { icon: Calculator, title: "Math Mastery", desc: "Number sense, fractions, geometry, algebra basics — step-by-step.", level: "Grades 3–8", color: "bg-primary" },
  { icon: PenLine, title: "English & Reading", desc: "Comprehension, grammar drills and creative writing prompts.", level: "Grades 2–7", color: "bg-berry" },
  { icon: FlaskConical, title: "Science Lab", desc: "Hands-on experiments and concept walkthroughs that stick.", level: "Grades 4–9", color: "bg-leaf" },
  { icon: Globe2, title: "Social Studies", desc: "Geography, history and civics, brought to life with stories.", level: "Grades 5–8", color: "bg-sky" },
  { icon: Puzzle, title: "Logic & Puzzles", desc: "Brain teasers and reasoning challenges for sharp thinkers.", level: "All ages", color: "bg-sun" },
  { icon: BookOpen, title: "Parent Toolkit", desc: "Guides to support home learning and meaningful conversations.", level: "For parents", color: "bg-primary" },
];

function LearningPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-40 right-0 w-[36rem] h-[36rem] rounded-full bg-accent opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-12 text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Learning Hub</span>
          <h1 className="font-display font-black text-5xl md:text-6xl mt-3">
            Resources for <span className="gradient-text">curious learners</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            A growing library of worksheets, guides and activities — handpicked and crafted to spark understanding.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(({ icon: Icon, title, desc, level, color }) => (
            <div key={title} className="group relative bg-card border border-border rounded-3xl p-7 hover-lift overflow-hidden">
              <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full ${color} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
              <span className={`relative grid place-items-center w-14 h-14 rounded-2xl ${color} text-primary-foreground mb-5 group-hover:rotate-6 transition-transform`}>
                <Icon className="w-7 h-7" />
              </span>
              <span className="relative inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-secondary px-2.5 py-1 rounded-full mb-3">
                {level}
              </span>
              <h3 className="relative font-display font-bold text-2xl mb-2">{title}</h3>
              <p className="relative text-sm text-muted-foreground mb-5">{desc}</p>
              <Link to="/contact" className="relative inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Request resource <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}