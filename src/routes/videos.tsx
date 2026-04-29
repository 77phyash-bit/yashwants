import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload, Play, X } from "lucide-react";
import { useUploadedVideos } from "@/lib/content-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Creator Dashboard" },
      { name: "description", content: "Browse uploaded videos." },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const { videos, loading } = useUploadedVideos();
  const { isAdmin } = useAuth();
  const [active, setActive] = useState<string | null>(null);

  const action = isAdmin ? (
    <Button asChild size="sm">
      <Link to="/upload"><Upload className="w-4 h-4" /> Upload Video</Link>
    </Button>
  ) : null;

  return (
    <DashboardLayout title="Videos" subtitle={`${videos.length} video${videos.length === 1 ? "" : "s"}`} action={action}>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : videos.length === 0 ? (
        <Card className="p-12 text-center rounded-xl border-dashed border-2">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No videos yet</p>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? "Upload your first video to get started." : "Check back soon."}
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <Card key={v.id} className="overflow-hidden rounded-xl hover:shadow-md transition-shadow">
              <button
                onClick={() => setActive(v.youtube_id)}
                className="relative block w-full aspect-video bg-muted group"
              >
                <img
                  src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-0 grid place-items-center bg-foreground/30 group-hover:bg-foreground/50 transition-colors">
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-white/95 text-primary shadow-md">
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  </span>
                </span>
              </button>
              <div className="p-4">
                <p className="font-semibold text-sm line-clamp-2">{v.title}</p>
                {v.tag && <p className="text-xs text-primary mt-1">{v.tag}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(v.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-foreground/70 grid place-items-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 text-white/90 hover:text-white inline-flex items-center gap-1 text-sm"
              aria-label="Close player"
            >
              <X className="w-5 h-5" /> Close
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${active}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
