import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Yashwant Singh" },
      { name: "description", content: "Sign in to manage your portfolio uploads." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/upload" });
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        toast.success("Account created! You're now signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-5 lg:px-8 py-16">
        <div className="text-center mb-8">
          <span className="inline-grid place-items-center w-14 h-14 rounded-2xl gradient-warm text-primary-foreground mx-auto mb-4 shadow-pop">
            <Lock className="w-6 h-6" />
          </span>
          <h1 className="font-display font-black text-3xl md:text-4xl">Admin Access</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to upload videos, documents and files.
          </p>
        </div>

        <Card className="p-6 lg:p-8 rounded-3xl border-2">
          <div className="inline-flex p-1 rounded-full bg-secondary mb-6 w-full">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all ${
                mode === "signin" ? "bg-background shadow-soft text-primary" : "text-foreground/70"
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all ${
                mode === "signup" ? "bg-background shadow-soft text-primary" : "text-foreground/70"
              }`}
            >
              <UserPlus className="w-4 h-4" /> Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11"
                required
                maxLength={255}
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-11"
                required
                minLength={6}
                maxLength={72}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="w-full gradient-warm text-primary-foreground border-0 hover:opacity-90"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          {user && !isAdmin && !loading && (
            <div className="mt-6 p-4 rounded-2xl bg-secondary text-sm">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-primary" /> Signed in as {user.email}
              </div>
              <p className="text-muted-foreground">
                Your account is not an admin yet. Open the backend dashboard, go to{" "}
                <strong>Database → user_roles</strong>, and add a row with your <code>user_id</code>{" "}
                and role <code>admin</code>.
              </p>
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Just visiting? <Link to="/" className="text-primary font-semibold hover:underline">Back to home</Link>
          </p>
        </Card>
      </section>
    </SiteLayout>
  );
}