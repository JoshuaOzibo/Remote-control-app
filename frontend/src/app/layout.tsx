import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import { IS_SITE } from "@/lib/site";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
});

const SITE_TITLE = "Phone Remote: your phone is your laptop's remote";
const SITE_DESCRIPTION =
  "Turn your phone into a remote control and trackpad for your Windows laptop. No account, no cloud: it works over your own Wi-Fi. Try the live demo.";
const SITE_ORIGIN = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const remoteMetadata: Metadata = {
  title: "Remote",
  description: "Control your laptop from your phone.",
  appleWebApp: { capable: true, title: "Remote", statusBarStyle: "black-translucent" },
};

const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Phone Remote",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Phone Remote: a phone remote and trackpad for Windows" }],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: ["/og.png"] },
};

export const metadata: Metadata = IS_SITE ? siteMetadata : remoteMetadata;

export const viewport: Viewport = IS_SITE
  ? { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0D0E11" }
  : {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
      viewportFit: "cover",
      themeColor: "#0D0E11",
    };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-dvh bg-bg font-sans text-text">{children}</body>
    </html>
  );
}
