import { Play } from "lucide-react";
import { useState } from "react";

export type VideoItem = {
  id: string;
  title: string;
  tag?: string;
};

export function VideoCard({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <div className="group rounded-3xl overflow-hidden bg-card border border-border shadow-soft hover-lift">
      <div className="relative aspect-video bg-muted">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full"
            aria-label={`Play ${video.title}`}
          >
            <img
              src={thumb}
              alt={video.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid place-items-center w-16 h-16 rounded-full gradient-warm text-primary-foreground shadow-pop transition-transform duration-300 group-hover:scale-110">
                <Play className="w-7 h-7 ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-5">
        {video.tag && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-secondary px-2.5 py-1 rounded-full mb-2">
            {video.tag}
          </span>
        )}
        <h3 className="font-display font-bold text-lg leading-snug">{video.title}</h3>
      </div>
    </div>
  );
}

export const sampleVideos: VideoItem[] = [
  { id: "dQw4w9WgXcQ", title: "Welcome to My Learning Channel", tag: "Intro" },
  { id: "tgbNymZ7vqY", title: "Mastering Math Fundamentals", tag: "Math" },
  { id: "9bZkp7q19f0", title: "Science Experiments at Home", tag: "Science" },
  { id: "kJQP7kiw5Fk", title: "Reading Comprehension Made Easy", tag: "English" },
  { id: "OPf0YbXqDm0", title: "Smart Study Habits for Kids", tag: "Tips" },
  { id: "fJ9rUzIMcZQ", title: "Fun Geography Adventures", tag: "Social Studies" },
];