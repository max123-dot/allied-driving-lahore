import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Content must never stay invisible: no IO support -> show immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  sub,
  align = "left",
  light = false,
}: {
  kicker: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="font-display text-[11px] font-bold tracking-[0.22em] text-[#E63946] uppercase">
        {kicker}
      </p>
      <h2
        className={`font-display mt-3 text-3xl font-bold text-balance sm:text-4xl ${
          light ? "text-[#101214]" : "text-[#F7F8FA]"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-3 text-[15px] leading-relaxed ${light ? "text-[#4a5158]" : "text-[#A6ADB5]"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Allied Driving School home">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E63946] font-display text-lg font-black text-white shadow-[0_8px_24px_rgba(230,57,70,0.35)]">
        A
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="font-display block text-[15px] font-bold tracking-tight text-[#F7F8FA]">
            ALLIED
          </span>
          <span className="block text-[11px] font-medium tracking-[0.18em] text-[#A6ADB5] uppercase">
            Driving School
          </span>
        </span>
      )}
    </Link>
  );
}

/** Image that falls back to the illustration when the file is missing (404). */
export function SafeImg({
  src,
  alt,
  className = "",
  eager = false,
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <VehicleArt label={fallbackLabel ?? alt} />;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/** Real vehicle photograph with graceful fallback to the illustration. */
export function VehiclePhoto({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  if (!src) return <VehicleArt label={alt} />;
  return (
    <div className={`overflow-hidden bg-[#e8eaec] ${className}`}>
      <SafeImg
        src={src}
        alt={alt}
        eager={eager}
        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
      />
    </div>
  );
}

/** Showroom frame: light studio card that makes the fleet photos pop on the dark site. */
export function ShowroomFrame({
  src,
  alt,
  eager = false,
  badge,
}: {
  src: string | null;
  alt: string;
  eager?: boolean;
  badge?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = src && !failed;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#30353B] bg-[#e8eaec] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      {showPhoto ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          onError={() => setFailed(true)}
          className="aspect-[16/10] w-full object-cover"
        />
      ) : (
        <VehicleArt label={alt} />
      )}
      {badge && (
        <span className="absolute top-4 left-4 rounded-full bg-[#101214]/85 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
          {badge}
        </span>
      )}
      <span className="absolute right-4 bottom-4 rounded-full bg-[#E63946] px-3 py-1.5 text-[11px] font-black tracking-[0.14em] text-white uppercase shadow-lg">
        Allied
      </span>
    </div>
  );
}
export function VehicleArt({ label, tone = "red" }: { label: string; tone?: "red" | "grey" | "dark" }) {
  const accent = tone === "red" ? "#E63946" : tone === "grey" ? "#8b939c" : "#3a4047";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#30353B] bg-gradient-to-br from-[#1e2329] to-[#121518]">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <svg viewBox="0 0 400 190" className="relative h-44 w-full sm:h-52" role="img" aria-label={label}>
        <ellipse cx="200" cy="158" rx="150" ry="12" fill="rgba(0,0,0,0.5)" />
        <path
          d="M40 140 L60 96 L110 88 L150 52 L250 52 L292 88 L350 96 L360 140 Z"
          fill="#22272d"
          stroke={accent}
          strokeWidth="2.5"
        />
        <path d="M155 56 L188 92 L122 92 Z M198 56 L232 92 L262 92 L238 56 Z" fill="#0d0f11" stroke={accent} strokeWidth="1.5" />
        <rect x="52" y="100" width="60" height="10" rx="3" fill={accent} opacity="0.85" />
        <circle cx="115" cy="140" r="26" fill="#0b0d0f" stroke="#4a5158" strokeWidth="3" />
        <circle cx="115" cy="140" r="10" fill="#2b3138" stroke={accent} strokeWidth="2" />
        <circle cx="290" cy="140" r="26" fill="#0b0d0f" stroke="#4a5158" strokeWidth="3" />
        <circle cx="290" cy="140" r="10" fill="#2b3138" stroke={accent} strokeWidth="2" />
        <rect x="150" y="104" width="100" height="12" rx="6" fill="rgba(255,255,255,0.08)" />
      </svg>
      <p className="relative border-t border-[#30353B] px-4 py-2 text-[11px] tracking-wide text-[#A6ADB5]">
        Representative illustration — actual training-vehicle photo to be added after owner confirmation.
      </p>
    </div>
  );
}
