import { Star } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { ReviewDto } from "@/lib/data/types";

type ReviewListProps = {
  reviews: ReviewDto[];
  locale: string;
};

export function ReviewList({ reviews, locale }: ReviewListProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-xl glass-panel p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-medium text-text-primary">
              {review.authorName ?? "—"}
            </span>
            <div className="flex items-center gap-1 text-accent-warm">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-text-muted text-sm">{review.comment}</p>
          )}
          <time className="text-xs text-text-muted mt-2 block">
            {formatDate(review.createdAt, locale)}
          </time>
        </li>
      ))}
    </ul>
  );
}
