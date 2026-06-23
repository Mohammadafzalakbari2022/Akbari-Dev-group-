import type { LocalizedString } from "@/lib/i18n-json";
import type { GuideType, PlatformType, ProductStatus } from "@prisma/client";

export const emptyLocale = (): LocalizedString => ({ fa: "", ps: "", en: "" });

export type FeatureItem = {
  icon: string;
  title_json: LocalizedString;
  description_json: LocalizedString;
};

export type PlatformFormItem = {
  id?: string;
  platform: PlatformType;
  version: string;
  file_size: string;
  min_os: string;
  download_url: string;
  is_active: boolean;
  sort_order: number;
};

export type ScreenshotFormItem = {
  id?: string;
  url: string;
  caption_json: LocalizedString;
  sort_order: number;
};

export type GuideFormItem = {
  id?: string;
  type: GuideType;
  title_json: LocalizedString;
  content_json: unknown;
  file_url: string;
  external_url: string;
  sort_order: number;
  is_published: boolean;
};

export type ChangelogFormItem = {
  id?: string;
  version: string;
  date: string;
  notes_json: LocalizedString;
  platform: PlatformType | "";
};

export type ProductFormData = {
  name_json: LocalizedString;
  slug: string;
  tagline_json: LocalizedString;
  icon_url: string;
  cover_url: string;
  status: ProductStatus;
  featured: boolean;
  is_new: boolean;
  is_new_until: string;
  sort_order: number;
  purpose_json: LocalizedString;
  features_json: FeatureItem[];
  requirements_json: Record<string, LocalizedString>;
  contact_json: Record<string, unknown>;
  social_json: unknown[];
  pricing_json: Record<string, unknown>;
  seo_json: {
    title_json: LocalizedString;
    description_json: LocalizedString;
    og_image: string;
  };
  platforms: PlatformFormItem[];
  screenshots: ScreenshotFormItem[];
  guides: GuideFormItem[];
  changelog: ChangelogFormItem[];
};

export const defaultProductForm = (): ProductFormData => ({
  name_json: emptyLocale(),
  slug: "",
  tagline_json: emptyLocale(),
  icon_url: "",
  cover_url: "",
  status: "draft",
  featured: false,
  is_new: false,
  is_new_until: "",
  sort_order: 0,
  purpose_json: emptyLocale(),
  features_json: [],
  requirements_json: {},
  contact_json: {},
  social_json: [],
  pricing_json: {},
  seo_json: {
    title_json: emptyLocale(),
    description_json: emptyLocale(),
    og_image: "",
  },
  platforms: [],
  screenshots: [],
  guides: [],
  changelog: [],
});
