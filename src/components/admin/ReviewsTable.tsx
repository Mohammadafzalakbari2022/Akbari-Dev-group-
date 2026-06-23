"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { pickLocale } from "@/lib/i18n-json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { moderateReview } from "@/lib/admin/actions";
import type { ReviewStatus } from "@prisma/client";

type ReviewRow = {
  id: string;
  authorName: string | null;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
  product: { nameJson: unknown; slug: string };
};

export function ReviewsTable({
  reviews,
  initialStatus,
}: {
  reviews: ReviewRow[];
  initialStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function filterStatus(status: string) {
    router.push(
      status === "all" ? "/admin/reviews" : `/admin/reviews?status=${status}`,
    );
  }

  async function act(id: string, action: "approve" | "reject" | "delete") {
    if (action === "delete" && !confirm("Delete this review?")) return;
    startTransition(async () => {
      await moderateReview(id, action);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <Select value={initialStatus} onValueChange={filterStatus}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-text-muted">
                  No reviews
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {pickLocale(r.product.nameJson, "en") || r.product.slug}
                  </TableCell>
                  <TableCell>{r.authorName ?? "Anonymous"}</TableCell>
                  <TableCell>{r.rating}★</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {r.comment ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={pending}
                          onClick={() => act(r.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={pending}
                          onClick={() => act(r.id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => act(r.id, "delete")}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
