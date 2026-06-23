"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { pickLocale } from "@/lib/i18n-json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateProductStatus } from "@/lib/admin/actions";
import type { ProductStatus } from "@prisma/client";

type ProductRow = {
  id: string;
  slug: string;
  status: ProductStatus;
  featured: boolean;
  nameJson: unknown;
  sortOrder: number;
  downloadCount: number;
};

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [pending, startTransition] = useTransition();

  const statusFilter = searchParams.get("status") ?? "all";
  const sort = searchParams.get("sort") ?? "sort_order";

  function applyFilters(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (!v || v === "all") params.delete(k);
      else params.set(k, v);
    });
    router.push(`/admin/products?${params.toString()}`);
  }

  let filtered = [...products];

  if (statusFilter !== "all") {
    filtered = filtered.filter((p) => p.status === statusFilter);
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.slug.includes(q) ||
        pickLocale(p.nameJson, "en").toLowerCase().includes(q) ||
        pickLocale(p.nameJson, "fa").includes(q),
    );
  }

  filtered.sort((a, b) => {
    if (sort === "name") {
      return pickLocale(a.nameJson, "en").localeCompare(
        pickLocale(b.nameJson, "en"),
      );
    }
    if (sort === "downloads") return b.downloadCount - a.downloadCount;
    return a.sortOrder - b.sortOrder;
  });

  async function setStatus(id: string, status: ProductStatus) {
    startTransition(async () => {
      await updateProductStatus(id, status);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => applyFilters({ status: v })}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => applyFilters({ sort: v })}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sort_order">Sort order</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="downloads">Downloads</SelectItem>
          </SelectContent>
        </Select>
        <Button asChild className="ms-auto">
          <Link href="/admin/products/new">New product</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-text-muted">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="hover:text-accent-primary"
                    >
                      {pickLocale(p.nameJson, "en") || p.slug}
                    </Link>
                    {p.featured && (
                      <Badge className="ms-2" variant="secondary">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-text-muted">{p.slug}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "published" ? "default" : "secondary"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.downloadCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {p.status !== "published" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() => setStatus(p.id, "published")}
                      >
                        Publish
                      </Button>
                    )}
                    {p.status === "published" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pending}
                        onClick={() => setStatus(p.id, "draft")}
                      >
                        Unpublish
                      </Button>
                    )}
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
