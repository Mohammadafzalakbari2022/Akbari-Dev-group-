"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  saveTeamMember,
  deleteTeamMember,
  type TeamMemberForm,
} from "@/lib/admin/actions";
import { emptyLocale } from "@/lib/admin/types";
import type { LocalizedString } from "@/lib/i18n-json";

type Member = TeamMemberForm & { id: string };

type Props = {
  members: Member[];
};

export function TeamEditor({ members: initial }: Props) {
  const router = useRouter();
  const [members, setMembers] = useState(initial);
  const [editing, setEditing] = useState<Member | null>(null);
  const [saving, setSaving] = useState(false);

  function newMember(): Member {
    return {
      id: "",
      name_json: emptyLocale(),
      role_json: emptyLocale(),
      bio_json: emptyLocale(),
      photo_url: "",
      social_json: [],
      sort_order: members.length,
    };
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const result = await saveTeamMember({
      id: editing.id || undefined,
      name_json: editing.name_json,
      role_json: editing.role_json,
      bio_json: editing.bio_json,
      photo_url: editing.photo_url,
      social_json: editing.social_json,
      sort_order: editing.sort_order,
    });
    setSaving(false);
    if (result.ok) {
      setEditing(null);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete team member?")) return;
    await deleteTeamMember(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <p className="text-text-muted text-sm">{members.length} member(s)</p>
        <Button size="sm" onClick={() => setEditing(newMember())}>
          <Plus className="h-4 w-4" />
          Add member
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {members.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-border p-4 flex justify-between"
          >
            <div>
              <p className="font-medium">
                {(m.name_json as LocalizedString).en || "Unnamed"}
              </p>
              <p className="text-sm text-text-muted">
                {(m.role_json as LocalizedString).en}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(m)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(m.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="rounded-xl border border-border p-6 space-y-4">
          <h3 className="font-semibold">
            {editing.id ? "Edit member" : "New member"}
          </h3>
          <LocalizedField
            label="Name"
            value={editing.name_json}
            onChange={(v) => setEditing({ ...editing, name_json: v })}
          />
          <LocalizedField
            label="Role"
            value={editing.role_json}
            onChange={(v) => setEditing({ ...editing, role_json: v })}
          />
          <LocalizedField
            label="Bio"
            value={editing.bio_json}
            onChange={(v) => setEditing({ ...editing, bio_json: v })}
            multiline
          />
          <FileUploadField
            label="Photo"
            value={editing.photo_url}
            onChange={(v) => setEditing({ ...editing, photo_url: v })}
            folder="team"
          />
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input
              type="number"
              value={editing.sort_order}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  sort_order: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
