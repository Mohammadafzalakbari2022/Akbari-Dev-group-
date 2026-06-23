"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateContactStatus } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ContactSubmissionDto } from "@/lib/data/contact";

type ContactInboxProps = {
  submissions: ContactSubmissionDto[];
};

const typeLabels: Record<string, string> = {
  general: "General",
  support: "Support",
  pricing: "Pricing",
  problem_report: "Problem",
};

const statusVariant: Record<string, "default" | "warm" | "secondary"> = {
  new: "warm",
  read: "default",
  resolved: "secondary",
};

export function ContactInbox({ submissions }: ContactInboxProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "new" | "read" | "resolved">(
    "all",
  );
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  async function markStatus(id: string, status: "read" | "resolved") {
    setUpdating(id);
    await updateContactStatus(id, status);
    setUpdating(null);
    router.refresh();
  }

  if (submissions.length === 0) {
    return (
      <p className="text-text-muted text-sm rounded-lg border border-border p-8 text-center">
        No contact submissions yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["all", "new", "read", "resolved"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="whitespace-nowrap text-xs text-text-muted">
                  {s.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {typeLabels[s.type] ?? s.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {s.name ?? "—"}
                  {s.email && (
                    <div className="text-xs text-text-muted">{s.email}</div>
                  )}
                  {s.phone && (
                    <div className="text-xs text-text-muted">{s.phone}</div>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {s.productName ?? "—"}
                </TableCell>
                <TableCell className="max-w-xs">
                  {s.subject && (
                    <p className="text-xs font-medium truncate">{s.subject}</p>
                  )}
                  <p className="text-sm text-text-muted line-clamp-2">
                    {s.message}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[s.status] ?? "default"}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {s.status === "new" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={updating === s.id}
                        onClick={() => markStatus(s.id, "read")}
                      >
                        Mark read
                      </Button>
                    )}
                    {s.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={updating === s.id}
                        onClick={() => markStatus(s.id, "resolved")}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
