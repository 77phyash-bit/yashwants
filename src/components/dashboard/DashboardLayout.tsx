import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Video, FileText, BookOpen, Upload, LogOut, LogIn, Menu, Youtube, Files, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useAuth, signOut } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ownerAvatar from "@/assets/owner-avatar-hd.jpg";

const nav = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/videos", label: "Videos", icon: Video },
  { to: "/images", label: "Images", icon: ImageIcon },
  { to: "/content", label: "Content Writing", icon: FileText },
  { to: "/documents", label: "Documents", icon: Files },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/upload", label: "Upload Center", icon: Upload },
];

export function DashboardLayout({ children, title, subtitle, action }: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex bg-muted/40 text-foreground">
      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 shrink-0 bg-card border-r border-border transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-border flex items-center gap-3">
          <img
            src={ownerAvatar}
            alt="Owner"
            loading="eager"
            decoding="sync"
            className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/30 shadow-md"
          />
          <div>
             <p className="font-display font-bold text-lg leading-tight text-[#1e07ed]">​YASHWANT</p>
            <p className="text-xs text-muted-foreground -mt-0.5">Dashboard</p>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {nav.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          <a
            href="https://www.youtube.com/@Brightminds-y77"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/75 hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Youtube className="w-4 h-4 text-red-600" />
            My YouTube Channel
          </a>
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-border bg-card">
          {user ? (
            <div className="space-y-2">
              <div className="px-2">
                <p className="text-xs text-muted-foreground">Signed in</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
                {isAdmin && (
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                }}
              >
                <LogOut className="w-4 h-4" /> Sign out
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary"
            >
              <LogIn className="w-4 h-4" /> Admin sign in
            </Link>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border">
          <div
            className="px-4 md:px-8 h-16 flex items-center justify-between gap-4"
            style={{
              background: "linear-gradient(135deg, #0b3d2e 0%, #145a3a 50%, #0b3d2e 100%)",
              borderBottom: "2px solid transparent",
              borderImage: "linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) 1",
              boxShadow: "0 4px 20px -4px rgba(191,149,63,0.5), inset 0 1px 0 rgba(252,246,186,0.3)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-md hover:bg-secondary"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div
                className="min-w-0 px-4 py-2 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #0b3d2e 0%, #145a3a 50%, #0b3d2e 100%)",
                  border: "2px solid transparent",
                  borderImage: "linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) 1",
                  boxShadow: "0 4px 20px -4px rgba(191,149,63,0.5), inset 0 1px 0 rgba(252,246,186,0.3)",
                }}
              >
                {title && (
                  <h1 className="font-display font-bold text-xl md:text-2xl leading-tight truncate text-[#fcf6ba]">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs md:text-sm truncate text-[#fcf6ba]/80">{subtitle}</p>
                )}
              </div>
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </header>
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}