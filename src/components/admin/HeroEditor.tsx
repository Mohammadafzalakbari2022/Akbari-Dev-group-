"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveHeroSettings, type HeroFormData } from "@/lib/admin/actions";
import { pickLocale } from "@/lib/i18n-json";

type ProductOption = { id: string; nameJson: unknown };

type Props = {
  initial: HeroFormData;
  products: ProductOption[];
};

export function HeroEditor({ initial, products }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result = await saveHeroSettings(form);
    setSaving(false);
    if (result.ok) {
      setMessage("Saved");
      router.refresh();
    } else {
      setMessage(result.error);
    }
  }

  function toggleProduct(id: string) {
    const ids = form.featured_product_ids;
    setForm({
      ...form,
      featured_product_ids: ids.includes(id)
        ? ids.filter((x) => x !== id)
        : [...ids, id],
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <LocalizedField
        label="Headline"
        value={form.headline_json}
        onChange={(v) => setForm({ ...form, headline_json: v })}
      />
      <LocalizedField
        label="Subheadline"
        value={form.subheadline_json}
        onChange={(v) => setForm({ ...form, subheadline_json: v })}
        multiline
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Stat — Products count</Label>
          <Input
            type="number"
            value={form.stat_products}
            onChange={(e) =>
              setForm({ ...form, stat_products: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Stat — Downloads count</Label>
          <Input
            type="number"
            value={form.stat_downloads}
            onChange={(e) =>
              setForm({ ...form, stat_downloads: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Featured products (orbit cards)</Label>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleProduct(p.id)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                form.featured_product_ids.includes(p.id)
                  ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                  : "border-border text-text-muted hover:border-accent-primary/50"
              }`}
            >
              {pickLocale(p.nameJson, "en")}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save hero settings"}
        </Button>
        {message && <span className="text-sm text-text-muted">{message}</span>}
      </div>
    </div>
  );
}
