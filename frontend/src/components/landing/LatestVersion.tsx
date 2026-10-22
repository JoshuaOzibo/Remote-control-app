"use client";

import { useEffect, useState } from "react";
import { LATEST_RELEASE_API } from "@/lib/site";

type Release = { version: string; date: string };

function toRelease(value: unknown): Release | null {
  if (typeof value !== "object" || value === null) return null;
  const { tag_name: tag, published_at: published } = value as { tag_name?: unknown; published_at?: unknown };
  if (typeof tag !== "string" || typeof published !== "string") return null;
  const date = new Date(published).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  return { version: tag.startsWith("v") ? tag : `v${tag}`, date };
}

export function LatestVersion({ className }: { className?: string }) {
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(LATEST_RELEASE_API, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled) setRelease(toRelease(data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span className={className} data-testid="latest-version">
      {release ? `${release.version} · released ${release.date}` : "Latest version"} · Windows 10 and 11 · Free
    </span>
  );
}
