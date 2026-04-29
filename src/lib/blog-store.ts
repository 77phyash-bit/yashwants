import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

const CHANGE_EVENT = "ys-blog-change";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (!error && data) setPosts(data as BlogPost[]);
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

  return { posts, loading };
}

export async function addBlogPost(p: { title: string; content: string }) {
  const excerpt = p.content.slice(0, 160).trim();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("blog_posts").insert({
    title: p.title,
    content: p.content,
    excerpt,
    author_id: user?.id ?? null,
  });
  if (error) throw error;
  notify();
}

export async function removeBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
  notify();
}