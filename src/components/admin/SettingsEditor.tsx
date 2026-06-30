"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  saveSiteSettings,
  type SiteSettingsForm,
} from "@/lib/admin/actions";

type Props = {
  initial: SiteSettingsForm;
};

export function SettingsEditor({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const result = await saveSiteSettings(form);
    setSaving(false);
    if (result.ok) {
      setMessage("Saved");
      router.refresh();
    } else {
      setMessage(result.error);
    }
  }

  function updateSocial(
    index: number,
    field: "platform" | "url",
    value: string,
  ) {
    const social = [...form.social];
    social[index] = { ...social[index], [field]: value };
    setForm({ ...form, social });
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Branding</h2>
        <FileUploadField
          label="Logo"
          value={form.logo}
          onChange={(v) => setForm({ ...form, logo: v })}
          folder="branding"
        />
        <FileUploadField
          label="Favicon"
          value={form.favicon}
          onChange={(v) => setForm({ ...form, favicon: v })}
          folder="branding"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone (+93…)</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Telegram</Label>
            <Input
              value={form.telegram}
              onChange={(e) => setForm({ ...form, telegram: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Social links</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setForm({
                ...form,
                social: [...form.social, { platform: "github", url: "" }],
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        {form.social.map((s, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Platform"
              value={s.platform}
              onChange={(e) => updateSocial(i, "platform", e.target.value)}
              className="w-32"
            />
            <Input
              placeholder="URL"
              value={s.url}
              onChange={(e) => updateSocial(i, "url", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setForm({
                  ...form,
                  social: form.social.filter((_, j) => j !== i),
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Payment methods</h2>
        {(["hesabpay", "atomapay"] as const).map((key) => {
          const method = form.payments[key];
          const label = key === "hesabpay" ? "HesabPay" : "ATOMA Pay";
          return (
            <div
              key={key}
              className="rounded-lg border border-border p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{label}</h3>
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={(v) =>
                      setForm({
                        ...form,
                        payments: {
                          ...form.payments,
                          [key]: { ...method, enabled: v },
                        },
                      })
                    }
                  />
                  Enabled
                </label>
              </div>
              <LocalizedField
                label="Display name"
                value={{
                  fa: method.displayName.fa ?? "",
                  ps: method.displayName.ps ?? "",
                  en: method.displayName.en ?? label,
                }}
                onChange={(v) =>
                  setForm({
                    ...form,
                    payments: {
                      ...form.payments,
                      [key]: { ...method, displayName: v },
                    },
                  })
                }
              />
              <div className="space-y-2">
                <Label>Merchant / wallet number</Label>
                <Input
                  value={method.merchantNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      payments: {
                        ...form.payments,
                        [key]: { ...method, merchantNumber: e.target.value },
                      },
                    })
                  }
                />
              </div>
              <FileUploadField
                label="QR code image"
                value={method.qrImageUrl}
                onChange={(v) =>
                  setForm({
                    ...form,
                    payments: {
                      ...form.payments,
                      [key]: { ...method, qrImageUrl: v },
                    },
                  })
                }
                folder="payments"
              />
              <LocalizedField
                label="Instructions"
                value={{
                  fa: method.instructions.fa ?? "",
                  ps: method.instructions.ps ?? "",
                  en: method.instructions.en ?? "",
                }}
                onChange={(v) =>
                  setForm({
                    ...form,
                    payments: {
                      ...form.payments,
                      [key]: { ...method, instructions: v },
                    },
                  })
                }
                multiline
              />
            </div>
          );
        })}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Maintenance mode</h2>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={form.maintenance_enabled}
            onCheckedChange={(v) =>
              setForm({ ...form, maintenance_enabled: v })
            }
          />
          Enable maintenance mode
        </label>
        <LocalizedField
          label="Maintenance message"
          value={form.maintenance_message}
          onChange={(v) => setForm({ ...form, maintenance_message: v })}
          multiline
        />
      </section>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
        {message && <span className="text-sm text-text-muted">{message}</span>}
      </div>
    </div>
  );
}
