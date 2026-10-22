import Image from "next/image";
import Link from "next/link";

export function SiteBrand() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[16px] font-bold text-text no-underline">
      <Image src="/icons/icon-192.png" alt="" width={32} height={32} className="rounded-[9px]" priority />
      Phone Remote
    </Link>
  );
}
