import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiCopy, FiMapPin, FiMail } from "react-icons/fi";
import type { Profile } from "../types";
import SectionHeading from "../components/SectionHeading";
import { sendContact } from "../api/analytics";

export default function Contact({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "warn" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await sendContact(form);
      setStatus(res.emailed ? "ok" : "warn");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section scroll-mt-24">
      <SectionHeading eyebrow="Inbox" title="Contact" />
      <div className="grid gap-12 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-5"
        >
          <p className="font-heading text-2xl font-medium leading-snug text-ink-900 dark:text-linen-50 sm:text-3xl">
            {profile.contact_invite}
          </p>
          <div className="mt-8 space-y-4 text-sm text-ink-700 dark:text-linen-200">
            <div className="flex items-center gap-2.5">
              <FiMapPin className="text-sage-600 dark:text-sage-300" />{" "}
              {profile.location}
            </div>
            <div className="flex items-center gap-2.5">
              <FiMail className="text-sage-600 dark:text-sage-300" />{" "}
              {profile.email}
              <button
                type="button"
                onClick={copy}
                className="ml-1 text-sage-600 dark:text-sage-300"
                aria-label="Copy email"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
          </div>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          onSubmit={submit}
          className="space-y-4 lg:col-span-7"
        >
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Subject (optional)"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="input-field"
          />
          <textarea
            required
            rows={5}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input-field resize-y"
          />
          <button type="submit" className="btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {status === "ok" ? (
            <p className="text-sm text-sage-600 dark:text-sage-300">
              Message accepted. Check Gmail for FormSubmit’s “Activate Form” email
              (first time only, also check Spam). After you click activate, send
              again and the message will arrive in your inbox.
            </p>
          ) : null}
          {status === "warn" ? (
            <p className="text-sm text-ink-600 dark:text-linen-200">
              Saved, but email didn’t go through — email me at {profile.email}.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm text-red-700 dark:text-red-400">
              Something went wrong. Please email me directly.
            </p>
          ) : null}
        </motion.form>
      </div>
    </section>
  );
}
