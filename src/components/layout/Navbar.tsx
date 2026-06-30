"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/about" as const, key: "about" as const },
  { href: "/products" as const, key: "products" as const },
  { href: "/reviews" as const, key: "reviews" as const },
  { href: "/contact" as const, key: "contact" as const },
];

type NavbarProps = {
  logoUrl?: string;
};

export function Navbar({ logoUrl }: NavbarProps) {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass-panel">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-text-primary shrink-0"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={tBrand("shortName")}
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/15 text-sm font-bold text-accent-primary">
              A
            </span>
          )}
          <span className="hidden sm:inline">{tBrand("shortName")}</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-glass hover:text-text-primary"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? tCommon("closeMenu") : tCommon("openMenu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden border-t border-border bg-bg-surface transition-all duration-200 overflow-hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-text-primary hover:bg-bg-glass"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-border sm:hidden">
            <LanguageSwitcher className="w-full justify-center" />
          </div>
        </nav>
      </div>
    </header>
  );
}
