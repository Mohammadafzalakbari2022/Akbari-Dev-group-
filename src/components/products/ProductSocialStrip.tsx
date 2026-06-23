import { SocialStrip } from "@/components/layout/SocialStrip";
import type { SocialLink } from "@/lib/social";
import { filterSocialLinks } from "@/lib/social";

type ProductSocialStripProps = {
  productSocial: unknown;
  globalSocial: SocialLink[];
  title?: string;
};

export function ProductSocialStrip({
  productSocial,
  globalSocial,
  title,
}: ProductSocialStripProps) {
  const override = Array.isArray(productSocial)
    ? (productSocial as SocialLink[])
    : [];
  const links =
    filterSocialLinks(override).length > 0 ? override : globalSocial;

  return <SocialStrip links={links} title={title} size="md" />;
}
