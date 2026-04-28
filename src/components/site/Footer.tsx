import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Mail, Sparkles } from "lucide-react";

export const socials = [
  { href: "https://www.youtube.com/@brightminds-y77", label: "YouTube", Icon: Youtube, color: "hover:bg-primary hover:text-primary-foreground" },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook, color: "hover:bg-sky hover:text-primary-foreground" },
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram, color: "hover:bg-berry hover:text-primary-foreground" },
  { href: "mailto:hello@yashwantsingh.com", label: "Email", Icon: Mail, color: "hover:bg-leaf hover:text-primary-foreground" },
];

export function SocialRow({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-14 h-14" : size === "sm" ? "w-10 h-10" : "w-12 h-12";
  const ic = size === "lg" ? "w-6 h-6" : "w-5 h-5";
  return (
    <div className="flex flex-wrap items-center gap-3">
      {socials.map(({ href, label, Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`${sz} grid place-items-center rounded-2xl bg-card border border-border text-foreground/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop hover:rotate-[-4deg] ${color}`}
        >
          <Icon className={ic} />
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl gradient-warm text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="font-display font-black text-xl">
              Yashwant <span className="gradient-text">Singh</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Educator & content creator on a mission to make learning simple, joyful and accessible to every child.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold text-lg mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-foreground/70 hover:text-primary">About Us</Link></li>
            <li><Link to="/learning" className="text-foreground/70 hover:text-primary">Learning Content</Link></li>
            <li><Link to="/videos" className="text-foreground/70 hover:text-primary">Videos</Link></li>
            <li><Link to="/contact" className="text-foreground/70 hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-lg mb-3">Follow along</h4>
          <SocialRow />
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Yashwant Singh. Crafted with care for curious minds.
      </div>
    </footer>
  );
}