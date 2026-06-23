"use client";

import type { LocalizedString } from "@/lib/i18n-json";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  className?: string;
};

const locales = [
  { key: "fa" as const, label: "Dari (fa)" },
  { key: "ps" as const, label: "Pashto (ps)" },
  { key: "en" as const, label: "English (en)" },
];

export function LocalizedField({
  label,
  value,
  onChange,
  multiline = false,
  className,
}: Props) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>
      <div className="grid gap-3 sm:grid-cols-1">
        {locales.map((loc) => (
          <div key={loc.key} className="space-y-1">
            <span className="text-xs text-text-muted">{loc.label}</span>
            {multiline ? (
              <Textarea
                value={value[loc.key] ?? ""}
                onChange={(e) =>
                  onChange({ ...value, [loc.key]: e.target.value })
                }
                rows={3}
              />
            ) : (
              <Input
                value={value[loc.key] ?? ""}
                onChange={(e) =>
                  onChange({ ...value, [loc.key]: e.target.value })
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
