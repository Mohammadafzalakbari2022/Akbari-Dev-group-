import type {
  PlatformType,
  ProductStatus,
  GuideType,
  ReviewStatus,
} from "@prisma/client";

export type ProductPlatformDto = {
  id: string;
  platform: PlatformType;
  version: string | null;
  fileSize: string | null;
  minOs: string | null;
  downloadUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type ProductScreenshotDto = {
  id: string;
  url: string;
  captionJson: unknown;
  sortOrder: number;
};

export type ProductGuideDto = {
  id: string;
  type: GuideType;
  titleJson: unknown;
  contentJson: unknown;
  fileUrl: string | null;
  externalUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type ProductChangelogDto = {
  id: string;
  version: string;
  date: Date;
  notesJson: unknown;
  platform: PlatformType | null;
};

export type ReviewDto = {
  id: string;
  authorName: string | null;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: Date;
};

export type ProductDto = {
  id: string;
  slug: string;
  status: ProductStatus;
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
  downloadCount: number;
  sortOrder: number;
  updatedAt: Date;
  platforms: ProductPlatformDto[];
  screenshots: ProductScreenshotDto[];
  guides: ProductGuideDto[];
  changelog: ProductChangelogDto[];
  reviews: ReviewDto[];
  averageRating: number;
  reviewCount: number;
};

export type ProductListItem = Pick<
  ProductDto,
  | "id"
  | "slug"
  | "status"
  | "featured"
  | "isNew"
  | "isNewUntil"
  | "iconUrl"
  | "nameJson"
  | "taglineJson"
  | "downloadCount"
  | "sortOrder"
  | "updatedAt"
> & {
  platforms: Pick<ProductPlatformDto, "platform">[];
  averageRating: number;
  reviewCount: number;
};

export type HeroSettingsDto = {
  headlineJson: unknown;
  subheadlineJson: unknown;
  statProducts: number;
  statDownloads: number;
  featuredProducts: ProductListItem[];
};

export type AboutSection = {
  slug: string;
  titleJson: unknown;
  contentJson: unknown;
};

export type TeamMemberDto = {
  id: string;
  nameJson: unknown;
  roleJson: unknown;
  bioJson: unknown;
  photoUrl: string | null;
  socialJson: unknown;
  sortOrder: number;
};
