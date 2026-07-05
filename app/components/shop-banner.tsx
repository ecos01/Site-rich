import Image from "next/image";
import Link from "next/link";

// Dark hero strip with the LAB19 logo — sits atop /shop and internal shop pages.
export function ShopBanner() {
  return (
    <Link
      href="/"
      aria-label="LAB19 — home"
      className="flex w-full items-center justify-center bg-[#171717] px-6 py-5 md:py-6"
    >
      <Image
        src="/logo.png"
        alt="LAB19 — Sneakers & Lifestyles"
        width={343}
        height={95}
        priority
        className="h-auto w-[160px] md:w-[190px]"
      />
    </Link>
  );
}
