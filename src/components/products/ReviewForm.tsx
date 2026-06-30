"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ReviewFormProps = {
  productId: string;
  locale: string;
};

export function ReviewForm({ productId }: ReviewFormProps) {
  const t = useTranslations("products");
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          authorName: authorName.trim() || null,
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setComment("");
      setAuthorName("");
      setRating(5);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl glass-panel p-6 text-center">
        <p className="text-accent-primary font-medium">{t("reviewSubmitted")}</p>
        <p className="mt-2 text-sm text-text-muted">{t("reviewPending")}</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          {t("submitAnotherReview")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl glass-panel p-6 space-y-4">
      <h4 className="font-semibold text-text-primary">{t("writeReview")}</h4>

      <div>
        <label className="text-sm text-text-muted block mb-2">{t("rating")}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="p-1 min-h-11 min-w-11 flex items-center justify-center"
              aria-label={`${n} stars`}
            >
              <Star
                className={`h-6 w-6 ${
                  n <= rating
                    ? "fill-accent-warm text-accent-warm"
                    : "text-text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-name" className="text-sm text-text-muted">
          {t("nameOptional")}
        </label>
        <Input
          id="review-name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="review-comment" className="text-sm text-text-muted">
          {t("comment")}
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{t("reviewError")}</p>
      )}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? t("submitting") : t("submitReview")}
      </Button>
    </form>
  );
}
