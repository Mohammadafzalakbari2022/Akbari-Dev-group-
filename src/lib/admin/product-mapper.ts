import type { LocalizedString } from "@/lib/i18n-json";
import type { ProductFormData } from "./types";
import type { GuideType, PlatformType } from "@prisma/client";

type ProductWithRelations = {
  slug: string;
  status: ProductFormData["status"];
  featured: boolean;
  isNew: boolean;
  isNewUntil: Date | null;
  iconUrl: string | null;
  coverUrl: string | null;
  nameJson: unknown;
  taglineJson: unknown;
  purposeJson: unknown;
  featuresJson: unknown;
  requirementsJson: unknown;
  contactJson: unknown;
  socialJson: unknown;
  pricingJson: unknown;
  seoJson: unknown;
  sortOrder: number;
  platforms: {
    id: string;
    platform: PlatformType;
    version: string | null;
    fileSize: string | null;
    minOs: string | null;
    downloadUrl: string | null;
    isActive: boolean;
    sortOrder: number;
  }[];
  screenshots: {
    id: string;
    url: string;
    captionJson: unknown;
    sortOrder: number;
  }[];
  guides: {
    id: string;
    type: GuideType;
    titleJson: unknown;
    contentJson: unknown;
    fileUrl: string | null;
    externalUrl: string | null;
    sortOrder: number;
    isPublished: boolean;
  }[];
  changelog: {
    id: string;
    version: string;
    date: Date;
    notesJson: unknown;
    platform: PlatformType | null;
  }[];
};

export function mapProductToForm(product: ProductWithRelations): ProductFormData {
  return {
    name_json: (product.nameJson as LocalizedString) ?? { fa: "", ps: "", en: "" },
    slug: product.slug,
    tagline_json: (product.taglineJson as LocalizedString) ?? { fa: "", ps: "", en: "" },
    icon_url: product.iconUrl ?? "",
    cover_url: product.coverUrl ?? "",
    status: product.status,
    featured: product.featured,
    is_new: product.isNew,
    is_new_until: product.isNewUntil?.toISOString().slice(0, 10) ?? "",
    sort_order: product.sortOrder,
    purpose_json: (product.purposeJson as LocalizedString) ?? { fa: "", ps: "", en: "" },
    features_json: Array.isArray(product.featuresJson)
      ? (product.featuresJson as ProductFormData["features_json"])
      : [],
    requirements_json:
      (product.requirementsJson as Record<string, LocalizedString>) ?? {},
    contact_json: (product.contactJson as Record<string, unknown>) ?? {},
    social_json: Array.isArray(product.socialJson) ? product.socialJson : [],
    pricing_json: (product.pricingJson as Record<string, unknown>) ?? {},
    seo_json: {
      title_json:
        (product.seoJson as { title_json?: LocalizedString })?.title_json ?? {
          fa: "",
          ps: "",
          en: "",
        },
      description_json:
        (product.seoJson as { description_json?: LocalizedString })
          ?.description_json ?? { fa: "", ps: "", en: "" },
      og_image: (product.seoJson as { og_image?: string })?.og_image ?? "",
    },
    platforms: product.platforms.map((p) => ({
      id: p.id,
      platform: p.platform,
      version: p.version ?? "",
      file_size: p.fileSize ?? "",
      min_os: p.minOs ?? "",
      download_url: p.downloadUrl ?? "",
      is_active: p.isActive,
      sort_order: p.sortOrder,
    })),
    screenshots: product.screenshots.map((s) => ({
      id: s.id,
      url: s.url,
      caption_json: (s.captionJson as LocalizedString) ?? {
        fa: "",
        ps: "",
        en: "",
      },
      sort_order: s.sortOrder,
    })),
    guides: product.guides.map((g) => ({
      id: g.id,
      type: g.type,
      title_json: (g.titleJson as LocalizedString) ?? { fa: "", ps: "", en: "" },
      content_json: g.contentJson,
      file_url: g.fileUrl ?? "",
      external_url: g.externalUrl ?? "",
      sort_order: g.sortOrder,
      is_published: g.isPublished,
    })),
    changelog: product.changelog.map((c) => ({
      id: c.id,
      version: c.version,
      date: c.date.toISOString().slice(0, 10),
      notes_json: (c.notesJson as LocalizedString) ?? { fa: "", ps: "", en: "" },
      platform: c.platform ?? "",
    })),
  };
}
