import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Upload,
  Youtube,
  FileUp,
  Trash2,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  Cloud,
  ExternalLink,
  Lock,
} from "lucide-react";
import {
  addVideo,
  extractYouTubeId,
  formatBytes,
  removeFile,
  removeVideo,
  uploadFile,
  useUploadedFiles,
  useUploadedVideos,
} from "@/lib/content-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — Creator Dashboard" },
      { name: "description", content: "Upload videos and documents." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const [tab, setTab] = useState<"video" | "file">("video");
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <DashboardLayout title="Upload Center">
        <div className="text-center text-muted-foreground py-24">Loading…</div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <DashboardLayout title="Upload Center">
        <Card className="p-10 max-w-md mx-auto text-center rounded-xl">
          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-secondary text-primary mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </span>
          <h2 className="font-display font-bold text-2xl mb-2">Admin only</h2>
          <p className="text-sm text-muted-foreground mb-5">
            You're signed in as <strong>{user.email}</strong>, but this account isn't an admin.
          </p>
          <Link to="/" className="text-sm text-primary font-semibold hover:underline">
            Back to dashboard
          </Link>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Upload Center"
      subtitle="Add videos, documents and resources"
    >
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-primary" /> Stored in cloud · up to 500&nbsp;MB per file
        </span>
      </div>

      <div className="inline-flex p-1 rounded-lg bg-secondary mb-6">
        <button
          onClick={() => setTab("video")}
          className={`px-4 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-2 transition-all ${
            tab === "video" ? "bg-background shadow-sm text-primary" : "text-foreground/70"
          }`}
        >
          <Youtube className="w-4 h-4" /> YouTube Video
        </button>
        <button
          onClick={() => setTab("file")}
          className={`px-4 py-2 rounded-md text-sm font-semibold inline-flex items-center gap-2 transition-all ${
            tab === "file" ? "bg-background shadow-sm text-primary" : "text-foreground/70"
          }`}
        >
          <FileUp className="w-4 h-4" /> Files & Documents
        </button>
      </div>

      {tab === "video" ? <VideoUploader /> : <FileUploader />}
    </DashboardLayout>
  );
}

function VideoUploader() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { videos } = useUploadedVideos();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeId(url);
    if (!id) {
      toast.error("Please enter a valid YouTube link or video ID.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please add a title for the video.");
      return;
    }
    setSubmitting(true);
    try {
      await addVideo({ youtube_id: id, title: title.trim(), tag: tag.trim() || undefined });
      toast.success("Video added!");
      setUrl("");
      setTitle("");
      setTag("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not save video.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 rounded-xl">
        <h2 className="font-display font-bold text-xl mb-1">Add a YouTube video</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Paste any YouTube URL — full link, short link, or video ID.
        </p>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">YouTube link</label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="h-11" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" className="h-11" maxLength={200} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Tag (optional)</label>
            <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Tutorial" className="h-11" maxLength={40} />
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            <Youtube className="w-4 h-4" /> {submitting ? "Adding…" : "Add to Videos"}
          </Button>
        </form>
      </Card>

      <div>
        <h3 className="font-display font-bold text-lg mb-3">
          Your videos <span className="text-muted-foreground text-sm font-normal">({videos.length})</span>
        </h3>
        {videos.length === 0 ? (
          <Card className="p-8 text-center rounded-xl border-dashed border-2">
            <Youtube className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No videos yet.</p>
          </Card>
        ) : (
          <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            {videos.map((v) => (
              <Card key={v.id} className="p-3 rounded-lg flex items-center gap-3">
                <img src={`https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`} alt={v.title} className="w-20 h-12 object-cover rounded-md flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{v.title}</p>
                  {v.tag && <p className="text-xs text-primary">{v.tag}</p>}
                </div>
                <Button size="icon" variant="ghost" onClick={async () => {
                  try { await removeVideo(v.id); toast.success("Removed."); }
                  catch { toast.error("Could not remove."); }
                }} aria-label="Remove video">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const MAX_FILE_BYTES = 500 * 1024 * 1024;

function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ name: string; pct: number } | null>(null);
  const { files } = useUploadedFiles();

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(list)) {
        if (file.size > MAX_FILE_BYTES) {
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

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card
        className={`p-8 rounded-xl border-2 border-dashed transition-all ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary text-primary-foreground grid place-items-center mb-4 shadow-md">
            <Upload className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl mb-1">Drop files here</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Videos, PDFs, Word, PowerPoint, images — up to 500 MB each.
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button type="button" size="lg" disabled={busy} onClick={() => inputRef.current?.click()}>
            <FileUp className="w-4 h-4" /> {busy ? "Uploading…" : "Choose files"}
          </Button>

          {progress && (
            <div className="mt-5 text-left">
              <p className="text-xs text-muted-foreground mb-1.5 truncate">
                Uploading <span className="font-semibold text-foreground">{progress.name}</span>
              </p>
              <Progress value={progress.pct} className="h-2" />
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1.5 justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Stored in cloud
          </p>
        </div>
      </Card>

      <div>
        <h3 className="font-display font-bold text-lg mb-3">
          Your files <span className="text-muted-foreground text-sm font-normal">({files.length})</span>
        </h3>
        {files.length === 0 ? (
          <Card className="p-8 text-center rounded-xl border-dashed border-2">
            <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No files uploaded yet.</p>
          </Card>
        ) : (
          <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            {files.map((f) => (
              <Card key={f.id} className="p-3 rounded-lg flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-secondary grid place-items-center text-primary flex-shrink-0">
                  <FileTypeIcon type={f.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <a href={f.public_url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm truncate hover:text-primary block">
                    {f.name}
                  </a>
                  <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                </div>
                <Button size="icon" variant="ghost" asChild aria-label="Open file">
                  <a href={f.public_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button size="icon" variant="ghost" onClick={async () => {
                  try { await removeFile(f); toast.success("Removed."); }
                  catch { toast.error("Could not remove."); }
                }} aria-label="Remove file">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileTypeIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
  if (type.startsWith("video/")) return <Video className="w-5 h-5" />;
  if (type.includes("pdf") || type.includes("text") || type.includes("document"))
    return <FileText className="w-5 h-5" />;
  return <FileIcon className="w-5 h-5" />;
}
