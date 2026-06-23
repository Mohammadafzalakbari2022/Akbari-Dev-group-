"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

type PageViewBeaconProps = {
  locale: string;
};

function inferPageType(pathname: string): {
  pageType: string;
  productId?: string;
} {
  if (pathname === "/" || pathname === "") {
    return { pageType: "home" };
  }
  if (pathname.startsWith("/about")) return { pageType: "about" };
  if (pathname.startsWith("/contact")) return { pageType: "contact" };
  if (pathname === "/products") return { pageType: "products_list" };
  const productMatch = pathname.match(/^\/products\/([^/]+)/);
  if (productMatch) {
    return { pageType: "product_detail", productId: productMatch[1] };
  }
  return { pageType: "other" };
}

export function PageViewBeacon({ locale }: PageViewBeaconProps) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    const { pageType } = inferPageType(pathname);

    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: `/${locale}${pathname}`,
        pageType,
        locale,
        referrer: document.referrer || null,
        productSlug:
          pageType === "product_detail"
            ? pathname.split("/").pop()
            : undefined,
      }),
    }).catch(() => {
      /* analytics stub */
    });
  }, [pathname, locale]);

  return null;
}
