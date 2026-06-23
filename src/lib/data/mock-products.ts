import type { ProductDto, ProductListItem } from "./types";

const now = new Date("2026-03-15");

export const MOCK_PRODUCTS: ProductDto[] = [
  {
    id: "mock-khayat",
    slug: "khayat",
    status: "published",
    featured: true,
    isNew: false,
    isNewUntil: null,
    iconUrl: null,
    coverUrl: null,
    nameJson: {
      fa: "خیاط",
      ps: "خیاط",
      en: "Khayat",
    },
    taglineJson: {
      fa: "مدیریت سفارشات و اندازه‌گیری برای خیاطان",
      ps: "د خیاطانو لپاره د امرونو او اندازه‌ګیري مدیریت",
      en: "Order and measurement management for tailors",
    },
    purposeJson: {
      fa: "خیاط برای خیاطان افغان طراحی شده است تا سفارشات، اندازه‌گیری مشتریان و تاریخچه کار را به‌سادگی مدیریت کنند. دیگر نیازی به دفترچه کاغذی نیست.",
      ps: "خیاط د افغان خیاطانو لپاره جوړ شوی دی ترڅو امرونه، د پیرودونکو اندازې او د کار تاریخچه په اسانۍ اداره کړي.",
      en: "Khayat is built for Afghan tailors to manage orders, customer measurements, and work history easily — no more paper notebooks.",
    },
    featuresJson: [
      {
        icon: "clipboard-list",
        title_json: {
          fa: "مدیریت سفارشات",
          ps: "د امرونو مدیریت",
          en: "Order management",
        },
        description_json: {
          fa: "ثبت، پیگیری و تکمیل سفارشات با وضعیت‌های مختلف",
          ps: "د امرونو ثبت، تعقیب او بشپړول",
          en: "Track orders from new to completed",
        },
      },
      {
        icon: "ruler",
        title_json: {
          fa: "اندازه‌گیری مشتری",
          ps: "د پیرودونکي اندازې",
          en: "Customer measurements",
        },
        description_json: {
          fa: "ذخیره اندازه‌های هر مشتری برای سفارشات بعدی",
          ps: "د هر پیرودونکي اندازې ساتل",
          en: "Save measurements for repeat customers",
        },
      },
      {
        icon: "bell",
        title_json: {
          fa: "یادآوری تحویل",
          ps: "د تحویل یادونه",
          en: "Delivery reminders",
        },
        description_json: {
          fa: "اعلان برای سفارشات نزدیک به موعد تحویل",
          ps: "د تحویل نېږدې امرونو لپاره خبرتیا",
          en: "Alerts for orders nearing delivery date",
        },
      },
    ],
    requirementsJson: {
      android: {
        fa: "اندروید ۸ به بالا، ۵۰ مگابایت فضای خالی",
        ps: "اندروید ۸ یا ډیر، ۵۰ MB خالي ځای",
        en: "Android 8+, 50 MB free storage",
      },
    },
    contactJson: {
      support_json: {
        fa: "برای پشتیبانی فنی با ما در واتساپ تماس بگیرید.",
        ps: "د تخنیکي ملاتړ لپاره موږ سره په واتساپ اړیکه ونیسئ.",
        en: "Contact us on WhatsApp for technical support.",
      },
      whatsapp: "+93701234567",
    },
    socialJson: null,
    pricingJson: {
      type: "free",
      label_json: { fa: "رایگان", ps: "وړیا", en: "Free" },
    },
    seoJson: null,
    downloadCount: 1240,
    sortOrder: 1,
    updatedAt: now,
    platforms: [
      {
        id: "mock-khayat-android",
        platform: "android",
        version: "1.2.0",
        fileSize: "12 MB",
        minOs: "Android 8+",
        downloadUrl:
          "https://github.com/example/khayat/releases/download/v1.2.0/khayat.apk",
        isActive: true,
        sortOrder: 0,
      },
    ],
    screenshots: [
      {
        id: "mock-khayat-ss1",
        url: "https://placehold.co/600x1200/0f1629/00e5be?text=Khayat",
        captionJson: {
          fa: "صفحه سفارشات",
          ps: "د امرونو پاڼه",
          en: "Orders screen",
        },
        sortOrder: 0,
      },
      {
        id: "mock-khayat-ss2",
        url: "https://placehold.co/600x1200/0f1629/3b82f6?text=Measurements",
        captionJson: { fa: "اندازه‌گیری", ps: "اندازې", en: "Measurements" },
        sortOrder: 1,
      },
    ],
    guides: [
      {
        id: "mock-khayat-guide1",
        type: "video",
        titleJson: {
          fa: "ویدیوی آموزشی",
          ps: "زده کړې ویډیو",
          en: "Tutorial video",
        },
        contentJson: {
          embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
        fileUrl: null,
        externalUrl: null,
        sortOrder: 0,
        isPublished: true,
      },
      {
        id: "mock-khayat-guide2",
        type: "steps",
        titleJson: {
          fa: "مراحل شروع",
          ps: "د پیل مرحلې",
          en: "Getting started",
        },
        contentJson: {
          fa: [
            "اپلیکیشن را نصب کنید",
            "اولین مشتری را اضافه کنید",
            "سفارش جدید ثبت کنید",
          ],
          ps: [
            "اپلیکیشن نصب کړئ",
            "لومړی پیرودونکی اضافه کړئ",
            "نوی امر ثبت کړئ",
          ],
          en: [
            "Install the app",
            "Add your first customer",
            "Create a new order",
          ],
        },
        fileUrl: null,
        externalUrl: null,
        sortOrder: 1,
        isPublished: true,
      },
    ],
    changelog: [
      {
        id: "mock-khayat-cl1",
        version: "1.2.0",
        date: new Date("2026-03-01"),
        notesJson: {
          fa: "بهبود عملکرد و رفع باگ‌های جزئی",
          ps: "د فعالیت ښه والی او کوچني باګونه حل شول",
          en: "Performance improvements and minor bug fixes",
        },
        platform: "android",
      },
      {
        id: "mock-khayat-cl2",
        version: "1.1.0",
        date: new Date("2026-01-15"),
        notesJson: {
          fa: "افزودن یادآوری تحویل",
          ps: "د تحویل یادونه اضافه شوه",
          en: "Added delivery reminders",
        },
        platform: "android",
      },
    ],
    reviews: [
      {
        id: "mock-khayat-r1",
        authorName: "احمد",
        rating: 5,
        comment: "برای کار خیاطی عالی است!",
        status: "approved",
        createdAt: new Date("2026-02-10"),
      },
      {
        id: "mock-khayat-r2",
        authorName: "فاطمه",
        rating: 4,
        comment: "خیلی ساده و کاربردی",
        status: "approved",
        createdAt: new Date("2026-01-20"),
      },
    ],
    averageRating: 4.5,
    reviewCount: 2,
  },
  {
    id: "mock-stationplus",
    slug: "stationplus",
    status: "published",
    featured: true,
    isNew: true,
    isNewUntil: new Date("2026-06-30"),
    iconUrl: null,
    coverUrl: null,
    nameJson: {
      fa: "استیشن پلاس",
      ps: "سټیشن پلس",
      en: "StationPlus",
    },
    taglineJson: {
      fa: "مدیریت پمپ بنzin و فروش سوخت",
      ps: "د بنzin پمپ او سون توکو پلور مدیریت",
      en: "Fuel station and pump management",
    },
    purposeJson: {
      fa: "استیشن پلاس برای صاحبان پمپ بنzin در افغانستان طراحی شده تا فروش، موجودی و گزارشات روزانه را یکجا مدیریت کنند.",
      ps: "سټیشن پلس د افغانستان د بنzin پمپونو لپاره دی ترڅو پلور، موجودي او ورځني راپورونه اداره کړي.",
      en: "StationPlus helps fuel station owners in Afghanistan manage sales, inventory, and daily reports in one place.",
    },
    featuresJson: [
      {
        icon: "fuel",
        title_json: {
          fa: "ثبت فروش سوخت",
          ps: "د سون توکو پلور ثبت",
          en: "Fuel sales tracking",
        },
        description_json: {
          fa: "ثبت سریع فروش بنzin، دیزل و گاز",
          ps: "د بنzin، ډیzel او ګاز چټک ثبت",
          en: "Quick logging for petrol, diesel, and gas",
        },
      },
      {
        icon: "bar-chart",
        title_json: {
          fa: "گزارشات روزانه",
          ps: "ورځني راپورونه",
          en: "Daily reports",
        },
        description_json: {
          fa: "خلاصه فروش و موجودی هر روز",
          ps: "د هرې ورځې پلور او موجودي لنځیز",
          en: "Daily sales and inventory summaries",
        },
      },
      {
        icon: "globe",
        title_json: {
          fa: "دسترسی وب",
          ps: "ویب لاسرسی",
          en: "Web access",
        },
        description_json: {
          fa: "مدیریت از مرورگر یا اپ اندروید",
          ps: "د براوزر یا اندروید اپ څخه مدیریت",
          en: "Manage from browser or Android app",
        },
      },
    ],
    requirementsJson: {
      android: {
        fa: "اندروید ۹ به بالا",
        ps: "اندروید ۹ یا ډیر",
        en: "Android 9+",
      },
      web: {
        fa: "مرورگر مدرن (Chrome, Firefox, Safari)",
        ps: "عصري براوزر",
        en: "Modern browser (Chrome, Firefox, Safari)",
      },
    },
    contactJson: {
      support_json: {
        fa: "برای قیمت و پشتیبانی با ما تماس بگیرید.",
        ps: "د بیې او ملاتړ لپاره موږ سره اړیکه ونیسئ.",
        en: "Contact us for pricing and support.",
      },
      whatsapp: "+93701234567",
      email: "support@akbaridev.com",
    },
    socialJson: null,
    pricingJson: {
      type: "contact",
      label_json: {
        fa: "تماس بگیرید",
        ps: "اړیکه ونیسئ",
        en: "Contact for price",
      },
    },
    seoJson: null,
    downloadCount: 856,
    sortOrder: 2,
    updatedAt: now,
    platforms: [
      {
        id: "mock-stationplus-android",
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
        id: "mock-stationplus-web",
        platform: "web",
        version: "2.0.1",
        fileSize: null,
        minOs: null,
        downloadUrl: "https://app.stationplus.example.com",
        isActive: true,
        sortOrder: 1,
      },
    ],
    screenshots: [
      {
        id: "mock-stationplus-ss1",
        url: "https://placehold.co/800x500/0f1629/f59e0b?text=Dashboard",
        captionJson: { fa: "داشبورد", ps: "ډشبورډ", en: "Dashboard" },
        sortOrder: 0,
      },
    ],
    guides: [
      {
        id: "mock-stationplus-guide1",
        type: "faq",
        titleJson: { fa: "سوالات متداول", ps: "عمومي پوښتنې", en: "FAQ" },
        contentJson: {
          fa: [
            {
              q: "آیا آفلاین کار می‌کند؟",
              a: "بله، داده‌ها محلی ذخیره و بعد همگام می‌شوند.",
            },
            {
              q: "چند کاربر می‌توانند استفاده کنند؟",
              a: "بسته به پلن شما — با ما تماس بگیرید.",
            },
          ],
          ps: [
            { q: "ایا آفلاین کار کوي؟", a: "هو، ډېټا محلي ساتل کیږي." },
            { q: "څومره کاروونکي؟", a: "ستاسo پلن پورې اړه لري." },
          ],
          en: [
            {
              q: "Does it work offline?",
              a: "Yes, data is stored locally and synced later.",
            },
            {
              q: "How many users?",
              a: "Depends on your plan — contact us.",
            },
          ],
        },
        fileUrl: null,
        externalUrl: null,
        sortOrder: 0,
        isPublished: true,
      },
    ],
    changelog: [
      {
        id: "mock-stationplus-cl1",
        version: "2.0.1",
        date: new Date("2026-03-10"),
        notesJson: {
          fa: "نسخه وب و اندروید همگام",
          ps: "ویب او اندروید همغږي",
          en: "Web and Android sync release",
        },
        platform: null,
      },
    ],
    reviews: [
      {
        id: "mock-stationplus-r1",
        authorName: "کریم",
        rating: 5,
        comment: "مدیریت پمپ خیلی راحت شد",
        status: "approved",
        createdAt: new Date("2026-02-28"),
      },
    ],
    averageRating: 5,
    reviewCount: 1,
  },
];

export function toListItem(product: ProductDto): ProductListItem {
  return {
    id: product.id,
    slug: product.slug,
    status: product.status,
    featured: product.featured,
    isNew: product.isNew,
    isNewUntil: product.isNewUntil,
    iconUrl: product.iconUrl,
    nameJson: product.nameJson,
    taglineJson: product.taglineJson,
    downloadCount: product.downloadCount,
    sortOrder: product.sortOrder,
    updatedAt: product.updatedAt,
    platforms: product.platforms.map((p) => ({ platform: p.platform })),
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
  };
}

export const MOCK_PRODUCT_LIST: ProductListItem[] =
  MOCK_PRODUCTS.map(toListItem);

export function getMockProductBySlug(slug: string): ProductDto | null {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export const MOCK_HERO_SETTINGS = {
  headlineJson: null,
  subheadlineJson: null,
  statProducts: MOCK_PRODUCTS.length,
  statDownloads: MOCK_PRODUCTS.reduce((s, p) => s + p.downloadCount, 0),
  featuredProducts: MOCK_PRODUCT_LIST.filter((p) => p.featured),
};

export const MOCK_ABOUT_SECTIONS = [
  {
    slug: "story",
    titleJson: {
      fa: "داستان ما",
      ps: "زموږ کیسه",
      en: "Our Story",
    },
    contentJson: {
      fa: "گروه توسعه اکبری در افغانستان با هدف ساختن ابزارهای دیجیتال کاربردی برای کسب‌وکارهای محلی تأسیس شد. ما به زبان‌های دری، پښتو و انگلیسی فکر می‌کنیم.",
      ps: "د اکبري پراختیاګروپ په افغانستان کې د محلي سوداګرۍ لپاره ګټور ډیجیټل وسایل جوړولو موخه لري.",
      en: "Akbari Dev Group was founded in Afghanistan to build practical digital tools for local businesses. We think in Dari, Pashto, and English.",
    },
  },
  {
    slug: "mission",
    titleJson: {
      fa: "مأموریت",
      ps: "ماموریت",
      en: "Mission",
    },
    contentJson: {
      fa: "ساده‌سازی کار روزمره با نرم‌افزار قابل اعتماد — برای خیاطان، پمپ‌داران و هر کسب‌وکار کوچکی که به راه‌حل محلی نیاز دارد.",
      ps: "د ورځني کار ساده کول د باوري سافټویر سره.",
      en: "Simplify daily work with trusted software — for tailors, station owners, and every small business that needs a local solution.",
    },
  },
];

export const MOCK_TEAM_MEMBERS = [
  {
    id: "mock-team-1",
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
    photoUrl: null,
    socialJson: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
    sortOrder: 0,
  },
  {
    id: "mock-team-2",
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
    photoUrl: null,
    socialJson: null,
    sortOrder: 1,
  },
];
