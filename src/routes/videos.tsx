import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Video, Upload, Play, X, Youtube, Download, FileUp, Trash2 } from "lucide-react";
import {
  formatBytes,
  removeFile,
  uploadFile,
  useUploadedFiles,
  useUploadedVideos,
} from "@/lib/content-store";

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
  const { files } = useUploadedFiles();
  const videoFiles = files.filter((f) => f.type.startsWith("video/"));
  const [active, setActive] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<{ url: string; type: string; name: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ name: string; pct: number } | null>(null);

  const MAX = 500 * 1024 * 1024;

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(list)) {
        if (!file.type.startsWith("video/")) {
          toast.error(`${file.name} is not a video file.`);
          continue;
        }
        if (file.size > MAX) {
          toast.error(`${file.name} is too large (max 500 MB).`);
          continue;
        }
        setProgress({ name: file.name, pct: 5 });
        try {
          await uploadFile(file, (pct) => setProgress({ name: file.name, pct }));
          toast.success(`${file.name} uploaded.`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Upload failed.";
          toast.error(`${file.name}: ${msg}`);
        }
      }
    } finally {
      setBusy(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const action = (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <a href="https://www.youtube.com/@Brightminds-y77" target="_blank" rel="noopener noreferrer">
          <Youtube className="w-4 h-4 text-red-600" /> My Channel
        </a>
      </Button>
      <Button size="sm" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
        <FileUp className="w-4 h-4" /> {busy ? "Uploading…" : "Upload from PC"}
      </Button>
      <Button asChild size="sm">
        <Link to="/upload"><Upload className="w-4 h-4" /> YouTube</Link>
      </Button>
    </div>
  );

  const totalCount = videos.length + videoFiles.length;

  return (
    <DashboardLayout title="Videos" subtitle={`${totalCount} video${totalCount === 1 ? "" : "s"}`} action={action}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {progress && (
        <Card className="p-4 mb-5 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1.5 truncate">
            Uploading <span className="font-semibold text-foreground">{progress.name}</span>
          </p>
          <Progress value={progress.pct} className="h-2" />
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : totalCount === 0 ? (
        <Card className="p-12 text-center rounded-xl border-dashed border-2">
          <Video className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No videos yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a video from your PC, USB, or add a YouTube link.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => inputRef.current?.click()}>
              <FileUp className="w-4 h-4" /> Upload from PC
            </Button>
            <Button asChild variant="outline">
              <Link to="/upload"><Youtube className="w-4 h-4" /> Add YouTube</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videoFiles.map((f) => (
            <Card key={f.id} className="overflow-hidden rounded-xl hover:shadow-md transition-shadow">
              <button
                onClick={() => setActiveFile({ url: f.public_url, type: f.type, name: f.name })}
                className="relative block w-full aspect-video bg-foreground/90 group"
              >
                <video
                  src={f.public_url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                />
                <span className="absolute inset-0 grid place-items-center bg-foreground/20 group-hover:bg-foreground/40 transition-colors">
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-white/95 text-primary shadow-md">
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute top-2 left-2 text-[10px] font-semibold bg-background/90 text-foreground px-2 py-0.5 rounded">
                  FILE
                </span>
              </button>
              <div className="p-4">
                <p className="font-semibold text-sm line-clamp-2">{f.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatBytes(f.size)} · {new Date(f.created_at).toLocaleDateString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={f.public_url} download={f.name}>
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      try { await removeFile(f); toast.success("Removed."); }
                      catch { toast.error("Could not remove."); }
                    }}
                    aria-label="Remove video"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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
                <span className="absolute top-2 left-2 text-[10px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded">
                  YOUTUBE
                </span>
              </button>
              <div className="p-4">
                <p className="font-semibold text-sm line-clamp-2">{v.title}</p>
                {v.tag && <p className="text-xs text-primary mt-1">{v.tag}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(v.created_at).toLocaleDateString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={`https://www.youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer">
                      <Youtube className="w-3.5 h-3.5 text-red-600" /> Open
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={`https://www.y2mate.com/youtube/${v.youtube_id}`} target="_blank" rel="noopener noreferrer">
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </Button>
                </div>
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

      {activeFile && (
        <div
          className="fixed inset-0 z-50 bg-foreground/70 grid place-items-center p-4"
          onClick={() => setActiveFile(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveFile(null)}
              className="absolute -top-10 right-0 text-white/90 hover:text-white inline-flex items-center gap-1 text-sm"
              aria-label="Close player"
            >
              <X className="w-5 h-5" /> Close
            </button>
            <video
              src={activeFile.url}
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
