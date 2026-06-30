"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { savePage } from "@/lib/admin/actions";
import { emptyLocale } from "@/lib/admin/types";
import type { LocalizedString } from "@/lib/i18n-json";

const PAGE_SLUGS = [
  { slug: "about", label: "About (main)" },
  { slug: "story", label: "Our Story" },
  { slug: "mission", label: "Mission" },
  { slug: "vision", label: "Vision" },
  { slug: "values", label: "Values" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms of Use" },
];

type PageData = {
  slug: string;
  title_json: LocalizedString;
  content_json: LocalizedString;
  published: boolean;
};

type Props = {
  pages: PageData[];
};

export function PagesEditor({ pages }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(PAGE_SLUGS[0].slug);
  const [data, setData] = useState<Record<string, PageData>>(() => {
    const map: Record<string, PageData> = {};
    for (const def of PAGE_SLUGS) {
      const existing = pages.find((p) => p.slug === def.slug);
      map[def.slug] = existing ?? {
        slug: def.slug,
        title_json: emptyLocale(),
        content_json: emptyLocale(),
        published: false,
      };
    }
    return map;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const current = data[active];

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result = await savePage(active, {
      title_json: current.title_json,
      content_json: current.content_json,
      published: current.published,
    });
    setSaving(false);
    if (result.ok) {
      setMessage("Saved");
      router.refresh();
    } else {
      setMessage(result.error);
    }
  }

  function update(field: keyof PageData, value: unknown) {
    setData((d) => ({
      ...d,
      [active]: { ...d[active], [field]: value },
    }));
  }

  return (
    <div className="space-y-6">
      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {PAGE_SLUGS.map((p) => (
            <TabsTrigger key={p.slug} value={p.slug}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {PAGE_SLUGS.map((p) => (
          <TabsContent key={p.slug} value={p.slug} className="space-y-4 mt-4">
            <LocalizedField
              label="Title"
              value={data[p.slug].title_json}
              onChange={(v) => {
                setData((d) => ({
                  ...d,
                  [p.slug]: { ...d[p.slug], title_json: v },
                }));
              }}
            />
            <LocalizedField
              label="Content"
              value={data[p.slug].content_json}
              onChange={(v) => {
                setData((d) => ({
                  ...d,
                  [p.slug]: { ...d[p.slug], content_json: v },
                }));
              }}
              multiline
            />
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={data[p.slug].published}
                onCheckedChange={(v) => update("published", v)}
              />
              Published
            </label>
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save page"}
        </Button>
        {message && (
          <span className="text-sm text-text-muted">{message}</span>
        )}
      </div>
    </div>
  );
}
