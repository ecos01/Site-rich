import Link from "next/link";
import { ArrowRight } from "lucide-react";
import nineteenLogo from "~/assets/nineteen-logo-transparent.png";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-12"
      style={{ background: "linear-gradient(135deg, #B4B8BA 0%, #EDEDEB 50%, #B9E1DE 100%)" }}
    >
      {/* Pulsing gradient blobs */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="blob"
          style={{ background: "#B4B8BA", top: "-20%", left: "-15%" }}
        />
        <div
          className="blob"
          style={{
            background: "#B9E1DE",
            bottom: "-25%",
            right: "-10%",
            animationDelay: "-4s",
            animationDuration: "15s",
          }}
        />
        <div
          className="blob"
          style={{
            background: "#EDEDEB",
            top: "30%",
            right: "25%",
            width: "40vw",
            height: "40vw",
            animationDelay: "-8s",
            animationDuration: "10s",
          }}
        />
      </div>

      <h1 className="font-display rise relative uppercase text-[clamp(4rem,11vw,10rem)] leading-[0.8] text-foreground">
        <span className="block">We are</span>
        <span className="block ml-[8vw]">LAB19</span>
      </h1>

      <div className="relative mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p
          className="rise max-w-[400px] text-lg leading-relaxed text-foreground/80"
          style={{ animationDelay: "0.15s" }}
        >
          Loud silhouettes. Warm palette. Garments built like posters —
          set in heavy type and worn at full volume.
        </p>

        <div
          className="rise flex flex-wrap items-center gap-4 md:gap-8"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href="/shop" className="btn-brutal">
            <span>Shop the drop</span>
          </Link>
          <Link
            href="/nineteen"
            aria-label="Shop Nineteen"
            className="group inline-flex items-center gap-3 text-base font-medium uppercase tracking-[0.1em] text-[#008F95]"
          >
            <img src={nineteenLogo} alt="" className="h-7 w-auto" />
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
