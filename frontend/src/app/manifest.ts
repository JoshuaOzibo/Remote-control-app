import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Phone Remote",
    short_name: "Remote",
    description: "Control your laptop from your phone.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0D0E11",
    theme_color: "#0D0E11",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
