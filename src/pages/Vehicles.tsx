import { useMemo, useState } from "react";
import { isOfferExpired } from "../config/business";
import { generalEnquiry, telHref } from "../lib/whatsapp";
import { useCms } from "../store/cms";
import { OfferCard, VehicleCard } from "../components/cards";
import { Reveal, SectionHeading } from "../components/ui";

export function Vehicles() {
  const { vehicles, offers } = useCms();
  const [filter, setFilter] = useState("All");
  const cats = useMemo(() => ["All", ...Array.from(new Set(vehicles.filter((v) => v.published).map((v) => v.category)))], [vehicles]);
  const list = vehicles.filter((v) => v.published && (filter === "All" || v.category === filter));
  const activeOffers = offers.filter((o) => o.active && !isOfferExpired(o));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="Vehicles & offers"
          title="Training vehicles & active promotions"
          sub="Each item shows verified details, current price where confirmed, availability, and a prefilled WhatsApp enquiry."
        />
      </Reveal>
      <Reveal>
        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Filter by category">
          {cats.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold ${filter === c ? "bg-[#E63946] text-white" : "border border-[#30353B] bg-[#191D21] text-[#A6ADB5] hover:text-white"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((v, i) => (
          <Reveal key={v.id} delay={Math.min(i, 4) * 60}>
            <VehicleCard vehicle={v} />
          </Reveal>
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-6 rounded-2xl border border-[#30353B] bg-[#191D21] p-8 text-center text-sm text-[#A6ADB5]">
          No vehicles in this category right now. Please call or WhatsApp to check availability.
        </p>
      )}

      <div className="mt-12">
        <Reveal>
          <SectionHeading kicker="Promotions" title="Active offers" sub="Expired offers are hidden automatically." />
        </Reveal>
        {activeOffers.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-[#30353B] bg-[#191D21] p-6 text-sm text-[#A6ADB5]">
            No confirmed promotion is running right now. Ask us on WhatsApp about current admissions.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {activeOffers.map((o, i) => (
              <Reveal key={o.id} delay={i * 60}>
                <OfferCard offer={o} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export function FaqsPage() {
  const { faqs, contact } = useCms();
  const tel = telHref(contact.phoneHref);
  const wa = generalEnquiry(contact.whatsappNumber);
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="FAQs"
          title="Frequently asked questions"
          sub="Answers use confirmed business information. For anything unconfirmed, we direct you to call or WhatsApp."
        />
      </Reveal>
      <Reveal>
        <div className="mt-6 divide-y divide-[#30353B] rounded-2xl border border-[#30353B] bg-[#191D21]">
          {faqs.map((f, i) => (
            <details key={i} className="group px-6 py-5" name="faq-page">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-bold text-white">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#30353B] text-[#E63946] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#A6ADB5]">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={tel} className="flex-1 rounded-xl border border-[#30353B] px-6 py-3 text-center text-sm font-bold text-white">
            Call {contact.phoneDisplay}
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-[#E63946] px-6 py-3 text-center text-sm font-bold text-white">
            Ask on WhatsApp
          </a>
        </div>
      </Reveal>
    </main>
  );
}
