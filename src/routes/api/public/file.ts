import { createFileRoute } from "@tanstack/react-router";

// Streams a public file from storage through our own origin so that
// browser extensions/ad-blockers don't block the third-party domain.
export const Route = createFileRoute("/api/public/file")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const path = url.searchParams.get("path");
        if (!path || path.includes("..")) {
          return new Response("Missing path", { status: 400 });
        }

        const base = process.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
        const key =
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!base || !key) return new Response("Storage not configured", { status: 500 });

        const target = `${base}/storage/v1/object/public/uploads/${path}`;
        const upstream = await fetch(target, { headers: { apikey: key } });
        if (!upstream.ok || !upstream.body) {
          return new Response("File not found", { status: upstream.status || 404 });
        }

        const headers = new Headers();
        headers.set(
          "Content-Type",
          upstream.headers.get("content-type") || "application/octet-stream"
        );
        headers.set("Content-Disposition", "inline");
        headers.set("Cache-Control", "public, max-age=3600");

        return new Response(upstream.body, { status: 200, headers });
      },
    },
  },
});
