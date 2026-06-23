import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akbari Dev Group",
    short_name: "Akbari Dev",
    description:
      "All our products in one place — simple, fast, trusted. گروه توسعه اکبری",
    start_url: "/fa",
    display: "standalone",
    background_color: "#070B14",
    theme_color: "#00E5BE",
    orientation: "portrait-primary",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
