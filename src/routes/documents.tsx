import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Upload, ExternalLink, File as FileIcon, Image as ImageIcon, Trash2, Download, Eye, X } from "lucide-react";
import { useUploadedFiles, formatBytes, isExcelFile, removeFile, type UploadedFile } from "@/lib/content-store";
import { toast } from "sonner";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Creator Dashboard" },
      { name: "description", content: "Browse and download all uploaded documents." },
      { property: "og:title", content: "Documents — Creator Dashboard" },
      { property: "og:description", content: "Browse and download all uploaded documents." },
    ],
  }),
  component: DocumentsPage,
});

function isPdf(f: UploadedFile): boolean {
  return f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf");
}

function DocumentsPage() {
  const { files: allFiles, loading } = useUploadedFiles();
  const [preview, setPreview] = useState<UploadedFile | null>(null);
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
      title="Documents"
      subtitle={`${files.length} document${files.length === 1 ? "" : "s"} available`}
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
                {isExcelFile(f.name, f.type) ? <FileSpreadsheet className="w-5 h-5" /> : f.type.startsWith("image/") ? <ImageIcon className="w-5 h-5" /> : f.type.includes("pdf") || f.type.includes("text") || f.type.includes("document") ? <FileText className="w-5 h-5" /> : <FileIcon className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                {isPdf(f) ? (
                  <button onClick={() => setPreview(f)} title={f.name} className="font-medium text-sm break-all hover:text-primary block text-left">
                    {f.name}
                  </button>
                ) : (
                  <a href={f.public_url} target="_blank" rel="noopener noreferrer" title={f.name} className="font-medium text-sm break-all hover:text-primary block">
                    {f.name}
                  </a>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatBytes(f.size)} · {new Date(f.created_at).toLocaleDateString()}
                </p>
              </div>
              {isPdf(f) && (
                <Button size="sm" variant="secondary" onClick={() => setPreview(f)}>
                  <Eye className="w-4 h-4" /> View
                </Button>
              )}
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
              <Button size="icon" variant="ghost" onClick={async () => {
                try { await removeFile(f); toast.success("Removed."); }
                catch { toast.error("Could not remove."); }
              }} aria-label="Remove document">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </Card>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
              <p className="font-medium text-sm truncate" title={preview.name}>{preview.name}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" asChild>
                  <a href={preview.public_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" /> Open in new tab
                  </a>
                </Button>
                <Button size="sm" variant="default" asChild>
                  <a href={preview.public_url} download={preview.name} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" /> Download
                  </a>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setPreview(null)} aria-label="Close preview">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <iframe src={preview.public_url} title={preview.name} className="flex-1 w-full bg-white" />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
