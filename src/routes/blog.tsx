import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Send, Trash2, Download } from "lucide-react";
import { useBlogPosts, addBlogPost, removeBlogPost } from "@/lib/blog-store";
import { toast } from "sonner";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Creator Dashboard" },
      { name: "description", content: "Read and write blog posts." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { posts, loading } = useBlogPosts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    setBusy(true);
    try {
      await addBlogPost({ title: title.trim(), content: content.trim() });
      toast.success("Blog post published!");
      setTitle("");
      setContent("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not publish post.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout
      title="Blog"
      subtitle={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
    >
      <Card className="p-6 rounded-xl mb-6">
          <h2 className="font-display font-bold text-lg mb-4">Write a new post</h2>
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="h-11"
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post here…"
                rows={8}
                className="resize-y"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={busy}>
                <Send className="w-4 h-4" /> {busy ? "Posting…" : "Post"}
              </Button>
            </div>
          </form>
      </Card>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center rounded-xl border-dashed border-2">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No blog posts yet</p>
          <p className="text-sm text-muted-foreground">Use the editor above to publish your first post.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Card key={p.id} className="p-6 rounded-xl">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-display font-bold text-xl">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(p.created_at).toLocaleDateString(undefined, {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([`${p.title}\n\n${p.content}`], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${p.title.replace(/[^a-z0-9]+/gi, "_")}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4" /> Download
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      if (!confirm("Delete this post?")) return;
                      try { await removeBlogPost(p.id); toast.success("Post deleted."); }
                      catch { toast.error("Could not delete."); }
                    }}
                    aria-label="Delete post"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground/85 whitespace-pre-wrap">
                {p.content}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
