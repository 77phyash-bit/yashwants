import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Award, Heart, Lightbulb, Target } from "lucide-react";
import profileImg from "@/assets/yashwant-profile.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Yashwant Singh" },
      { name: "description", content: "Learn about Yashwant Singh's journey as an educator, his instructional design background and his mission to simplify learning." },
      { property: "og:title", content: "About — Yashwant Singh" },
      { property: "og:description", content: "An educator on a mission to make learning simple and joyful." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Heart, title: "Empathy First", desc: "Every learner is different — lessons meet them where they are." },
  { icon: Lightbulb, title: "Clarity Always", desc: "Strip away jargon. Make the core idea unmissable." },
  { icon: Target, title: "Outcome Focused", desc: "Designed for real understanding, not just exam tricks." },
  { icon: Award, title: "Quality Crafted", desc: "Every worksheet and video is reviewed for impact." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-sun opacity-25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-20 grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 animate-scale-in">
            <div className="relative">
              <div className="absolute -inset-4 gradient-warm rounded-[2rem] blur-xl opacity-25" />
              <div className="relative rounded-[1.75rem] overflow-hidden border border-border shadow-pop bg-card aspect-[4/5]">
                <img src={profileImg} alt="Yashwant Singh portrait" loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 animate-fade-in">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">About Me</span>
            <h1 className="font-display font-black text-5xl md:text-6xl mt-3 leading-tight">
              On a mission to <span className="gradient-text">simplify learning</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              I'm Yashwant Singh — an educator, instructional designer and content creator with a
              decade of experience helping students unlock their curiosity. My journey began in
              classrooms, evolved through curriculum design, and now lives online — where I
              create videos and resources that reach thousands of families.
            </p>
            <p className="mt-4 text-muted-foreground">
              I believe great teaching is part craft, part empathy. Every lesson I create starts
              with a simple question: "How would I explain this to someone I love?"
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-card border border-border p-4">
                <div className="font-display font-black text-2xl gradient-text">10+ yrs</div>
                <div className="text-xs text-muted-foreground mt-1">Teaching experience</div>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4">
                <div className="font-display font-black text-2xl gradient-text">M.Ed</div>
                <div className="text-xs text-muted-foreground mt-1">Instructional Design</div>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4">
                <div className="font-display font-black text-2xl gradient-text">50K+</div>
                <div className="text-xs text-muted-foreground mt-1">Students reached</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">What I stand for</span>
          <h2 className="font-display font-black text-4xl md:text-5xl mt-2">My Teaching Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }, i) => {
            const colors = ["bg-primary", "bg-sky", "bg-leaf", "bg-berry"];
            return (
              <div key={title} className="bg-card border border-border rounded-3xl p-6 hover-lift">
                <span className={`grid place-items-center w-14 h-14 rounded-2xl ${colors[i]} text-primary-foreground mb-5`}>
                  <Icon className="w-7 h-7" />
                </span>
                <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}