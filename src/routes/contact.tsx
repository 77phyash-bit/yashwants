import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { SocialRow } from "@/components/site/Footer";
import { Mail, MapPin, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Yashwant Singh" },
      { name: "description", content: "Get in touch with Yashwant Singh — questions, collaborations, custom resources." },
      { property: "og:title", content: "Contact — Yashwant Singh" },
      { property: "og:description", content: "Reach out — let's talk learning." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    (e.currentTarget as HTMLFormElement).reset();
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-berry opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-12 text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Let's Connect</span>
          <h1 className="font-display font-black text-5xl md:text-6xl mt-3">
            Say <span className="gradient-text">hello</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, a collaboration idea, or need a custom resource? Drop a message — I read every one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-8 pb-20 grid lg:grid-cols-5 gap-8">
        <form onSubmit={onSubmit} className="lg:col-span-3 bg-card border border-border rounded-3xl p-7 md:p-10 shadow-soft">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Your Name" name="name" placeholder="Jane Doe" required />
            <Field label="Email" name="email" type="email" placeholder="jane@example.com" required />
          </div>
          <div className="mt-5">
            <Field label="Subject" name="subject" placeholder="How can I help?" required />
          </div>
          <div className="mt-5">
            <label className="text-sm font-semibold mb-2 block">Message</label>
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Tell me a bit about what you're looking for..."
              className="w-full px-4 py-3 rounded-2xl bg-background border border-input focus:border-primary focus:ring-4 focus:ring-primary/15 outline-none transition resize-none"
            />
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 px-7 py-4 rounded-full gradient-warm text-primary-foreground font-semibold shadow-pop hover:scale-105 transition-transform"
          >
            {sent ? "Message sent! ✨" : (<>Send Message <Send className="w-4 h-4" /></>)}
          </button>
        </form>

        <aside className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-7 hover-lift">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground mb-4">
              <Mail className="w-6 h-6" />
            </span>
            <h3 className="font-display font-bold text-xl">Email me</h3>
            <a href="mailto:hello@yashwantsingh.com" className="text-primary font-medium hover:underline">hello@yashwantsingh.com</a>
          </div>
          <div className="bg-card border border-border rounded-3xl p-7 hover-lift">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-leaf text-primary-foreground mb-4">
              <MapPin className="w-6 h-6" />
            </span>
            <h3 className="font-display font-bold text-xl">Based in</h3>
            <p className="text-muted-foreground">India · Teaching the world</p>
          </div>
          <div className="rounded-3xl gradient-warm p-7 text-primary-foreground shadow-pop">
            <h3 className="font-display font-bold text-xl mb-4">Follow along</h3>
            <SocialRow />
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-2xl bg-background border border-input focus:border-primary focus:ring-4 focus:ring-primary/15 outline-none transition"
      />
    </div>
  );
}