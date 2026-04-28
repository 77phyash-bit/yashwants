import { Youtube } from "lucide-react";

export const YOUTUBE_URL = "https://www.youtube.com/@brightminds-y77";
export const YOUTUBE_HANDLE = "@brightminds-y77";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  variant?: "solid" | "outline";
};

export function YouTubeButton({
  className = "",
  size = "md",
  label = YOUTUBE_HANDLE,
  variant = "solid",
}: Props) {
  const sizing =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : size === "lg"
      ? "px-7 py-4 text-base"
      : "px-5 py-2.5 text-sm";
  const styles =
    variant === "outline"
      ? "bg-card border border-border hover:bg-secondary text-foreground"
      : "gradient-warm text-primary-foreground shadow-pop hover:scale-105";
  return (
    <a
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault();
        window.open(YOUTUBE_URL, "_blank", "noopener,noreferrer");
      }}
      className={`inline-flex items-center gap-2 rounded-full font-semibold transition-all ${sizing} ${styles} ${className}`}
    >
      <Youtube className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      {label}
    </a>
  );
}