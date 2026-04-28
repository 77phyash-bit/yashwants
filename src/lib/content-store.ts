import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UploadedVideo = {
  id: string; // row id
  youtube_id: string;
  title: string;
  tag?: string | null;
  created_at: string;
};

export type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  storage_path: string;
  public_url: string;
  created_at: string;
};

const CHANGE_EVENT = "ys-content-change";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
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

/* ---------- Videos ---------- */

export function useUploadedVideos() {
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("uploaded_videos")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (!error && data) setVideos(data as UploadedVideo[]);
      setLoading(false);
    };
    load();
    const handler = () => load();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => {
      active = false;
      window.removeEventListener(CHANGE_EVENT, handler);
    };
  }, []);

  return { videos, loading };
}

export async function addVideo(v: { youtube_id: string; title: string; tag?: string }) {
  const { error } = await supabase.from("uploaded_videos").insert({
    youtube_id: v.youtube_id,
    title: v.title,
    tag: v.tag || null,
  });
  if (error) throw error;
  notify();
}

export async function removeVideo(id: string) {
  const { error } = await supabase.from("uploaded_videos").delete().eq("id", id);
  if (error) throw error;
  notify();
}

/* ---------- Files ---------- */

export function useUploadedFiles() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("uploaded_files")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (!error && data) setFiles(data as UploadedFile[]);
      setLoading(false);
    };
    load();
    const handler = () => load();
    window.addEventListener(CHANGE_EVENT, handler);
    return () => {
      active = false;
      window.removeEventListener(CHANGE_EVENT, handler);
    };
  }, []);

  return { files, loading };
}

export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadedFile> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  // supabase-js v2 doesn't expose granular progress; emit start & end.
  onProgress?.(10);
  const { error: upErr } = await supabase.storage
    .from("uploads")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (upErr) throw upErr;
  onProgress?.(80);

  const { data: pub } = supabase.storage.from("uploads").getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  const { data, error: insErr } = await supabase
    .from("uploaded_files")
    .insert({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      storage_path: path,
      public_url: publicUrl,
    })
    .select()
    .single();
  if (insErr) throw insErr;

  onProgress?.(100);
  notify();
  return data as UploadedFile;
}

export async function removeFile(item: UploadedFile) {
  await supabase.storage.from("uploads").remove([item.storage_path]);
  const { error } = await supabase.from("uploaded_files").delete().eq("id", item.id);
  if (error) throw error;
  notify();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}