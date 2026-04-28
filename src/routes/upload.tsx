import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Youtube, FileUp, Trash2, CheckCircle2, FileText, Image as ImageIcon, Video, File as FileIcon } from "lucide-react";
import {
  addFile,
  addVideo,
  extractYouTubeId,
  fileToDataUrl,
  formatBytes,
  removeFile,
  removeVideo,
  useUploadedFiles,
  useUploadedVideos,
} from "@/lib/content-store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — Yashwant Singh" },
      { name: "description", content: "Upload videos and learning resources to your portfolio." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const [tab, setTab] = useState<"video" | "file">("video");

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-primary opacity-15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-5 lg:px-8 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wider">
            <Upload className="w-4 h-4" /> Upload Center
          </span>
          <h1 className="font-display font-black text-4xl md:text-6xl mt-3">
            Add your <span className="gradient-text">content</span> in seconds.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste a YouTube link or drop a file — it appears on your site instantly.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 lg:px-8 pb-20">
        <div className="inline-flex p-1 rounded-full bg-secondary mb-8">
          <button
            onClick={() => setTab("video")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition-all ${
              tab === "video" ? "bg-background shadow-soft text-primary" : "text-foreground/70"
            }`}
          >
            <Youtube className="w-4 h-4" /> YouTube Video
          </button>
          <button
            onClick={() => setTab("file")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition-all ${
              tab === "file" ? "bg-background shadow-soft text-primary" : "text-foreground/70"
            }`}
          >
            <FileUp className="w-4 h-4" /> File / Resource
          </button>
        </div>

        {tab === "video" ? <VideoUploader /> : <FileUploader />}
      </section>
    </SiteLayout>
  );
}

function VideoUploader() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const videos = useUploadedVideos();

  const handleAdd = (e: React.FormEvent) => {
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
    addVideo({ id, title: title.trim(), tag: tag.trim() || undefined });
    toast.success("Video added! It now appears on the Videos page.");
    setUrl("");
    setTitle("");
    setTag("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="p-6 lg:p-8 rounded-3xl border-2">
        <h2 className="font-display font-bold text-2xl mb-1">Add a YouTube video</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Paste any YouTube URL — full link, short link, or just the video ID.
        </p>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">YouTube link</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="h-11"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mastering Algebra in 10 minutes"
              className="h-11"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Tag (optional)</label>
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Math, Science, English…"
              className="h-11"
            />
          </div>
          <Button type="submit" size="lg" className="w-full gradient-warm text-primary-foreground border-0 hover:opacity-90">
            <Youtube className="w-4 h-4" /> Add to Videos
          </Button>
        </form>
      </Card>

      <div>
        <h3 className="font-display font-bold text-xl mb-4">
          Your videos <span className="text-muted-foreground text-base font-normal">({videos.length})</span>
        </h3>
        {videos.length === 0 ? (
          <Card className="p-8 text-center rounded-3xl border-dashed border-2">
            <Youtube className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No videos yet. Add your first one!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {videos.map((v) => (
              <Card key={v.id} className="p-3 rounded-2xl flex items-center gap-3 hover-lift">
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-24 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{v.title}</p>
                  {v.tag && <p className="text-xs text-primary">{v.tag}</p>}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeVideo(v.id);
                    toast.success("Video removed.");
                  }}
                  aria-label="Remove video"
                >
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

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB safe for localStorage

function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const files = useUploadedFiles();

  const handleFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(list)) {
        if (file.size > MAX_FILE_BYTES) {
          toast.error(`${file.name} is too large (max 4 MB in browser storage).`);
          continue;
        }
        const dataUrl = await fileToDataUrl(file);
        addFile({ name: file.name, type: file.type || "application/octet-stream", size: file.size, dataUrl });
        toast.success(`${file.name} uploaded.`);
      }
    } catch {
      toast.error("Something went wrong while reading the file.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card
        className={`p-8 rounded-3xl border-2 border-dashed transition-all ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-warm grid place-items-center text-primary-foreground mb-4 shadow-pop">
            <Upload className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-1">Drop files here</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Or click below to browse. PDFs, images, docs, short videos — up to 4 MB each.
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            size="lg"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="gradient-warm text-primary-foreground border-0 hover:opacity-90"
          >
            <FileUp className="w-4 h-4" /> {busy ? "Uploading…" : "Choose files"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1.5 justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Stored privately in your browser
          </p>
        </div>
      </Card>

      <div>
        <h3 className="font-display font-bold text-xl mb-4">
          Your files <span className="text-muted-foreground text-base font-normal">({files.length})</span>
        </h3>
        {files.length === 0 ? (
          <Card className="p-8 text-center rounded-3xl border-dashed border-2">
            <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No files uploaded yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {files.map((f) => (
              <Card key={f.id} className="p-3 rounded-2xl flex items-center gap-3 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-secondary grid place-items-center text-primary flex-shrink-0">
                  <FileTypeIcon type={f.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={f.dataUrl}
                    download={f.name}
                    className="font-semibold text-sm truncate hover:text-primary block"
                  >
                    {f.name}
                  </a>
                  <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeFile(f.id);
                    toast.success("File removed.");
                  }}
                  aria-label="Remove file"
                >
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