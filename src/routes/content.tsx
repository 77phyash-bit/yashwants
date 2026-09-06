import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Upload, ExternalLink, File as FileIcon, Image as ImageIcon, Video, Trash2, Download } from "lucide-react";
import { useUploadedFiles, formatBytes, removeFile } from "@/lib/content-store";
import { toast } from "sonner";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Content Writing — Creator Dashboard" },
      { name: "description", content: "Browse and manage uploaded documents." },
    ],
  }),
  component: ContentPage,
});

function ContentPage() {
  const { files: allFiles, loading } = useUploadedFiles();
  // Exclude videos and images — they live in their own sections
  const files = allFiles.filter(
    (f) => !f.type.startsWith("video/") && !f.type.startsWith("image/")
  );

  const action = (
    <Button asChild size="sm">
      <Link to="/upload"><Upload className="w-4 h-4" /> Upload Document</Link>
    </Button>
  );

  return (
    <DashboardLayout
      title="Content Writing"
      subtitle={`${files.length} document${files.length === 1 ? "" : "s"} · PDF, DOCX, TXT and more`}
      action={action}
    >
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : files.length === 0 ? (
        <Card className="p-12 text-center rounded-xl border-dashed border-2">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No documents yet</p>
          <p className="text-sm text-muted-foreground">Upload your first document to get started.</p>
        </Card>
      ) : (
        <Card className="rounded-xl divide-y divide-border">
          {files.map((f) => (
            <div key={f.id} className="p-4 flex items-center gap-4 hover:bg-secondary/40 transition-colors">
              <div className="w-11 h-11 rounded-lg bg-secondary grid place-items-center text-primary flex-shrink-0">
                <FileTypeIcon type={f.type} />
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href={f.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={f.name}
                  className="font-medium text-sm break-all hover:text-primary block"
                >
                  {f.name}
                </a>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(f.size)} · {new Date(f.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={f.public_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> Open
                </a>
              </Button>
              <Button size="sm" variant="default" asChild>
                <a href={f.public_url} download={f.name} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4" /> Download
                </a>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={async () => {
                  try { await removeFile(f); toast.success("Removed."); }
                  catch { toast.error("Could not remove."); }
                }}
                aria-label="Remove document"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </Card>
      )}
    </DashboardLayout>
  );
}

function FileTypeIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
  if (type.startsWith("video/")) return <Video className="w-5 h-5" />;
  if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheet className="w-5 h-5" />;
  if (type.includes("pdf") || type.includes("text") || type.includes("document"))
    return <FileText className="w-5 h-5" />;
  return <FileIcon className="w-5 h-5" />;
}
