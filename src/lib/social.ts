import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
  FaTelegram,
  FaWhatsapp,
  FaGlobe,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const SOCIAL_ICONS: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  instagram: FaInstagram,
  x: FaXTwitter,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  telegram: FaTelegram,
  whatsapp: FaWhatsapp,
  website: FaGlobe,
  email: FaEnvelope,
  phone: FaPhone,
};

export function getSocialIcon(platform: string): IconType {
  return SOCIAL_ICONS[platform.toLowerCase()] ?? FaGlobe;
}

export function formatWhatsAppUrl(number: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function formatTelegramUrl(handle: string): string {
  const trimmed = handle.trim();
  if (trimmed.startsWith("http")) return trimmed;
  const username = trimmed.replace(/^@/, "");
  return `https://t.me/${username}`;
}

export function formatEmailUrl(email: string): string {
  return `mailto:${email.trim()}`;
}

export function formatPhoneUrl(phone: string): string {
  return `tel:${phone.trim()}`;
}

export type SocialLink = { platform: string; url: string };

export function normalizeSocialUrl(platform: string, url: string): string {
  const p = platform.toLowerCase();
  if (p === "whatsapp") return formatWhatsAppUrl(url);
  if (p === "telegram") return formatTelegramUrl(url);
  if (p === "email") return formatEmailUrl(url);
  if (p === "phone") return formatPhoneUrl(url);
  return url.trim();
}

export function filterSocialLinks(links: SocialLink[]): SocialLink[] {
  return links.filter((l) => l.url?.trim());
}
