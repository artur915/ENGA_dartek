import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Building2,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export function HeroSection() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  const stats = [
    { value: "147+", label: t("stats.services") },
    { value: "10", label: t("stats.categories") },
    { value: "7", label: t("stats.packages") },
  ];

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#041612] text-white lg:min-h-[calc(100vh-4.5rem)]">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(18,122,101,0.35)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.18)_0%,_transparent_45%)]" />
        <div className="absolute -start-32 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary-light/20 blur-[100px]" />
        <div className="absolute -end-24 bottom-0 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container-app relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 lg:min-h-[calc(100vh-4.5rem)] lg:py-16">
        {/* Top badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm font-semibold text-accent-light shadow-[0_0_30px_rgba(212,175,55,0.25)] backdrop-blur-md">
          <Sparkles className="h-4 w-4" />
          Saudi Arabia&apos;s Engineering Services Marketplace
        </div>

        {/* Center hero image — CEO & team */}
        <div className="relative mx-auto w-full max-w-4xl px-2">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary-light/40 via-accent/30 to-primary-light/40 opacity-70 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#041612] via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#041612]/40 via-transparent to-[#041612]/40" />
            <Image
              src="/landing/hero-ceo-conversation.png"
              alt="ENGA CEO consulting with a professional team member"
              width={1280}
              height={720}
              priority
              className="aspect-[16/10] w-full object-cover object-center sm:aspect-[16/9]"
            />
            <div className="absolute bottom-0 start-0 end-0 z-20 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
                <Users className="h-3.5 w-3.5 text-accent-light" />
                Leadership-led service · Trusted engineering partnerships
              </div>
            </div>
          </div>

          {/* Floating accent cards */}
          <div className="absolute -start-2 top-8 z-30 hidden rounded-2xl border border-white/15 bg-white/10 p-4 shadow-elevated backdrop-blur-xl lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-light">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/60">Licensed Offices</p>
                <p className="text-sm font-bold">Verified & Approved</p>
              </div>
            </div>
          </div>
          <div className="absolute -end-2 bottom-16 z-30 hidden rounded-2xl border border-white/15 bg-white/10 p-4 shadow-elevated backdrop-blur-xl lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light/30 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/60">End-to-end</p>
                <p className="text-sm font-bold">Request → Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Headline below image */}
        <div className="relative z-10 mt-10 max-w-4xl text-center">
          <h1 className="text-balance bg-gradient-to-b from-white via-white to-white/75 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/sign-up?role=client"
              className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-light px-7 text-base font-bold text-primary-dark shadow-[0_8px_32px_rgba(212,175,55,0.45)] transition-all hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(212,175,55,0.55)] active:scale-[0.98] sm:h-[3.25rem]"
            >
              {t("ctaClient")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 sm:h-[3.25rem]"
            >
              <FileCheck className="h-5 w-5" />
              {tc("learnMore")}
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 mt-12 grid w-full max-w-3xl grid-cols-3 gap-3 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-md transition-colors hover:border-accent/30 hover:bg-white/10 sm:px-6 sm:py-5"
            >
              <div className="flex items-center justify-center gap-1">
                <Star className="hidden h-4 w-4 text-accent-light sm:block" />
                <p className="text-2xl font-bold text-accent-light sm:text-3xl">{stat.value}</p>
              </div>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/60 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
