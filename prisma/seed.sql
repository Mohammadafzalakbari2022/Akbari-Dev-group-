-- Akbari Dev Hub — Seed data (run AFTER migration.sql in Supabase SQL Editor)

-- Hero settings
INSERT INTO "hero_settings" ("id", "headline_json", "subheadline_json", "stat_products", "stat_downloads", "featured_product_ids")
VALUES (
  'default',
  '{"fa": "گروه توسعه اکبری", "ps": "د اکبري پراختیاګروپ", "en": "Akbari Dev Group"}',
  '{"fa": "ما اپلیکیشن‌های کاربردی برای مردم افغانستان می‌سازیم — ساده، سریع و قابل اعتماد.", "ps": "موږ د افغانستان خلکو لپاره کارونکي اپلیکیشنونه جوړوو.", "en": "We build practical apps for people in Afghanistan — simple, fast, and trusted."}',
  2, 2096, '[]'
)
ON CONFLICT ("id") DO NOTHING;

-- Pages
INSERT INTO "pages" ("slug", "title_json", "content_json", "published") VALUES
('story',
  '{"fa": "داستان ما", "ps": "زموږ کیسه", "en": "Our Story"}',
  '{"fa": "گروه توسعه اکبری در افغانستان با هدف ساختن ابزارهای دیجیتال کاربردی برای کسب‌وکارهای محلی تأسیس شد.", "ps": "د اکبري پراختیاګروپ په افغانستان کې د محلي سوداګرۍ لپاره ګټور ډیجیټل وسایل جوړوي.", "en": "Akbari Dev Group was founded in Afghanistan to build practical digital tools for local businesses."}',
  true),
('mission',
  '{"fa": "مأموریت", "ps": "ماموریت", "en": "Mission"}',
  '{"fa": "ساده‌سازی کار روزمره با نرم‌افزار قابل اعتماد.", "ps": "د ورځني کار ساده کول د باوري سافټویر سره.", "en": "Simplify daily work with trusted software."}',
  true),
('privacy',
  '{"fa": "حریم خصوصی", "ps": "محرمیت", "en": "Privacy Policy"}',
  '{"fa": "ما اطلاعات شخصی شما را فقط برای پاسخ به درخواست‌ها و بهبود خدمات استفاده می‌کنیم.", "ps": "موږ ستاسو شخصي معلومات یوازې د ملاتړ لپاره کاروو.", "en": "We use your personal information only to respond to requests and improve our services."}',
  true),
('terms',
  '{"fa": "شرایط استفاده", "ps": "د کارولو شرایط", "en": "Terms of Use"}',
  '{"fa": "با استفاده از محصولات گروه توسعه اکبری، شما با این شرایط موافقت می‌کنید.", "ps": "د اکبري پراختیاګروپ محصولاتو کارول د دې شرایطو منل دي.", "en": "By using Akbari Dev Group products, you agree to these terms."}',
  true)
ON CONFLICT ("slug") DO NOTHING;

-- Team members
INSERT INTO "team_members" ("id", "name_json", "role_json", "bio_json", "sort_order") VALUES
('team-1',
  '{"fa": "محمد اکبری", "ps": "محمد اکبري", "en": "Mohammad Akbari"}',
  '{"fa": "بنیان‌گذار و توسعه‌دهنده", "ps": "بنسټګر", "en": "Founder & Developer"}',
  '{"fa": "توسعه‌دهنده نرم‌افزار با تمرکز بر محصولات بومی افغانستان.", "ps": "سافټویر پراختیا کوونکی.", "en": "Software developer focused on Afghan-native products."}',
  0),
('team-2',
  '{"fa": "سارا احمدی", "ps": "سارا احمدي", "en": "Sara Ahmadi"}',
  '{"fa": "طراح رابط کاربری", "ps": "UI ډیزاینر", "en": "UI Designer"}',
  '{"fa": "طراحی تجربه کاربری برای زبان‌های راست به چپ.", "ps": "د RTL ژبو لپاره UX.", "en": "UX design for RTL languages."}',
  1)
ON CONFLICT ("id") DO NOTHING;

-- Products
INSERT INTO "products" ("id", "slug", "status", "featured", "is_new", "name_json", "tagline_json", "purpose_json", "features_json", "requirements_json", "download_count", "sort_order", "updated_at")
VALUES
('product-khayat', 'khayat', 'published', true, false,
  '{"fa": "خیاط", "ps": "خیاط", "en": "Khayat"}',
  '{"fa": "مدیریت سفارشات و اندازه‌گیری برای خیاطان", "ps": "د خیاطانو لپاره د امرونو مدیریت", "en": "Order and measurement management for tailors"}',
  '{"fa": "خیاط برای خیاطان افغان طراحی شده است.", "ps": "خیاط د افغان خیاطانو لپاره دی.", "en": "Khayat is built for Afghan tailors."}',
  '[{"icon": "clipboard-list", "title_json": {"fa": "مدیریت سفارشات", "ps": "امرونه", "en": "Orders"}, "description_json": {"fa": "ثبت و پیگیری سفارشات", "ps": "ثبت او تعقیب", "en": "Track orders"}}]',
  '{"android": {"fa": "اندروید ۸+", "ps": "اندروید ۸+", "en": "Android 8+"}}',
  1240, 1, NOW()),
('product-stationplus', 'stationplus', 'published', true, true,
  '{"fa": "استیشن پلاس", "ps": "سټیشن پلس", "en": "StationPlus"}',
  '{"fa": "مدیریت پمپ بنzin و فروش سوخت", "ps": "د بنzin پمپ مدیریت", "en": "Fuel station management"}',
  '{"fa": "استیشن پلاس برای صاحبان پمپ بنzin طراحی شده.", "ps": "سټیشن پلس د بنzin پمپونو لپاره دی.", "en": "StationPlus helps fuel station owners."}',
  '[{"icon": "fuel", "title_json": {"fa": "ثبت فروش", "ps": "پلور", "en": "Sales"}, "description_json": {"fa": "ثبت سریع فروش سوخت", "ps": "چټک ثبت", "en": "Quick fuel logging"}}]',
  '{"android": {"fa": "اندروید ۹+", "ps": "اندروید ۹+", "en": "Android 9+"}, "web": {"fa": "مرورگر مدرن", "ps": "عصري براوزر", "en": "Modern browser"}}',
  856, 2, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Product platforms
INSERT INTO "product_platforms" ("id", "product_id", "platform", "version", "file_size", "min_os", "download_url", "is_active", "sort_order") VALUES
('plat-khayat-android', 'product-khayat', 'android', '1.2.0', '12 MB', 'Android 8+',
  'https://github.com/example/khayat/releases/download/v1.2.0/khayat.apk', true, 0),
('plat-stationplus-android', 'product-stationplus', 'android', '2.0.1', '18 MB', 'Android 9+',
  'https://github.com/example/stationplus/releases/download/v2.0.1/stationplus.apk', true, 0),
('plat-stationplus-web', 'product-stationplus', 'web', '2.0.1', NULL, NULL,
  'https://app.stationplus.example.com', true, 1)
ON CONFLICT ("id") DO NOTHING;

-- Product guides
INSERT INTO "product_guides" ("id", "product_id", "type", "title_json", "content_json", "sort_order", "is_published") VALUES
('guide-khayat-video', 'product-khayat', 'video',
  '{"fa": "ویدیوی آموزشی", "ps": "ویډیو", "en": "Tutorial video"}',
  '{"embed_url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}',
  0, true),
('guide-khayat-faq', 'product-khayat', 'faq',
  '{"fa": "سوالات متداول", "ps": "عمومي پوښتنې", "en": "FAQ"}',
  '{"items": [{"question_json": {"fa": "چگونه سفارش جدید ثبت کنم؟", "ps": "نوی امر څنګه ثبت کړم؟", "en": "How do I add a new order?"}, "answer_json": {"fa": "از دکمه + در صفحه سفارشات استفاده کنید.", "ps": "د امرونو پاڼې کې + وکاروئ.", "en": "Use the + button on the orders screen."}}]}',
  1, true),
('guide-stationplus-steps', 'product-stationplus', 'steps',
  '{"fa": "شروع سریع", "ps": "چټک پیل", "en": "Quick start"}',
  '{"steps": [{"title_json": {"fa": "ثبت‌نام", "ps": "نوم لیکنه", "en": "Sign up"}, "body_json": {"fa": "حساب کاربری پمپ خود را بسازید.", "ps": "د پمپ حساب جوړ کړئ.", "en": "Create your station account."}}]}',
  0, true)
ON CONFLICT ("id") DO NOTHING;

-- Reviews
INSERT INTO "reviews" ("id", "product_id", "author_name", "rating", "comment", "status", "created_at") VALUES
('review-khayat-1', 'product-khayat', 'احمد', 5, 'برای کار خیاطی عالی است!', 'approved', NOW()),
('review-khayat-2', 'product-khayat', 'فاطمه', 4, 'خیلی ساده و کاربردی', 'approved', NOW()),
('review-stationplus-1', 'product-stationplus', 'کریم', 5, 'مدیریت پمپ خیلی راحت شد', 'approved', NOW())
ON CONFLICT ("id") DO NOTHING;

-- Testimonials
INSERT INTO "testimonials" ("id", "author_name", "role_json", "quote_json", "product_id", "sort_order", "published") VALUES
('testimonial-1', 'احمد',
  '{"fa": "خیاط", "ps": "خیاط", "en": "Tailor"}',
  '{"fa": "خیاط کار من را خیلی آسان کرده — اندازه‌گیری و سفارش‌ها همه در یک جا.", "ps": "خیاط زموږ کار ډیر اسانه کړی.", "en": "Khayat made my work so much easier — measurements and orders all in one place."}',
  'product-khayat', 0, true),
('testimonial-2', 'Rahim',
  '{"fa": "مدیر پمپ بنزین", "ps": "د پمپ مدیر", "en": "Fuel station manager"}',
  '{"fa": "StationPlus مدیریت موجودی و فروش را برای ما ساده کرد.", "ps": "StationPlus زموږ لپاره مدیریت اسانه کړه.", "en": "StationPlus simplified inventory and sales management for us."}',
  'product-stationplus', 1, true)
ON CONFLICT ("id") DO NOTHING;

-- Site settings
INSERT INTO "site_settings" ("key", "value_json") VALUES
('global_social',
  '[{"platform": "github", "url": "https://github.com/akbaridev"}, {"platform": "telegram", "url": "https://t.me/akbaridev"}]'),
('global_contact',
  '{"email": "hello@akbaridev.com", "whatsapp": "+93701234567", "telegram": "akbaridev", "supportMessage": {"fa": "برای پشتیبانی فنی با ما تماس بگیرید.", "ps": "د تخنیکي ملاتړ لپاره موږ سره اړیکه ونیسئ.", "en": "Contact us for technical support."}, "pricingMessage": {"fa": "برای استعلام قیمت و لایسنس با ما در تماس باشید.", "ps": "د بیې پوښتنې لپاره موږ سره اړیکه ونیسئ.", "en": "Contact us for pricing and licensing inquiries."}}')
ON CONFLICT ("key") DO NOTHING;

-- Update hero featured products
UPDATE "hero_settings"
SET "featured_product_ids" = '["product-khayat", "product-stationplus"]'
WHERE "id" = 'default';

-- Create media storage bucket (idempotent)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media', 'media', true, 52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
