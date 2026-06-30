import { getPrisma } from "@/lib/prisma";
import {
  DEFAULT_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/lib/data/payments";

export type SiteSettings = {
  logo: string;
  favicon: string;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    supportMessage: Record<string, string>;
    pricingMessage: Record<string, string>;
  };
  social: { platform: string; url: string }[];
  payments: PaymentSettings;
  maintenance: {
    enabled: boolean;
    message: Record<string, string>;
  };
};

const DEFAULT_SETTINGS: SiteSettings = {
  logo: "",
  favicon: "",
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    supportMessage: {},
    pricingMessage: {},
  },
  social: [],
  payments: DEFAULT_PAYMENT_SETTINGS,
  maintenance: { enabled: false, message: {} },
};

function parsePaymentMethod(raw: unknown) {
  const m = raw as PaymentSettings["hesabpay"] | undefined;
  return {
    enabled: Boolean(m?.enabled),
    displayName: m?.displayName ?? {},
    merchantNumber: m?.merchantNumber ?? "",
    qrImageUrl: m?.qrImageUrl ?? "",
    instructions: m?.instructions ?? {},
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const prisma = getPrisma();
  if (!prisma) return DEFAULT_SETTINGS;

  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.valueJson]));
    const paymentsRaw = map.payment_methods as
      | { hesabpay?: unknown; atomapay?: unknown }
      | undefined;

    return {
      logo: (map.logo as string) ?? "",
      favicon: (map.favicon as string) ?? "",
      contact: {
        email: (map.global_contact as { email?: string })?.email ?? "",
        phone: (map.global_contact as { phone?: string })?.phone ?? "",
        whatsapp: (map.global_contact as { whatsapp?: string })?.whatsapp ?? "",
        telegram: (map.global_contact as { telegram?: string })?.telegram ?? "",
        supportMessage:
          (map.global_contact as { supportMessage?: Record<string, string> })
            ?.supportMessage ?? {},
        pricingMessage:
          (map.global_contact as { pricingMessage?: Record<string, string> })
            ?.pricingMessage ?? {},
      },
      social: Array.isArray(map.global_social)
        ? (map.global_social as { platform: string; url: string }[])
        : [],
      payments: {
        hesabpay: parsePaymentMethod(paymentsRaw?.hesabpay),
        atomapay: parsePaymentMethod(paymentsRaw?.atomapay),
      },
      maintenance: {
        enabled: Boolean(
          (map.maintenance_mode as { enabled?: boolean })?.enabled,
        ),
        message:
          (map.maintenance_message as Record<string, string>) ??
          (map.maintenance_mode as { message?: Record<string, string> })
            ?.message ??
          {},
      },
    };
  } catch (err) {
    console.error("getSiteSettings failed:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function getPageBySlug(slug: string) {
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    return await prisma.page.findUnique({ where: { slug } });
  } catch (err) {
    console.error("getPageBySlug failed:", err);
    return null;
  }
}

export async function getLegalPages() {
  const prisma = getPrisma();
  if (!prisma) return [];

  try {
    return await prisma.page.findMany({
      where: { slug: { in: ["privacy", "terms"] }, published: true },
    });
  } catch (err) {
    console.error("getLegalPages failed:", err);
    return [];
  }
}
