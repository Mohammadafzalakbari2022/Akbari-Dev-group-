"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import {
  defaultProductForm,
  emptyLocale,
  type ProductFormData,
  type FeatureItem,
  type PlatformFormItem,
  type ScreenshotFormItem,
  type GuideFormItem,
  type ChangelogFormItem,
} from "@/lib/admin/types";
import { saveProduct, deleteProduct } from "@/lib/admin/actions";
import type { GuideType, PlatformType } from "@prisma/client";

const PLATFORMS: PlatformType[] = [
  "android",
  "ios",
  "web",
  "desktop",
  "database",
  "other",
];

const GUIDE_TYPES: GuideType[] = [
  "video",
  "pdf",
  "steps",
  "external_link",
  "gallery",
  "faq",
];

type Props = {
  productId?: string;
  initial?: ProductFormData;
};

export function ProductEditor({ productId, initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(initial ?? defaultProductForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await saveProduct(productId ?? null, form);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (!productId && result.id) {
      router.push(`/admin/products/${result.id}`);
    } else {
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!productId) return;
    if (!confirm("Delete this product permanently?")) return;
    const result = await deleteProduct(productId);
    if (result.ok) router.push("/admin/products");
    else setError(result.error);
  }

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          {productId ? "Edit Product" : "New Product"}
        </h1>
        <div className="flex gap-2">
          {productId && (
            <Button variant="outline" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 rounded-lg border border-red-400/30 p-3">
          {error}
        </p>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="purpose">Purpose</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="guides">How to Use</TabsTrigger>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <LocalizedField
            label="Name"
            value={form.name_json}
            onChange={(v) => update("name_json", v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="khayat"
              />
            </div>
            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => update("sort_order", Number(e.target.value))}
              />
            </div>
          </div>
          <LocalizedField
            label="Tagline"
            value={form.tagline_json}
            onChange={(v) => update("tagline_json", v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FileUploadField
              label="Icon"
              value={form.icon_url}
              onChange={(v) => update("icon_url", v)}
              folder="products/icons"
            />
            <FileUploadField
              label="Cover image"
              value={form.cover_url}
              onChange={(v) => update("cover_url", v)}
              folder="products/covers"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  update("status", v as ProductFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>New badge until</Label>
              <Input
                type="date"
                value={form.is_new_until}
                onChange={(e) => update("is_new_until", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => update("featured", v)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={form.is_new}
                onCheckedChange={(v) => update("is_new", v)}
              />
              New badge
            </label>
          </div>
        </TabsContent>

        <TabsContent value="purpose" className="mt-4">
          <LocalizedField
            label="What is this built for?"
            value={form.purpose_json}
            onChange={(v) => update("purpose_json", v)}
            multiline
          />
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          {form.features_json.map((feat, i) => (
            <FeatureRow
              key={i}
              item={feat}
              onChange={(item) => {
                const next = [...form.features_json];
                next[i] = item;
                update("features_json", next);
              }}
              onRemove={() =>
                update(
                  "features_json",
                  form.features_json.filter((_, j) => j !== i),
                )
              }
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              update("features_json", [
                ...form.features_json,
                {
                  icon: "star",
                  title_json: emptyLocale(),
                  description_json: emptyLocale(),
                },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add feature
          </Button>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4 mt-4">
          {form.platforms.map((p, i) => (
            <PlatformRow
              key={i}
              item={p}
              onChange={(item) => {
                const next = [...form.platforms];
                next[i] = item;
                update("platforms", next);
              }}
              onRemove={() =>
                update(
                  "platforms",
                  form.platforms.filter((_, j) => j !== i),
                )
              }
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              update("platforms", [
                ...form.platforms,
                {
                  platform: "android",
                  version: "",
                  file_size: "",
                  min_os: "",
                  download_url: "",
                  is_active: true,
                  sort_order: form.platforms.length,
                },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add platform
          </Button>
        </TabsContent>

        <TabsContent value="screenshots" className="space-y-4 mt-4">
          {form.screenshots.map((s, i) => (
            <ScreenshotRow
              key={i}
              item={s}
              onChange={(item) => {
                const next = [...form.screenshots];
                next[i] = item;
                update("screenshots", next);
              }}
              onRemove={() =>
                update(
                  "screenshots",
                  form.screenshots.filter((_, j) => j !== i),
                )
              }
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              update("screenshots", [
                ...form.screenshots,
                {
                  url: "",
                  caption_json: emptyLocale(),
                  sort_order: form.screenshots.length,
                },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add screenshot
          </Button>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4 mt-4">
          {PLATFORMS.map((plat) => (
            <LocalizedField
              key={plat}
              label={`Requirements — ${plat}`}
              value={form.requirements_json[plat] ?? emptyLocale()}
              onChange={(v) =>
                update("requirements_json", {
                  ...form.requirements_json,
                  [plat]: v,
                })
              }
              multiline
            />
          ))}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4 mt-4">
          {form.guides.map((g, i) => (
            <GuideRow
              key={i}
              item={g}
              onChange={(item) => {
                const next = [...form.guides];
                next[i] = item;
                update("guides", next);
              }}
              onRemove={() =>
                update(
                  "guides",
                  form.guides.filter((_, j) => j !== i),
                )
              }
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              update("guides", [
                ...form.guides,
                {
                  type: "video",
                  title_json: emptyLocale(),
                  content_json: {},
                  file_url: "",
                  external_url: "",
                  sort_order: form.guides.length,
                  is_published: true,
                },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add guide
          </Button>
        </TabsContent>

        <TabsContent value="changelog" className="space-y-4 mt-4">
          {form.changelog.map((c, i) => (
            <ChangelogRow
              key={i}
              item={c}
              onChange={(item) => {
                const next = [...form.changelog];
                next[i] = item;
                update("changelog", next);
              }}
              onRemove={() =>
                update(
                  "changelog",
                  form.changelog.filter((_, j) => j !== i),
                )
              }
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              update("changelog", [
                ...form.changelog,
                {
                  version: "1.0.0",
                  date: new Date().toISOString().slice(0, 10),
                  notes_json: emptyLocale(),
                  platform: "",
                },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add changelog entry
          </Button>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <LocalizedField
            label="Meta title"
            value={form.seo_json.title_json}
            onChange={(v) =>
              update("seo_json", { ...form.seo_json, title_json: v })
            }
          />
          <LocalizedField
            label="Meta description"
            value={form.seo_json.description_json}
            onChange={(v) =>
              update("seo_json", { ...form.seo_json, description_json: v })
            }
            multiline
          />
          <div className="space-y-2">
            <Label>OG image URL</Label>
            <Input
              value={form.seo_json.og_image}
              onChange={(e) =>
                update("seo_json", {
                  ...form.seo_json,
                  og_image: e.target.value,
                })
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FeatureRow({
  item,
  onChange,
  onRemove,
}: {
  item: FeatureItem;
  onChange: (item: FeatureItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex justify-between">
        <Label>Feature</Label>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Label>Icon name (lucide)</Label>
        <Input
          value={item.icon}
          onChange={(e) => onChange({ ...item, icon: e.target.value })}
        />
      </div>
      <LocalizedField
        label="Title"
        value={item.title_json}
        onChange={(v) => onChange({ ...item, title_json: v })}
      />
      <LocalizedField
        label="Description"
        value={item.description_json}
        onChange={(v) => onChange({ ...item, description_json: v })}
        multiline
      />
    </div>
  );
}

function PlatformRow({
  item,
  onChange,
  onRemove,
}: {
  item: PlatformFormItem;
  onChange: (item: PlatformFormItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex justify-between">
        <Select
          value={item.platform}
          onValueChange={(v) =>
            onChange({ ...item, platform: v as PlatformType })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Version</Label>
          <Input
            value={item.version}
            onChange={(e) => onChange({ ...item, version: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>File size</Label>
          <Input
            value={item.file_size}
            onChange={(e) => onChange({ ...item, file_size: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Min OS</Label>
          <Input
            value={item.min_os}
            onChange={(e) => onChange({ ...item, min_os: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Download URL (hidden)</Label>
          <Input
            value={item.download_url}
            onChange={(e) =>
              onChange({ ...item, download_url: e.target.value })
            }
            type="url"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={item.is_active}
          onCheckedChange={(v) => onChange({ ...item, is_active: v })}
        />
        Active
      </label>
    </div>
  );
}

function ScreenshotRow({
  item,
  onChange,
  onRemove,
}: {
  item: ScreenshotFormItem;
  onChange: (item: ScreenshotFormItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex justify-between">
        <Label>Screenshot</Label>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={item.url}
          onChange={(e) => onChange({ ...item, url: e.target.value })}
        />
      </div>
      <LocalizedField
        label="Caption"
        value={item.caption_json}
        onChange={(v) => onChange({ ...item, caption_json: v })}
      />
    </div>
  );
}

function GuideRow({
  item,
  onChange,
  onRemove,
}: {
  item: GuideFormItem;
  onChange: (item: GuideFormItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex justify-between gap-2">
        <Select
          value={item.type}
          onValueChange={(v) => onChange({ ...item, type: v as GuideType })}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GUIDE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <LocalizedField
        label="Title"
        value={item.title_json}
        onChange={(v) => onChange({ ...item, title_json: v })}
      />
      <div className="space-y-2">
        <Label>Content (JSON or text for steps/FAQ)</Label>
        <Textarea
          value={
            typeof item.content_json === "string"
              ? item.content_json
              : JSON.stringify(item.content_json ?? {}, null, 2)
          }
          onChange={(e) => {
            try {
              onChange({ ...item, content_json: JSON.parse(e.target.value) });
            } catch {
              onChange({ ...item, content_json: e.target.value });
            }
          }}
          rows={4}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>File URL</Label>
          <Input
            value={item.file_url}
            onChange={(e) => onChange({ ...item, file_url: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>External URL</Label>
          <Input
            value={item.external_url}
            onChange={(e) =>
              onChange({ ...item, external_url: e.target.value })
            }
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={item.is_published}
          onCheckedChange={(v) => onChange({ ...item, is_published: v })}
        />
        Published
      </label>
    </div>
  );
}

function ChangelogRow({
  item,
  onChange,
  onRemove,
}: {
  item: ChangelogFormItem;
  onChange: (item: ChangelogFormItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex justify-between">
        <Label>Changelog entry</Label>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label>Version</Label>
          <Input
            value={item.version}
            onChange={(e) => onChange({ ...item, version: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Date</Label>
          <Input
            type="date"
            value={item.date}
            onChange={(e) => onChange({ ...item, date: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Platform (optional)</Label>
          <Select
            value={item.platform || "none"}
            onValueChange={(v) =>
              onChange({
                ...item,
                platform: v === "none" ? "" : (v as PlatformType),
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All</SelectItem>
              {PLATFORMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <LocalizedField
        label="Notes"
        value={item.notes_json}
        onChange={(v) => onChange({ ...item, notes_json: v })}
        multiline
      />
    </div>
  );
}
