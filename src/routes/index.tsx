import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FileText, GraduationCap, Sparkles, Star, Users, Youtube } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { SocialRow } from "@/components/site/Footer";
import { VideoCard, sampleVideos } from "@/components/site/VideoCard";
import heroImg from "@/assets/yashwant-profile.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yashwant Singh — Learning Made Joyful" },
      { name: "description", content: "Educator and content creator helping students and parents with worksheets, videos and learning resources." },
      { property: "og:title", content: "Yashwant Singh — Learning Made Joyful" },
      { property: "og:description", content: "Worksheets, videos and resources for joyful learning." },
    ],
  }),
  component: Index,
});

const learningTiles = [
  { icon: FileText, title: "Worksheets", desc: "Printable practice sheets across subjects and grades.", color: "bg-sun/20 text-foreground", iconBg: "bg-sun" },
  { icon: BookOpen, title: "Study Guides", desc: "Concept-by-concept walkthroughs that actually click.", color: "bg-sky/20 text-foreground", iconBg: "bg-sky" },
  { icon: GraduationCap, title: "Parent Resources", desc: "Tips and toolkits to support learning at home.", color: "bg-leaf/20 text-foreground", iconBg: "bg-leaf" },
  { icon: Star, title: "Activities", desc: "Hands-on tasks that turn lessons into adventures.", color: "bg-berry/15 text-foreground", iconBg: "bg-berry" },
];

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[40rem] h-[40rem] rounded-full gradient-warm opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-sky opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-12 md:pt-20 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Educator · Content Creator
            </span>
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Learning,{" "}
              <span className="gradient-text">made joyful</span>{" "}
              for every curious mind.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Hi, I'm <strong className="text-foreground">Yashwant Singh</strong> — I create
              videos, worksheets and resources that make tough concepts feel simple,
              for students and parents alike.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/learning"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-warm text-primary-foreground font-semibold shadow-pop hover:scale-105 transition-transform"
              >
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://www.youtube.com/@brightminds-y77"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open("https://www.youtube.com/@brightminds-y77", "_blank", "noopener,noreferrer");
                }}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-card border border-border font-semibold hover:bg-secondary transition-colors"
              >
                <Youtube className="w-4 h-4 text-primary" /> Watch on YouTube
              </a>
            </div>

            <div className="mt-10 flex items-center gap-8">
              <div>
                <div className="font-display font-black text-3xl gradient-text">200+</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Lessons</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="font-display font-black text-3xl gradient-text">50K+</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Learners</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="font-display font-black text-3xl gradient-text">4.9★</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Rated</div>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-6 gradient-warm rounded-[2.5rem] blur-2xl opacity-30" />
            <div className="relative rounded-[2rem] overflow-hidden border border-border shadow-pop bg-card">
              <img
                src={heroImg}
                alt="Yashwant Singh — educator"
                width={1024}
                height={1024}
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 animate-fade-in">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-leaf text-primary-foreground"><Users className="w-5 h-5" /></span>
              <div>
                <div className="font-bold text-sm">Trusted by parents</div>
                <div className="text-xs text-muted-foreground">across the country</div>
              </div>
            </div>
            <div className="absolute -top-6 -right-4 bg-card border border-border rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 animate-fade-in">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-berry text-primary-foreground"><Star className="w-5 h-5" fill="currentColor" /></span>
              <div>
                <div className="font-bold text-sm">Loved by kids</div>
                <div className="text-xs text-muted-foreground">fun & easy lessons</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Videos */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Watch & Learn</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-2">My YouTube Videos</h2>
            <p className="text-muted-foreground mt-3 max-w-xl">Bite-sized lessons designed to make difficult ideas feel effortless.</p>
          </div>
          <Link to="/videos" className="inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleVideos.slice(0, 3).map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>

      {/* Learning Content */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Resources</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-2">Learning Content</h2>
            <p className="text-muted-foreground mt-3">Carefully crafted materials for students and parents — explore, download and learn.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningTiles.map(({ icon: Icon, title, desc, iconBg }) => (
              <div key={title} className="group bg-card border border-border rounded-3xl p-6 hover-lift">
                <span className={`grid place-items-center w-14 h-14 rounded-2xl ${iconBg} text-primary-foreground mb-5 group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </span>
                <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
                <Link to="/learning" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-[2rem] gradient-warm p-10 md:p-16 text-center text-primary-foreground shadow-pop">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="font-display font-black text-4xl md:text-5xl">Let's stay connected</h2>
            <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">
              Follow along on social media for daily learning tips, behind-the-scenes and free resources.
            </p>
            <div className="mt-8 flex justify-center">
              <SocialRow size="lg" />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
