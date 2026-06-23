"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  saveTestimonial,
  deleteTestimonial,
} from "@/lib/admin/actions";
import { emptyLocale } from "@/lib/admin/types";
import type { LocalizedString } from "@/lib/i18n-json";

type TestimonialRow = {
  id: string;
  authorName: string;
  roleJson: unknown;
  quoteJson: unknown;
  avatarUrl: string | null;
  productId: string | null;
  sortOrder: number;
  published: boolean;
};

type TestimonialsEditorProps = {
  testimonials: TestimonialRow[];
  products: { id: string; name: string }[];
};

type FormState = {
  id?: string;
  authorName: string;
  role_json: LocalizedString;
  quote_json: LocalizedString;
  avatar_url: string;
  product_id: string;
  sort_order: number;
  published: boolean;
};

function emptyForm(): FormState {
  return {
    authorName: "",
    role_json: emptyLocale(),
    quote_json: emptyLocale(),
    avatar_url: "",
    product_id: "",
    sort_order: 0,
    published: false,
  };
}

export function TestimonialsEditor({
  testimonials,
  products,
}: TestimonialsEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function loadItem(item: TestimonialRow) {
    setForm({
      id: item.id,
      authorName: item.authorName,
      role_json: (item.roleJson as LocalizedString) ?? emptyLocale(),
      quote_json: (item.quoteJson as LocalizedString) ?? emptyLocale(),
      avatar_url: item.avatarUrl ?? "",
      product_id: item.productId ?? "",
      sort_order: item.sortOrder,
      published: item.published,
    });
    setMessage(null);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result = await saveTestimonial({
      id: form.id,
      author_name: form.authorName,
      role_json: form.role_json,
      quote_json: form.quote_json,
      avatar_url: form.avatar_url,
      product_id: form.product_id || null,
      sort_order: form.sort_order,
      published: form.published,
    });
    setSaving(false);
    if (result.ok) {
      setMessage("Saved");
      setForm(emptyForm());
      router.refresh();
    } else {
      setMessage(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Testimonials</h2>
          <Button size="sm" variant="outline" onClick={() => setForm(emptyForm())}>
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        <div className="space-y-2">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
            >
              <button
                type="button"
                className="text-start flex-1 hover:text-accent-primary"
                onClick={() => loadItem(t)}
              >
                <span className="font-medium">{t.authorName}</span>
                {t.published ? (
                  <span className="ms-2 text-xs text-accent-primary">live</span>
                ) : (
                  <span className="ms-2 text-xs text-text-muted">draft</span>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(t.id)}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {testimonials.length === 0 && (
            <p className="text-sm text-text-muted">No testimonials yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">
          {form.id ? "Edit" : "Add"} testimonial
        </h2>

        <div className="space-y-2">
          <Label>Author name</Label>
          <Input
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />
        </div>

        <LocalizedField
          label="Role"
          value={form.role_json}
          onChange={(v) => setForm({ ...form, role_json: v })}
        />

        <LocalizedField
          label="Quote"
          value={form.quote_json}
          onChange={(v) => setForm({ ...form, quote_json: v })}
          multiline
        />

        <FileUploadField
          label="Avatar"
          value={form.avatar_url}
          onChange={(v) => setForm({ ...form, avatar_url: v })}
          folder="testimonials"
        />

        <div className="space-y-2">
          <Label>Product (optional)</Label>
          <select
            value={form.product_id}
            onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            className="flex h-11 w-full rounded-lg border border-border bg-bg-surface px-3 text-sm"
          >
            <option value="">— None —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              setForm({ ...form, sort_order: Number(e.target.value) })
            }
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={form.published}
            onCheckedChange={(v) => setForm({ ...form, published: v })}
          />
          Published on homepage
        </label>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {message && <span className="text-sm text-text-muted">{message}</span>}
        </div>
      </div>
    </div>
  );
}
