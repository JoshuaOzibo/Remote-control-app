import Link from "next/link";
import { DownloadButton } from "@/components/site/DownloadButton";
import { SiteBrand } from "@/components/site/SiteBrand";
import { AUTHOR_URL, RELEASES_URL, REPO_URL } from "@/lib/site";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { DemoBand, DownloadSection, Features, HowItWorks, Privacy } from "./Sections";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

export function Landing() {
  return (
    <div className="site min-h-dvh overflow-x-clip bg-bg">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center gap-6 px-5 sm:px-8">
          <SiteBrand />
          <nav aria-label="Sections" className="hidden items-center gap-6 text-[14px] text-muted md:flex">
            {NAV.map(({ href, label }) => (
              <a key={href} href={href} className="no-underline hover:text-text">
                {label}
              </a>
            ))}
            <Link href="/demo/" className="no-underline hover:text-text">
              Demo
            </Link>
          </nav>
          <DownloadButton size="small" className="ml-auto" />
        </div>
      </header>

      <main>
        <Hero />
        <HowItWorks />
        <DemoBand />
        <Features />
        <Privacy />
        <DownloadSection />
        <Faq />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-5 py-10 text-[14px] text-muted sm:flex-row sm:items-center sm:px-8">
          <SiteBrand />
          <span className="sm:ml-4">
            Made by{" "}
            <a href={AUTHOR_URL} className="text-text">
              Joshua Ozibo
            </a>
          </span>
          <nav aria-label="Project links" className="flex gap-5 sm:ml-auto">
            <a href={REPO_URL} className="no-underline hover:text-text">
              GitHub
            </a>
            <a href={RELEASES_URL} className="no-underline hover:text-text">
              Releases
            </a>
            <Link href="/demo/" className="no-underline hover:text-text">
              Live demo
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
