"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ReportProblemFormProps = {
  productId: string;
  productName: string;
  locale: string;
};

export function ReportProblemForm({
  productId,
  productName,
  locale,
}: ReportProblemFormProps) {
  const t = useTranslations("products");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          type: "problem_report",
          productId,
          name: name.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          subject: `Problem report: ${productName}`,
          message: message.trim(),
          locale,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl glass-panel p-6 text-center">
        <p className="text-accent-primary font-medium">{t("reportSuccess")}</p>
        <Button
          variant="ghost"
          className="mt-3"
          onClick={() => setStatus("idle")}
        >
          {t("reportAnother")}
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-labelledby="report-problem-heading">
      <h2
        id="report-problem-heading"
        className="text-xl font-bold text-text-primary"
      >
        {t("reportProblem")}
      </h2>
      <p className="text-sm text-text-muted">{t("reportProblemHint")}</p>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl glass-panel p-6 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="report-name" className="text-sm text-text-muted">
              {t("reportName")}
            </label>
            <Input
              id="report-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="report-email" className="text-sm text-text-muted">
              {t("reportEmail")}
            </label>
            <Input
              id="report-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="report-phone" className="text-sm text-text-muted">
            {t("reportPhone")}
          </label>
          <Input
            id="report-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="report-message" className="text-sm text-text-muted">
            {t("reportMessage")}
          </label>
          <Textarea
            id="report-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1"
            required
            rows={4}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-400">{t("reportError")}</p>
        )}

        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? t("reportSubmitting") : t("reportSubmit")}
        </Button>
      </form>
    </section>
  );
}
