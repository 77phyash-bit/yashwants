import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, Download, Trash2, ExternalLink } from "lucide-react";
import { useUploadedFiles, formatBytes, removeFile } from "@/lib/content-store";
import { toast } from "sonner";

export const Route = createFileRoute("/images")({
  head: () => ({
    meta: [
      { title: "Images — Creator Dashboard" },
      { name: "description", content: "Browse and manage uploaded images." },
    ],
  }),
  component: ImagesPage,
});

function ImagesPage() {
  const { files: allFiles, loading } = useUploadedFiles();
  const images = allFiles.filter((f) => f.type.startsWith("image/"));

  const action = (
    <Button asChild size="sm">
      <Link to="/upload"><Upload className="w-4 h-4" /> Upload Image</Link>
    </Button>
  );

  return (
    <DashboardLayout
      title="Images"
      subtitle={`${images.length} image${images.length === 1 ? "" : "s"}`}
      action={action}
    >
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : images.length === 0 ? (
        <Card className="p-12 text-center rounded-xl border-dashed border-2">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No images yet</p>
          <p className="text-sm text-muted-foreground">Upload your first image to get started.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {images.map((f) => (
            <Card key={f.id} className="overflow-hidden rounded-xl hover:shadow-md transition-shadow">
              <a href={f.public_url} target="_blank" rel="noopener noreferrer" className="block aspect-video bg-muted">
                <img src={f.public_url} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
              </a>
              <div className="p-4">
                <p className="font-semibold text-sm truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatBytes(f.size)} · {new Date(f.created_at).toLocaleDateString()}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={f.public_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" /> Open
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={f.public_url} download={f.name}>
                      <Download className="w-3.5 h-3.5" /> Save
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      try { await removeFile(f); toast.success("Removed."); }
                      catch { toast.error("Could not remove."); }
                    }}
                    aria-label="Remove image"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
