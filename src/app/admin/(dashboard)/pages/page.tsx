import { getPrisma } from "@/lib/prisma";
import { PagesEditor } from "@/components/admin/PagesEditor";
import type { LocalizedString } from "@/lib/i18n-json";

export default async function AdminPagesPage() {
  const prisma = getPrisma();
  const pages = prisma
    ? await prisma.page.findMany()
    : [];

  const mapped = pages.map((p) => ({
    slug: p.slug,
    title_json: p.titleJson as LocalizedString,
    content_json: p.contentJson as LocalizedString,
    published: p.published,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pages</h1>
        <p className="text-text-muted mt-1">
          Edit About, Privacy, Terms, and other CMS pages (trilingual).
        </p>
      </div>
      <PagesEditor pages={mapped} />
    </div>
  );
}
