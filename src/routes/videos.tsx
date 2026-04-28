import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { VideoCard, sampleVideos } from "@/components/site/VideoCard";
import { Youtube, Upload, FileText, Image as ImageIcon, Video as VideoIcon, File as FileIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useUploadedVideos, useUploadedFiles, formatBytes } from "@/lib/content-store";
import { Card } from "@/components/ui/card";
import { YouTubeButton } from "@/components/site/YouTubeButton";

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
  const uploaded = useUploadedVideos();
  const files = useUploadedFiles();
  const allVideos = [...uploaded.map((v) => ({ id: v.id, title: v.title, tag: v.tag })), ...sampleVideos];
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
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <YouTubeButton size="md" label="Visit @brightminds-y77" />
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border font-semibold text-sm hover:bg-secondary transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload a video
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allVideos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>

        {files.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display font-bold text-3xl mb-6">Resources & Files</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((f) => (
                <Card key={f.id} className="p-4 rounded-2xl flex items-center gap-3 hover-lift">
                  <div className="w-12 h-12 rounded-xl bg-secondary grid place-items-center text-primary flex-shrink-0">
                    {f.type.startsWith("image/") ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : f.type.startsWith("video/") ? (
                      <VideoIcon className="w-5 h-5" />
                    ) : f.type.includes("pdf") || f.type.includes("text") || f.type.includes("document") ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <FileIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={f.dataUrl} download={f.name} className="font-semibold text-sm truncate hover:text-primary block">
                      {f.name}
                    </a>
                    <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}