import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles, Lock } from "lucide-react";
import { YouTubeButton } from "./YouTubeButton";
import { useAuth } from "@/hooks/use-auth";

const baseLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/learning", label: "Learning Content" },
  { to: "/videos", label: "Videos" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin } = useAuth();
  const links = isAdmin
    ? ([...baseLinks, { to: "/upload" as const, label: "Upload" }] as const)
    : baseLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl gradient-warm text-primary-foreground shadow-soft group-hover:rotate-6 transition-transform">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="font-display font-black text-xl md:text-2xl tracking-tight">
            Yashwant <span className="gradient-text">Singh</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-full transition-colors data-[status=active]:text-primary data-[status=active]:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
          {!isAdmin && (
            <Link
              to="/auth"
              className="px-3 py-2 text-sm font-medium text-foreground/60 hover:text-primary inline-flex items-center gap-1.5 rounded-full"
              aria-label="Admin login"
              title="Admin login"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          )}
          <YouTubeButton className="ml-3" size="sm" />
        </nav>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur animate-fade-in">
          <div className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl font-medium text-foreground/80 hover:bg-secondary data-[status=active]:bg-secondary data-[status=active]:text-primary"
              >
                {l.label}
              </Link>
            ))}
            {!isAdmin && (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl font-medium text-foreground/70 hover:bg-secondary inline-flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Admin login
              </Link>
            )}
            <div className="pt-2">
              <YouTubeButton className="w-full justify-center" size="md" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}