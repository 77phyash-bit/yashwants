import { useEffect, useState } from "react";

export type UploadedVideo = {
  id: string; // YouTube video id
  title: string;
  tag?: string;
  addedAt: number;
};

export type UploadedFile = {
  id: string;
  name: string;
  type: string; // mime
  size: number;
  dataUrl: string; // base64 data URL stored in localStorage
  addedAt: number;
};

const VIDEOS_KEY = "ys.uploads.videos";
const FILES_KEY = "ys.uploads.files";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("ys-content-change", { detail: { key } }));
}

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("/")[0] || null;
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export function useUploadedVideos() {
  const [videos, setVideos] = useState<UploadedVideo[]>(() => read<UploadedVideo>(VIDEOS_KEY));
  useEffect(() => {
    const handler = () => setVideos(read<UploadedVideo>(VIDEOS_KEY));
    window.addEventListener("ys-content-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("ys-content-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return videos;
}

export function addVideo(v: Omit<UploadedVideo, "addedAt">) {
  const all = read<UploadedVideo>(VIDEOS_KEY);
  if (all.some((x) => x.id === v.id)) return;
  write(VIDEOS_KEY, [{ ...v, addedAt: Date.now() }, ...all]);
}

export function removeVideo(id: string) {
  write(VIDEOS_KEY, read<UploadedVideo>(VIDEOS_KEY).filter((v) => v.id !== id));
}

export function useUploadedFiles() {
  const [files, setFiles] = useState<UploadedFile[]>(() => read<UploadedFile>(FILES_KEY));
  useEffect(() => {
    const handler = () => setFiles(read<UploadedFile>(FILES_KEY));
    window.addEventListener("ys-content-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("ys-content-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return files;
}

export function addFile(f: Omit<UploadedFile, "addedAt" | "id">) {
  const all = read<UploadedFile>(FILES_KEY);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  write(FILES_KEY, [{ ...f, id, addedAt: Date.now() }, ...all]);
}

export function removeFile(id: string) {
  write(FILES_KEY, read<UploadedFile>(FILES_KEY).filter((f) => f.id !== id));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}