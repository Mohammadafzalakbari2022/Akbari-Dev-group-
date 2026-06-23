"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  locale: string;
};

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact");
  const [type, setType] = useState<"general" | "support" | "pricing">("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: name.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          subject: subject.trim() || null,
          message: message.trim(),
          locale,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl glass-panel p-8 text-center">
        <p className="text-accent-primary font-medium">{t("success")}</p>
        <Button variant="ghost" className="mt-4" onClick={() => setStatus("idle")}>
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl glass-panel p-8 space-y-6">
      <div>
        <label htmlFor="contact-type" className="text-sm text-text-muted">
          {t("inquiryType")}
        </label>
        <select
          id="contact-type"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "general" | "support" | "pricing")
          }
          className="mt-1 flex h-11 w-full rounded-lg border border-border bg-bg-surface px-3 text-sm text-text-primary"
        >
          <option value="general">{t("typeGeneral")}</option>
          <option value="support">{t("typeSupport")}</option>
          <option value="pricing">{t("typePricing")}</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm text-text-muted">
            {t("name")}
          </label>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm text-text-muted">
            {t("email")}
          </label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className="text-sm text-text-muted">
          {t("phone")}
        </label>
        <Input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm text-text-muted">
          {t("subject")}
        </label>
        <Input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm text-text-muted">
          {t("message")}
        </label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{t("error")}</p>
      )}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
