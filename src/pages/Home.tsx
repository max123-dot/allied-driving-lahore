import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HERO_IMAGE, isOfferExpired } from "../config/business";
import { generalEnquiry, telHref } from "../lib/whatsapp";
import { useCms } from "../store/cms";
import { CourseCard, FaqList, OfferCard, VehicleCard } from "../components/cards";
import { Reveal, SectionHeading, ShowroomFrame } from "../components/ui";

function FleetStripButton({ name, image, onSelect }: { name: string; image: string | null; onSelect: () => void }) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      onClick={onSelect}
      className="group overflow-hidden rounded-2xl border border-white/15 bg-black/45 text-left backdrop-blur-sm transition-colors hover:border-[#E63946]"
      aria-label={`View ${name}`}
    >
      {image && !failed && (
        <img src={image} alt="" aria-hidden="true" loading="lazy" onError={() => setFailed(true)} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      )}
      <span className="block px-3 py-2 text-[13px] font-bold text-white">
        {name} <span className="float-right text-[#E63946]">→</span>
      </span>
    </button>
  );
}

function GalleryThumb({ src, alt, aspect, onOpen, label }: { src: string; alt: string; aspect: string; onOpen: () => void; label: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      onClick={onOpen}
      className="group block w-full overflow-hidden rounded-2xl border border-[#30353B] bg-[#e8eaec] text-left"
      aria-label={label}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${aspect}`}
        />
      ) : (
        <span className="grid aspect-[4/3] place-items-center p-4 text-center text-xs text-[#6b7280]">
          {alt}
        </span>
      )}
    </button>
  );
}

export function Home() {
  const { courses, vehicles, offers, faqs, gallery, contact } = useCms();
  const published = vehicles.filter((v) => v.published);
  const [tab, setTab] = useState(published[0]?.id ?? "");
  useEffect(() => {
    if (!published.some((v) => v.id === tab)) setTab(published[0]?.id ?? "");
  }, [published, tab]);
  const activeVehicle = vehicles.find((v) => v.id === tab) ?? published[0];
  const activeOffers = useMemo(
    () => offers.filter((o) => o.active && !isOfferExpired(o)),
    [offers],
  );
  const publishedCourses = courses.filter((c) => c.published).slice(0, 3);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [heroFailed, setHeroFailed] = useState(false);
  const [ctaFailed, setCtaFailed] = useState(false);
  const tel = telHref(contact.phoneHref);
  const wa = generalEnquiry(contact.whatsappNumber);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  return (
    <main>
      {/* CINEMATIC HERO */}
      <section className="relative overflow-hidden bg-[#0c0e10]">
        <div className="absolute inset-0" aria-hidden="true">
          {!heroFailed && (
            <img
              src={HERO_IMAGE.src}
              alt=""
              fetchPriority="high"
              onError={() => setHeroFailed(true)}
              className="hero-photo h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e10] via-[#0c0e10]/72 to-[#0c0e10]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-[#0c0e10]/55" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 lg:pt-28 lg:pb-16">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#E63946]" aria-hidden="true" />
              DHA Phase 4, Lahore · Near Bhatta Chowk
            </p>
            <h1 className="font-display mt-5 max-w-2xl text-[42px] leading-[1.02] font-black text-balance text-white sm:text-6xl lg:text-7xl">
              Learn to Drive with <span className="text-[#E63946]">Confidence.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-lg">
              Take the next step towards confident driving with Allied Driving School Lahore. Explore our
              available training options and enquire about admissions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/courses"
                className="btn-shine rounded-xl bg-[#E63946] px-7 py-4 text-center text-sm font-bold text-white shadow-[0_10px_36px_rgba(230,57,70,0.5)] transition-colors hover:bg-[#b92330]"
              >
                Explore Driving Courses
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-white/30 bg-black/40 px-7 py-4 text-center text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white"
              >
                Contact Us
              </Link>
            </div>
          </Reveal>

          {/* Fleet strip */}
          <Reveal delay={150}>
            <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {published.slice(0, 4).map((v) => (
                <FleetStripButton
                  key={v.id}
                  name={v.name}
                  image={v.image}
                  onSelect={() => {
                    setTab(v.id);
                    document.getElementById("vehicles")?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* BRAND TICKER */}
      <div className="overflow-hidden border-y border-[#30353B] bg-[#E63946] py-2.5" aria-hidden="true">
        <div className="ticker flex w-max gap-8 text-[13px] font-black tracking-[0.2em] whitespace-nowrap text-white uppercase">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-8">
              <span>Suzuki Mehran</span><span>·</span><span>Honda City Automatic</span><span>·</span>
              <span>Toyota Corolla Altis</span><span>·</span><span>Scooty Training</span><span>·</span>
              <span>DHA Phase 4 Lahore</span><span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* TRUST */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="Why structured instruction"
            title="A calm, organised way to start driving"
            sub="We keep the process simple: clear information before you book, help with your enquiry, and training arranged directly with the school."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Practical driving experience", d: "Hands-on time behind the wheel, arranged around your experience level." },
            { t: "Vehicle-specific learning", d: "Ask about car or two-wheeler options and confirm availability before you visit." },
            { t: "Enquiry & admission support", d: "Call or WhatsApp us — we confirm fees, timing and next steps in plain language." },
            { t: "Information before booking", d: "No payment until you have confirmed the price, schedule and vehicle with us." },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 80}>
              <div className="h-full rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
                <span className="font-display grid h-10 w-10 place-items-center rounded-xl bg-[#E63946]/15 text-sm font-black text-[#E63946]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-4 text-[15px] font-bold text-white">{b.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#A6ADB5]">{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="border-y border-[#30353B] bg-[#0c0e10]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                kicker="Driving courses"
                title="Training options"
                sub="Final course structure and fees are confirmed with the school. Only verified details are published here."
              />
              <Link to="/courses" className="rounded-xl border border-[#30353B] px-4 py-2.5 text-sm font-semibold text-white hover:border-[#E63946]">
                View all courses
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {publishedCourses.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
          {publishedCourses.length === 0 && (
            <p className="mt-6 rounded-2xl border border-[#30353B] bg-[#191D21] p-6 text-sm text-[#A6ADB5]">
              Contact us for current course details and fees.
            </p>
          )}
        </div>
      </section>

      {/* VEHICLES — BIG SHOWCASE */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" id="vehicles">
        <Reveal>
          <SectionHeading
            kicker="Vehicles & offers"
            title="The Allied fleet"
            sub="Our branded training vehicles. Select a category to inspect it — availability and pricing are confirmed at enquiry."
          />
        </Reveal>
        <Reveal>
          <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Vehicle categories">
            {published.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={tab === v.id}
                onClick={() => setTab(v.id)}
                className={`shrink-0 rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
                  tab === v.id ? "bg-[#E63946] text-white shadow-[0_8px_24px_rgba(230,57,70,0.4)]" : "border border-[#30353B] bg-[#191D21] text-[#A6ADB5] hover:text-white"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </Reveal>
        {activeVehicle && (
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-5" key={activeVehicle.id}>
            <Reveal>
              <div className="lg:col-span-3">
                <ShowroomFrame
                  src={activeVehicle.image}
                  alt={activeVehicle.imageAlt}
                  badge={activeVehicle.category}
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="lg:col-span-2">
                <VehicleCard vehicle={activeVehicle} />
              </div>
            </Reveal>
          </div>
        )}
        <div className="mt-4 text-center">
          <Link to="/vehicles" className="text-sm font-semibold text-[#E63946] hover:underline">
            Open the full vehicles & offers catalogue →
          </Link>
        </div>
      </section>

      {/* OFFERS */}
      {activeOffers.length > 0 && (
        <section className="border-y border-[#30353B] bg-[#0c0e10]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <Reveal>
              <SectionHeading
                kicker="Special offers"
                title="Current promotions"
                sub="Only verified, unexpired offers appear here. Discounts are calculated from confirmed prices."
              />
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {activeOffers.map((o, i) => (
                <Reveal key={o.id} delay={i * 80}>
                  <OfferCard offer={o} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <SectionHeading align="center" kicker="How it works" title="From enquiry to training in 4 steps" />
        </Reveal>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Explore options", "Browse courses and vehicles on this website."],
            ["Contact the school", "Call or WhatsApp your preferred course."],
            ["Confirm details", "Confirm price, schedule and availability with us."],
            ["Arrange training", "Agree a start plan directly with the school."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 80}>
              <li className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
                <span className="font-display text-3xl font-black text-[#E63946]">{i + 1}</span>
                <h3 className="font-display mt-2 text-[15px] font-bold text-white">{t}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#A6ADB5]">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <p className="mt-4 text-center text-xs text-[#6b7280]">
          Note: an online enquiry is a request for information — it is not a confirmed booking.
        </p>
      </section>

      {/* GALLERY */}
      <section className="border-y border-[#30353B] bg-[#0c0e10]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Reveal>
            <SectionHeading kicker="Gallery" title="The fleet up close" sub="Tap any photo to view it full-screen." />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {gallery.slice(0, 6).map((g, i) => (
              <Reveal key={i} delay={Math.min(i, 5) * 60} className={i === 0 ? "col-span-2 lg:col-span-2" : ""}>
                <GalleryThumb
                  src={g.src}
                  alt={g.alt}
                  aspect={i === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}
                  label={`View image: ${g.alt}`}
                  onOpen={() => setLightbox(i)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading kicker="FAQs" title="Common questions" />
            <Link to="/faqs" className="rounded-xl border border-[#30353B] px-4 py-2.5 text-sm font-semibold text-white hover:border-[#E63946]">
              All FAQs
            </Link>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-6">
            <FaqList faqs={faqs.slice(0, 5)} />
          </div>
        </Reveal>
      </section>

      {/* FINAL CTA — with hero backdrop */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[#30353B]">
            {!ctaFailed && <img src={HERO_IMAGE.src} alt="" aria-hidden="true" loading="lazy" onError={() => setCtaFailed(true)} className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-[#0c0e10]/78" aria-hidden="true" />
            <div className="relative p-8 text-center sm:p-14">
              <h2 className="font-display text-3xl font-black text-white sm:text-4xl">Ready to Take the Next Step?</h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/75">
                Contact Allied Driving School Lahore to discuss available training options and current fees.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine rounded-xl bg-[#E63946] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#b92330]"
                >
                  Enquire on WhatsApp
                </a>
                <a
                  href={tel}
                  className="rounded-xl border border-white/30 bg-black/40 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm hover:border-white"
                >
                  Call the School
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {lightbox !== null && gallery[lightbox] && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightbox(null)}
        >
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#30353B] bg-[#191D21]" onClick={(e) => e.stopPropagation()}>
            {gallery[lightbox].src ? (
              <img
                src={gallery[lightbox].src}
                alt={gallery[lightbox].alt}
                className="max-h-[76vh] w-full object-contain bg-black"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <p className="p-8 text-center text-sm text-[#A6ADB5]">{gallery[lightbox].alt}</p>
            )}
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="text-xs text-[#A6ADB5]">{gallery[lightbox].alt}</p>
              <button onClick={() => setLightbox(null)} className="shrink-0 rounded-xl border border-[#30353B] px-4 py-2 text-sm font-semibold text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
