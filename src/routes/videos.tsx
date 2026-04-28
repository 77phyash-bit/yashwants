import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { VideoCard, sampleVideos } from "@/components/site/VideoCard";
import { Youtube } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Yashwant Singh" },
      { name: "description", content: "Watch educational videos covering math, science, English and more." },
      { property: "og:title", content: "Videos — Yashwant Singh" },
      { property: "og:description", content: "Bite-sized lessons that make tough ideas easy." },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-primary opacity-15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
            <Youtube className="w-4 h-4" /> Video Library
          </span>
          <h1 className="font-display font-black text-5xl md:text-6xl mt-3">
            Lessons that <span className="gradient-text">click instantly</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse the full collection — from quick concept refreshers to deep-dive walkthroughs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleVideos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}