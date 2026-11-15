import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Chip Chop",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#3B688A",
    lang: "es-EC",
    icons: [
      { src: "/img/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/img/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
