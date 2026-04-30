import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Video, FileText, BookOpen, ArrowRight, ExternalLink, Youtube, Upload, Download } from "lucide-react";
import { useUploadedVideos, useUploadedFiles, formatBytes } from "@/lib/content-store";
import { useBlogPosts } from "@/lib/blog-store";
import ownerAvatar from "@/assets/owner-avatar.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Creator Dashboard" },
      { name: "description", content: "Overview of your videos, documents and blog posts." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const { videos } = useUploadedVideos();
  const { files } = useUploadedFiles();
  const { posts } = useBlogPosts();

  const stats = [
    { label: "Total Videos", value: videos.length, icon: Video, to: "/videos", color: "bg-primary/10 text-primary" },
    { label: "Total Documents", value: files.length, icon: FileText, to: "/content", color: "bg-accent text-accent-foreground" },
    { label: "Total Blog Posts", value: posts.length, icon: BookOpen, to: "/blog", color: "bg-secondary text-secondary-foreground" },
  ];

  const recentVideos = videos.slice(0, 4);
  const recentFiles = files.slice(0, 5);

  return (
    <DashboardLayout title="Welcome back" subtitle="Here's what's happening with your content">
      <Card className="p-5 md:p-6 rounded-xl mb-6 flex items-center gap-4 md:gap-5 bg-gradient-to-r from-primary/5 to-accent/30 border-primary/10">
        <img
          src={ownerAvatar}
          alt="Owner"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-2 ring-primary/30 shadow-md flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-display font-bold text-xl md:text-2xl truncate">
            Hello, Creator
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload videos, documents and publish blog posts — open access.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <a
            href="https://www.youtube.com/@Brightminds-y77"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <Youtube className="w-4 h-4" /> My Channel
          </a>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload
          </Link>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.to} className="block">
              <Card className="p-5 rounded-xl border-border hover:shadow-md transition-shadow text-black">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                    <p className="font-display font-bold text-3xl mt-1">{s.value}</p>
                  </div>
                  <span className={`grid place-items-center w-11 h-11 rounded-lg ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
                <p className="mt-3 text-xs text-primary font-medium inline-flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        <Card className="p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Recent Videos</h2>
            <Link to="/videos" className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentVideos.length === 0 ? (
            <EmptyState icon={Video} text="No videos yet." />
          ) : (
            <div className="space-y-3">
              {recentVideos.map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${v.youtube_id}/mqdefault.jpg`}
                    alt={v.title}
                    className="w-20 h-12 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Recent Documents</h2>
            <Link to="/content" className="text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentFiles.length === 0 ? (
            <EmptyState icon={FileText} text="No documents yet." />
          ) : (
            <div className="space-y-2">
              {recentFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-secondary text-primary flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                  </div>
                  <a href={f.public_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-background" aria-label="Open">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                  <a href={f.public_url} download={f.name} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-background" aria-label="Download">
                    <Download className="w-4 h-4 text-primary" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
      <Icon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}