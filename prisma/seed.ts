import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Akbari Dev Hub...");

  await prisma.heroSetting.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      headlineJson: {
        fa: "گروه توسعه اکبری",
        ps: "د اکبري پراختیاګروپ",
        en: "Akbari Dev Group",
      },
      subheadlineJson: {
        fa: "ما اپلیکیشن‌های کاربردی برای مردم افغانستان می‌سازیم — ساده، سریع و قابل اعتماد.",
        ps: "موږ د افغانستان خلکو لپاره کارونکي اپلیکیشنونه جوړوو.",
        en: "We build practical apps for people in Afghanistan — simple, fast, and trusted.",
      },
      statProducts: 2,
      statDownloads: 2096,
      featuredProductIds: [],
    },
    update: {},
  });

  await prisma.page.upsert({
    where: { slug: "story" },
    create: {
      slug: "story",
      titleJson: { fa: "داستان ما", ps: "زموږ کیسه", en: "Our Story" },
      contentJson: {
        fa: "گروه توسعه اکبری در افغانستان با هدف ساختن ابزارهای دیجیتال کاربردی برای کسب‌وکارهای محلی تأسیس شد.",
        ps: "د اکبري پراختیاګروپ په افغانستان کې د محلي سوداګرۍ لپاره ګټور ډیجیټل وسایل جوړوي.",
        en: "Akbari Dev Group was founded in Afghanistan to build practical digital tools for local businesses.",
      },
      published: true,
    },
    update: {},
  });

  await prisma.page.upsert({
    where: { slug: "mission" },
    create: {
      slug: "mission",
      titleJson: { fa: "مأموریت", ps: "ماموریت", en: "Mission" },
      contentJson: {
        fa: "ساده‌سازی کار روزمره با نرم‌افزار قابل اعتماد.",
        ps: "د ورځني کار ساده کول د باوري سافټویر سره.",
        en: "Simplify daily work with trusted software.",
      },
      published: true,
    },
    update: {},
  });

  for (const legal of [
    {
      slug: "privacy",
      titleJson: { fa: "حریم خصوصی", ps: "محرمیت", en: "Privacy Policy" },
      contentJson: {
        fa: "ما اطلاعات شخصی شما را فقط برای پاسخ به درخواست‌ها و بهبود خدمات استفاده می‌کنیم.",
        ps: "موږ ستاسو شخصي معلومات یوازې د ملاتړ لپاره کاروو.",
        en: "We use your personal information only to respond to requests and improve our services.",
      },
    },
    {
      slug: "terms",
      titleJson: { fa: "شرایط استفاده", ps: "د کارولو شرایط", en: "Terms of Use" },
      contentJson: {
        fa: "با استفاده از محصولات گروه توسعه اکبری، شما با این شرایط موافقت می‌کنید.",
        ps: "د اکبري پراختیاګروپ محصولاتو کارول د دې شرایطو منل دي.",
        en: "By using Akbari Dev Group products, you agree to these terms.",
      },
    },
  ]) {
    await prisma.page.upsert({
      where: { slug: legal.slug },
      create: { ...legal, published: true },
      update: {},
    });
  }

  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        nameJson: { fa: "محمد اکبری", ps: "محمد اکبري", en: "Mohammad Akbari" },
        roleJson: {
          fa: "بنیان‌گذار و توسعه‌دهنده",
          ps: "بنسټګر",
          en: "Founder & Developer",
        },
        bioJson: {
          fa: "توسعه‌دهنده نرم‌افزار با تمرکز بر محصولات بومی افغانستان.",
          ps: "سافټویر پراختیا کوونکی.",
          en: "Software developer focused on Afghan-native products.",
        },
        sortOrder: 0,
      },
      {
        nameJson: { fa: "سارا احمدی", ps: "سارا احمدي", en: "Sara Ahmadi" },
        roleJson: {
          fa: "طراح رابط کاربری",
          ps: "UI ډیزاینر",
          en: "UI Designer",
        },
        bioJson: {
          fa: "طراحی تجربه کاربری برای زبان‌های راست به چپ.",
          ps: "د RTL ژبو لپاره UX.",
          en: "UX design for RTL languages.",
        },
        sortOrder: 1,
      },
    ],
  });

  const khayat = await prisma.product.upsert({
    where: { slug: "khayat" },
    create: {
      slug: "khayat",
      status: "published",
      featured: true,
      isNew: false,
      nameJson: { fa: "خیاط", ps: "خیاط", en: "Khayat" },
      taglineJson: {
        fa: "مدیریت سفارشات و اندازه‌گیری برای خیاطان",
        ps: "د خیاطانو لپاره د امرونو مدیریت",
        en: "Order and measurement management for tailors",
      },
      purposeJson: {
        fa: "خیاط برای خیاطان افغان طراحی شده است.",
        ps: "خیاط د افغان خیاطانو لپاره دی.",
        en: "Khayat is built for Afghan tailors.",
      },
      featuresJson: [
        {
          icon: "clipboard-list",
          title_json: { fa: "مدیریت سفارشات", ps: "امرونه", en: "Orders" },
          description_json: {
            fa: "ثبت و پیگیری سفارشات",
            ps: "ثبت او تعقیب",
            en: "Track orders",
          },
        },
      ],
      requirementsJson: {
        android: {
          fa: "اندروید ۸+",
          ps: "اندروید ۸+",
          en: "Android 8+",
        },
      },
      downloadCount: 1240,
      sortOrder: 1,
    },
    update: {},
  });

  await prisma.productPlatform.deleteMany({ where: { productId: khayat.id } });
  await prisma.productPlatform.create({
    data: {
      productId: khayat.id,
      platform: "android",
      version: "1.2.0",
      fileSize: "12 MB",
      minOs: "Android 8+",
      downloadUrl:
        "https://github.com/example/khayat/releases/download/v1.2.0/khayat.apk",
      isActive: true,
      sortOrder: 0,
    },
  });

  await prisma.productGuide.deleteMany({ where: { productId: khayat.id } });
  await prisma.productGuide.createMany({
    data: [
      {
        productId: khayat.id,
        type: "video",
        titleJson: { fa: "ویدیوی آموزشی", ps: "ویډیو", en: "Tutorial video" },
        contentJson: {
          embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        sortOrder: 0,
        isPublished: true,
      },
      {
        productId: khayat.id,
        type: "faq",
        titleJson: { fa: "سوالات متداول", ps: "عمومي پوښتنې", en: "FAQ" },
        contentJson: {
          items: [
            {
              question_json: {
                fa: "چگونه سفارش جدید ثبت کنم؟",
                ps: "نوی امر څنګه ثبت کړم؟",
                en: "How do I add a new order?",
              },
              answer_json: {
                fa: "از دکمه + در صفحه سفارشات استفاده کنید.",
                ps: "د امرونو پاڼې کې + وکاروئ.",
                en: "Use the + button on the orders screen.",
              },
            },
          ],
        },
        sortOrder: 1,
        isPublished: true,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        productId: khayat.id,
        authorName: "احمد",
        rating: 5,
        comment: "برای کار خیاطی عالی است!",
        status: "approved",
      },
      {
        productId: khayat.id,
        authorName: "فاطمه",
        rating: 4,
        comment: "خیلی ساده و کاربردی",
        status: "approved",
      },
    ],
    skipDuplicates: true,
  });

  const stationplus = await prisma.product.upsert({
    where: { slug: "stationplus" },
    create: {
      slug: "stationplus",
      status: "published",
      featured: true,
      isNew: true,
      isNewUntil: new Date("2026-06-30"),
      nameJson: { fa: "استیشن پلاس", ps: "سټیشن پلس", en: "StationPlus" },
      taglineJson: {
        fa: "مدیریت پمپ بنzin و فروش سوخت",
        ps: "د بنzin پمپ مدیریت",
        en: "Fuel station management",
      },
      purposeJson: {
        fa: "استیشن پلاس برای صاحبان پمپ بنzin طراحی شده.",
        ps: "سټیشن پلس د بنzin پمپونو لپاره دی.",
        en: "StationPlus helps fuel station owners.",
      },
      featuresJson: [
        {
          icon: "fuel",
          title_json: { fa: "ثبت فروش", ps: "پلور", en: "Sales" },
          description_json: {
            fa: "ثبت سریع فروش سوخت",
            ps: "چټک ثبت",
            en: "Quick fuel logging",
          },
        },
      ],
      requirementsJson: {
        android: { fa: "اندروید ۹+", ps: "اندروید ۹+", en: "Android 9+" },
        web: { fa: "مرورگر مدرن", ps: "عصري براوزر", en: "Modern browser" },
      },
      downloadCount: 856,
      sortOrder: 2,
    },
    update: {},
  });

  await prisma.productPlatform.deleteMany({
    where: { productId: stationplus.id },
  });
  await prisma.productPlatform.createMany({
    data: [
      {
        productId: stationplus.id,
        platform: "android",
        version: "2.0.1",
        fileSize: "18 MB",
        minOs: "Android 9+",
        downloadUrl:
          "https://github.com/example/stationplus/releases/download/v2.0.1/stationplus.apk",
        isActive: true,
        sortOrder: 0,
      },
      {
        productId: stationplus.id,
        platform: "web",
        version: "2.0.1",
        downloadUrl: "https://app.stationplus.example.com",
        isActive: true,
        sortOrder: 1,
      },
    ],
  });

  await prisma.productGuide.deleteMany({ where: { productId: stationplus.id } });
  await prisma.productGuide.create({
    data: {
      productId: stationplus.id,
      type: "steps",
      titleJson: { fa: "شروع سریع", ps: "چټک پیل", en: "Quick start" },
      contentJson: {
        steps: [
          {
            title_json: { fa: "ثبت‌نام", ps: "نوم لیکنه", en: "Sign up" },
            body_json: {
              fa: "حساب کاربری پمپ خود را بسازید.",
              ps: "د پمپ حساب جوړ کړئ.",
              en: "Create your station account.",
            },
          },
        ],
      },
      sortOrder: 0,
      isPublished: true,
    },
  });

  await prisma.review.createMany({
    data: [
      {
        productId: stationplus.id,
        authorName: "کریم",
        rating: 5,
        comment: "مدیریت پمپ خیلی راحت شد",
        status: "approved",
      },
    ],
    skipDuplicates: true,
  });

  const products = await prisma.product.findMany({
    where: { featured: true },
    select: { id: true },
  });

  await prisma.heroSetting.update({
    where: { id: "default" },
    data: { featuredProductIds: products.map((p) => p.id) },
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "احمد",
        roleJson: {
          fa: "خیاط",
          ps: "خیاط",
          en: "Tailor",
        },
        quoteJson: {
          fa: "خیاط کار من را خیلی آسان کرده — اندازه‌گیری و سفارش‌ها همه در یک جا.",
          ps: "خیاط زموږ کار ډیر اسانه کړی.",
          en: "Khayat made my work so much easier — measurements and orders all in one place.",
        },
        productId: khayat.id,
        sortOrder: 0,
        published: true,
      },
      {
        authorName: "Rahim",
        roleJson: {
          fa: "مدیر پمپ بنزین",
          ps: "د پمپ مدیر",
          en: "Fuel station manager",
        },
        quoteJson: {
          fa: "StationPlus مدیریت موجودی و فروش را برای ما ساده کرد.",
          ps: "StationPlus زموږ لپاره مدیریت اسانه کړه.",
          en: "StationPlus simplified inventory and sales management for us.",
        },
        productId: stationplus.id,
        sortOrder: 1,
        published: true,
      },
    ],
  });

  await prisma.siteSetting.upsert({
    where: { key: "global_social" },
    create: {
      key: "global_social",
      valueJson: [
        { platform: "github", url: "https://github.com/akbaridev" },
        { platform: "telegram", url: "https://t.me/akbaridev" },
      ],
    },
    update: {},
  });

  await prisma.siteSetting.upsert({
    where: { key: "global_contact" },
    create: {
      key: "global_contact",
      valueJson: {
        email: "hello@akbaridev.com",
        whatsapp: "+93701234567",
        telegram: "akbaridev",
        supportMessage: {
          fa: "برای پشتیبانی فنی با ما تماس بگیرید.",
          ps: "د تخنیکي ملاتړ لپاره موږ سره اړیکه ونیسئ.",
          en: "Contact us for technical support.",
        },
        pricingMessage: {
          fa: "برای استعلام قیمت و لایسنس با ما در تماس باشید.",
          ps: "د بیې پوښتنې لپاره موږ سره اړیکه ونیسئ.",
          en: "Contact us for pricing and licensing inquiries.",
        },
      },
    },
    update: {},
  });

  console.log("Seed complete: Khayat + StationPlus + testimonials");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
