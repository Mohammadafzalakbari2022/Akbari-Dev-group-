-- Akbari Dev Group initial schema migration
-- Run against Supabase PostgreSQL

-- Enums
CREATE TYPE "ProductStatus" AS ENUM ('draft', 'published', 'archived');
CREATE TYPE "PlatformType" AS ENUM ('android', 'ios', 'web', 'desktop', 'database', 'other');
CREATE TYPE "GuideType" AS ENUM ('video', 'pdf', 'steps', 'external_link', 'gallery', 'faq');
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE "ContactType" AS ENUM ('general', 'support', 'pricing', 'problem_report');
CREATE TYPE "ContactStatus" AS ENUM ('new', 'read', 'resolved');
CREATE TYPE "PageViewType" AS ENUM ('home', 'about', 'products_list', 'product_detail', 'contact', 'other');
CREATE TYPE "GuideViewEventType" AS ENUM ('video_play', 'pdf_open', 'pdf_download', 'external_click', 'gallery_view');

-- Products
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "is_new_until" TIMESTAMP(3),
    "icon_url" TEXT,
    "cover_url" TEXT,
    "name_json" JSONB NOT NULL,
    "tagline_json" JSONB NOT NULL,
    "purpose_json" JSONB,
    "features_json" JSONB,
    "requirements_json" JSONB,
    "contact_json" JSONB,
    "social_json" JSONB,
    "pricing_json" JSONB,
    "seo_json" JSONB,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- Product platforms (one product → many platforms)
CREATE TABLE "product_platforms" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "version" TEXT,
    "file_size" TEXT,
    "min_os" TEXT,
    "download_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_platforms_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_platforms_product_id_idx" ON "product_platforms"("product_id");

ALTER TABLE "product_platforms" ADD CONSTRAINT "product_platforms_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Product screenshots
CREATE TABLE "product_screenshots" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption_json" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_screenshots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_screenshots_product_id_idx" ON "product_screenshots"("product_id");

ALTER TABLE "product_screenshots" ADD CONSTRAINT "product_screenshots_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Product guides (How to Use)
CREATE TABLE "product_guides" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "type" "GuideType" NOT NULL,
    "title_json" JSONB NOT NULL,
    "content_json" JSONB,
    "file_url" TEXT,
    "external_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_guides_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_guides_product_id_idx" ON "product_guides"("product_id");

ALTER TABLE "product_guides" ADD CONSTRAINT "product_guides_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Product changelog
CREATE TABLE "product_changelog" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes_json" JSONB NOT NULL,
    "platform" "PlatformType",

    CONSTRAINT "product_changelog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "product_changelog_product_id_idx" ON "product_changelog"("product_id");

ALTER TABLE "product_changelog" ADD CONSTRAINT "product_changelog_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Reviews
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "author_name" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "reviews_product_id_idx" ON "reviews"("product_id");
CREATE INDEX "reviews_status_idx" ON "reviews"("status");

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Team members
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name_json" JSONB NOT NULL,
    "role_json" JSONB NOT NULL,
    "bio_json" JSONB,
    "photo_url" TEXT,
    "social_json" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CMS pages
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title_json" JSONB NOT NULL,
    "content_json" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- Site settings (key-value)
CREATE TABLE "site_settings" (
    "key" TEXT NOT NULL,
    "value_json" JSONB NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

-- Hero settings (singleton)
CREATE TABLE "hero_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "headline_json" JSONB,
    "subheadline_json" JSONB,
    "stat_products" INTEGER,
    "stat_downloads" INTEGER,
    "featured_product_ids" JSONB,

    CONSTRAINT "hero_settings_pkey" PRIMARY KEY ("id")
);

-- Contact submissions
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "type" "ContactType" NOT NULL,
    "product_id" TEXT,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "contact_submissions_type_idx" ON "contact_submissions"("type");
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");
CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions"("created_at");

ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Testimonials
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "author_name" TEXT NOT NULL,
    "role_json" JSONB,
    "quote_json" JSONB NOT NULL,
    "avatar_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Admin activity log
CREATE TABLE "admin_activity_log" (
    "id" TEXT NOT NULL,
    "admin_email" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "admin_activity_log_created_at_idx" ON "admin_activity_log"("created_at");

-- Download events (analytics + public count source)
CREATE TABLE "download_events" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,
    "locale" TEXT,
    "country_code" TEXT,
    "referrer" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "ip_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "download_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "download_events_product_id_created_at_idx" ON "download_events"("product_id", "created_at");
CREATE INDEX "download_events_platform_id_created_at_idx" ON "download_events"("platform_id", "created_at");
CREATE INDEX "download_events_created_at_idx" ON "download_events"("created_at");

ALTER TABLE "download_events" ADD CONSTRAINT "download_events_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "download_events" ADD CONSTRAINT "download_events_platform_id_fkey"
    FOREIGN KEY ("platform_id") REFERENCES "product_platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Trigger: increment products.download_count on download_events insert
CREATE OR REPLACE FUNCTION increment_product_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "products"
    SET "download_count" = "download_count" + 1
    WHERE "id" = NEW."product_id";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER download_events_increment_count
    AFTER INSERT ON "download_events"
    FOR EACH ROW
    EXECUTE FUNCTION increment_product_download_count();

-- Page view events
CREATE TABLE "page_view_events" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "page_type" "PageViewType" NOT NULL,
    "product_id" TEXT,
    "locale" TEXT,
    "referrer" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "country_code" TEXT,
    "visitor_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_view_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "page_view_events_created_at_idx" ON "page_view_events"("created_at");
CREATE INDEX "page_view_events_product_id_created_at_idx" ON "page_view_events"("product_id", "created_at");
CREATE INDEX "page_view_events_page_type_created_at_idx" ON "page_view_events"("page_type", "created_at");

ALTER TABLE "page_view_events" ADD CONSTRAINT "page_view_events_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Guide view events
CREATE TABLE "guide_view_events" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "guide_id" TEXT NOT NULL,
    "event_type" "GuideViewEventType" NOT NULL,
    "locale" TEXT,
    "country_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_view_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "guide_view_events_product_id_created_at_idx" ON "guide_view_events"("product_id", "created_at");
CREATE INDEX "guide_view_events_guide_id_event_type_idx" ON "guide_view_events"("guide_id", "event_type");

ALTER TABLE "guide_view_events" ADD CONSTRAINT "guide_view_events_product_id_fkey"
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "guide_view_events" ADD CONSTRAINT "guide_view_events_guide_id_fkey"
    FOREIGN KEY ("guide_id") REFERENCES "product_guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
