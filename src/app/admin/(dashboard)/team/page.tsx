import { getPrisma } from "@/lib/prisma";
import { TeamEditor } from "@/components/admin/TeamEditor";
import { emptyLocale } from "@/lib/admin/types";
import type { LocalizedString } from "@/lib/i18n-json";

export default async function AdminTeamPage() {
  const prisma = getPrisma();
  const members = prisma
    ? await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } })
    : [];

  const mapped = members.map((m) => ({
    id: m.id,
    name_json: m.nameJson as LocalizedString,
    role_json: m.roleJson as LocalizedString,
    bio_json: (m.bioJson as LocalizedString) ?? emptyLocale(),
    photo_url: m.photoUrl ?? "",
    social_json: Array.isArray(m.socialJson)
      ? (m.socialJson as { platform: string; url: string }[])
      : [],
    sort_order: m.sortOrder,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Team</h1>
        <p className="text-text-muted mt-1">Manage team members for About page.</p>
      </div>
      <TeamEditor members={mapped} />
    </div>
  );
}
