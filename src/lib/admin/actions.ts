"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireAdmin } from "./auth";
import { logAdminActivity } from "./activity";
import type { ProductFormData } from "./types";
import type { LocalizedString } from "@/lib/i18n-json";
import type { PaymentSettings } from "@/lib/data/payments";

type ActionResult = { ok: true } | { ok: false; error: string };

function dbError(): ActionResult {
  return { ok: false, error: "Database not configured or unavailable." };
}

export async function saveProduct(
  id: string | null,
  data: ProductFormData,
): Promise<ActionResult & { id?: string }> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    const productData = {
      slug: data.slug,
      status: data.status,
      featured: data.featured,
      isNew: data.is_new,
      isNewUntil: data.is_new_until ? new Date(data.is_new_until) : null,
      iconUrl: data.icon_url || null,
      coverUrl: data.cover_url || null,
      nameJson: data.name_json as Prisma.InputJsonValue,
      taglineJson: data.tagline_json as Prisma.InputJsonValue,
      purposeJson: data.purpose_json as Prisma.InputJsonValue,
      featuresJson: data.features_json as Prisma.InputJsonValue,
      requirementsJson: data.requirements_json as Prisma.InputJsonValue,
      contactJson: data.contact_json as Prisma.InputJsonValue,
      socialJson: data.social_json as Prisma.InputJsonValue,
      pricingJson: data.pricing_json as Prisma.InputJsonValue,
      seoJson: data.seo_json as Prisma.InputJsonValue,
      sortOrder: data.sort_order,
    };

    let productId = id;

    if (id) {
      await prisma.product.update({ where: { id }, data: productData });
      await prisma.productPlatform.deleteMany({ where: { productId: id } });
      await prisma.productScreenshot.deleteMany({ where: { productId: id } });
      await prisma.productGuide.deleteMany({ where: { productId: id } });
      await prisma.productChangelog.deleteMany({ where: { productId: id } });
    } else {
      const created = await prisma.product.create({ data: productData });
      productId = created.id;
    }

    if (!productId) return dbError();

    if (data.platforms.length > 0) {
      await prisma.productPlatform.createMany({
        data: data.platforms.map((p, i) => ({
          productId,
          platform: p.platform,
          version: p.version || null,
          fileSize: p.file_size || null,
          minOs: p.min_os || null,
          downloadUrl: p.download_url || null,
          isActive: p.is_active,
          sortOrder: p.sort_order ?? i,
        })),
      });
    }

    if (data.screenshots.length > 0) {
      await prisma.productScreenshot.createMany({
        data: data.screenshots.map((s, i) => ({
          productId,
          url: s.url,
          captionJson: s.caption_json as Prisma.InputJsonValue,
          sortOrder: s.sort_order ?? i,
        })),
      });
    }

    if (data.guides.length > 0) {
      await prisma.productGuide.createMany({
        data: data.guides.map((g, i) => ({
          productId,
          type: g.type,
          titleJson: g.title_json as Prisma.InputJsonValue,
          contentJson: (g.content_json ?? {}) as Prisma.InputJsonValue,
          fileUrl: g.file_url || null,
          externalUrl: g.external_url || null,
          sortOrder: g.sort_order ?? i,
          isPublished: g.is_published,
        })),
      });
    }

    if (data.changelog.length > 0) {
      await prisma.productChangelog.createMany({
        data: data.changelog.map((c) => ({
          productId,
          version: c.version,
          date: new Date(c.date),
          notesJson: c.notes_json as Prisma.InputJsonValue,
          platform: c.platform || null,
        })),
      });
    }

    await logAdminActivity({
      adminEmail: session.email,
      action: id ? "product.update" : "product.create",
      entityType: "product",
      entityId: productId,
      metadata: { slug: data.slug, status: data.status },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true, id: productId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save product";
    return { ok: false, error: msg };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.product.delete({ where: { id } });
    await logAdminActivity({
      adminEmail: session.email,
      action: "product.delete",
      entityType: "product",
      entityId: id,
      metadata: { slug: product?.slug },
    });
    revalidatePath("/admin/products");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete product" };
  }
}

export async function updateProductStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    await prisma.product.update({ where: { id }, data: { status } });
    await logAdminActivity({
      adminEmail: session.email,
      action: status === "published" ? "product.publish" : "product.archive",
      entityType: "product",
      entityId: id,
      metadata: { status },
    });
    revalidatePath("/admin/products");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update status" };
  }
}

export async function moderateReview(
  id: string,
  action: "approve" | "reject" | "delete",
): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    if (action === "delete") {
      await prisma.review.delete({ where: { id } });
      await logAdminActivity({
        adminEmail: session.email,
        action: "review.delete",
        entityType: "review",
        entityId: id,
      });
    } else {
      await prisma.review.update({
        where: { id },
        data: { status: action === "approve" ? "approved" : "rejected" },
      });
      await logAdminActivity({
        adminEmail: session.email,
        action: action === "approve" ? "review.approve" : "review.reject",
        entityType: "review",
        entityId: id,
      });
    }
    revalidatePath("/admin/reviews");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to moderate review" };
  }
}

export async function savePage(
  slug: string,
  data: { title_json: LocalizedString; content_json: LocalizedString; published: boolean },
): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    await prisma.page.upsert({
      where: { slug },
      create: {
        slug,
        titleJson: data.title_json as Prisma.InputJsonValue,
        contentJson: data.content_json as Prisma.InputJsonValue,
        published: data.published,
      },
      update: {
        titleJson: data.title_json as Prisma.InputJsonValue,
        contentJson: data.content_json as Prisma.InputJsonValue,
        published: data.published,
      },
    });
    await logAdminActivity({
      adminEmail: session.email,
      action: "page.update",
      entityType: "page",
      entityId: slug,
    });
    revalidatePath("/admin/pages");
    revalidatePath("/about");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to save page" };
  }
}

export type TeamMemberForm = {
  id?: string;
  name_json: LocalizedString;
  role_json: LocalizedString;
  bio_json: LocalizedString;
  photo_url: string;
  social_json: { platform: string; url: string }[];
  sort_order: number;
};

export async function saveTeamMember(data: TeamMemberForm): Promise<ActionResult & { id?: string }> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    const payload = {
      nameJson: data.name_json as Prisma.InputJsonValue,
      roleJson: data.role_json as Prisma.InputJsonValue,
      bioJson: data.bio_json as Prisma.InputJsonValue,
      photoUrl: data.photo_url || null,
      socialJson: data.social_json as Prisma.InputJsonValue,
      sortOrder: data.sort_order,
    };

    if (data.id) {
      await prisma.teamMember.update({ where: { id: data.id }, data: payload });
      await logAdminActivity({
        adminEmail: session.email,
        action: "team.update",
        entityType: "team_member",
        entityId: data.id,
      });
      return { ok: true, id: data.id };
    }

    const created = await prisma.teamMember.create({ data: payload });
    await logAdminActivity({
      adminEmail: session.email,
      action: "team.create",
      entityType: "team_member",
      entityId: created.id,
    });
    revalidatePath("/admin/team");
    return { ok: true, id: created.id };
  } catch {
    return { ok: false, error: "Failed to save team member" };
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    await prisma.teamMember.delete({ where: { id } });
    await logAdminActivity({
      adminEmail: session.email,
      action: "team.delete",
      entityType: "team_member",
      entityId: id,
    });
    revalidatePath("/admin/team");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete team member" };
  }
}

export type HeroFormData = {
  headline_json: LocalizedString;
  subheadline_json: LocalizedString;
  stat_products: number;
  stat_downloads: number;
  featured_product_ids: string[];
};

export async function saveHeroSettings(data: HeroFormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    await prisma.heroSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        headlineJson: data.headline_json as Prisma.InputJsonValue,
        subheadlineJson: data.subheadline_json as Prisma.InputJsonValue,
        statProducts: data.stat_products,
        statDownloads: data.stat_downloads,
        featuredProductIds: data.featured_product_ids as Prisma.InputJsonValue,
      },
      update: {
        headlineJson: data.headline_json as Prisma.InputJsonValue,
        subheadlineJson: data.subheadline_json as Prisma.InputJsonValue,
        statProducts: data.stat_products,
        statDownloads: data.stat_downloads,
        featuredProductIds: data.featured_product_ids as Prisma.InputJsonValue,
      },
    });
    await logAdminActivity({
      adminEmail: session.email,
      action: "hero.update",
      entityType: "hero_settings",
      entityId: "default",
    });
    revalidatePath("/admin/hero");
    revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to save hero settings" };
  }
}

export type SiteSettingsForm = {
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  social: { platform: string; url: string }[];
  payments: PaymentSettings;
  maintenance_enabled: boolean;
  maintenance_message: LocalizedString;
};

export async function saveSiteSettings(data: SiteSettingsForm): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    const upserts: { key: string; valueJson: Prisma.InputJsonValue }[] = [
      { key: "logo", valueJson: data.logo },
      { key: "favicon", valueJson: data.favicon },
      {
        key: "global_contact",
        valueJson: {
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          telegram: data.telegram,
        },
      },
      { key: "global_social", valueJson: data.social },
      { key: "payment_methods", valueJson: data.payments as Prisma.InputJsonValue },
      {
        key: "maintenance_mode",
        valueJson: { enabled: data.maintenance_enabled },
      },
      {
        key: "maintenance_message",
        valueJson: data.maintenance_message as Prisma.InputJsonValue,
      },
    ];

    for (const row of upserts) {
      await prisma.siteSetting.upsert({
        where: { key: row.key },
        create: row,
        update: { valueJson: row.valueJson },
      });
    }

    await logAdminActivity({
      adminEmail: session.email,
      action: "settings.update",
      entityType: "site_settings",
    });
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to save settings" };
  }
}

export async function getProductForEdit(id: string) {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return null;

  return prisma.product.findUnique({
    where: { id },
    include: {
      platforms: { orderBy: { sortOrder: "asc" } },
      screenshots: { orderBy: { sortOrder: "asc" } },
      guides: { orderBy: { sortOrder: "asc" } },
      changelog: { orderBy: { date: "desc" } },
    },
  });
}

export async function updateContactStatus(
  id: string,
  status: "read" | "resolved",
): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    await prisma.contactSubmission.update({ where: { id }, data: { status } });
    await logAdminActivity({
      adminEmail: session.email,
      action: `contact.${status}`,
      entityType: "contact_submission",
      entityId: id,
    });
    revalidatePath("/admin/contact");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update submission" };
  }
}

export type TestimonialForm = {
  id?: string;
  author_name: string;
  role_json: LocalizedString;
  quote_json: LocalizedString;
  avatar_url: string;
  product_id: string | null;
  sort_order: number;
  published: boolean;
};

export async function saveTestimonial(
  data: TestimonialForm,
): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    const payload = {
      authorName: data.author_name,
      roleJson: data.role_json as Prisma.InputJsonValue,
      quoteJson: data.quote_json as Prisma.InputJsonValue,
      avatarUrl: data.avatar_url || null,
      productId: data.product_id,
      sortOrder: data.sort_order,
      published: data.published,
    };

    if (data.id) {
      await prisma.testimonial.update({ where: { id: data.id }, data: payload });
    } else {
      await prisma.testimonial.create({ data: payload });
    }

    await logAdminActivity({
      adminEmail: session.email,
      action: data.id ? "testimonial.update" : "testimonial.create",
      entityType: "testimonial",
      entityId: data.id,
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to save testimonial" };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) return dbError();

  try {
    await prisma.testimonial.delete({ where: { id } });
    await logAdminActivity({
      adminEmail: session.email,
      action: "testimonial.delete",
      entityType: "testimonial",
      entityId: id,
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete testimonial" };
  }
}
