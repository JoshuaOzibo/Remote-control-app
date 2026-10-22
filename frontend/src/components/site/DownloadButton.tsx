import { Download } from "lucide-react";
import { DOWNLOAD_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export function DownloadButton({ size = "large", className }: { size?: "large" | "small"; className?: string }) {
  const large = size === "large";

  return (
    <a
      href={DOWNLOAD_URL}
      data-testid="download"
      aria-label="Download Phone Remote for Windows"
      className={cn(
        "btn-amber shrink-0 whitespace-nowrap no-underline",
        large ? "h-14 gap-2.5 rounded-[18px] px-6 text-[16px] font-bold" : "pill h-10 gap-2 rounded-[14px] px-4 text-[14px] font-semibold",
        className,
      )}
    >
      <Download size={large ? 20 : 17} strokeWidth={2} aria-hidden />
      {large ? (
        "Download for Windows"
      ) : (
        <>
          <span className="sm:hidden">Download</span>
          <span className="hidden sm:inline">Download for Windows</span>
        </>
      )}
    </a>
  );
}
