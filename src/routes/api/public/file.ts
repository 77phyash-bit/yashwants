import { createFileRoute } from "@tanstack/react-router";

// Streams a public file from storage through our own origin so that
// browser extensions/ad-blockers don't block the third-party storage domain.
export const Route = createFileRoute("/api/public/file")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const path = url.searchParams.get("path");
        if (!path || path.includes("..")) {
          return new Response("Missing path", { status: 400 });
        }

        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.storage.from("uploads").download(path);
        if (error || !data) {
          return new Response("File not found", { status: 404 });
        }

        const headers = new Headers();
        headers.set("Content-Type", data.type || "application/octet-stream");
        headers.set("Content-Disposition", "inline");
        headers.set("Cache-Control", "public, max-age=3600");

        return new Response(data.stream(), { status: 200, headers });
      },
    },
  },
});
