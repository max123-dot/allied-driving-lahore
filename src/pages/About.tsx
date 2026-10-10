import { useState } from "react";
import { Link } from "react-router-dom";
import { HERO_IMAGE } from "../config/business";
import { generalEnquiry } from "../lib/whatsapp";
import { useCms } from "../store/cms";
import { Reveal, SectionHeading, ShowroomFrame } from "../components/ui";

function AboutThumb({ src, alt, name }: { src: string; alt: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#30353B] bg-[#e8eaec]">
      {!failed ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <p className="grid aspect-[4/3] place-items-center p-4 text-center text-xs text-[#6b7280]">Photo to be added — {name}</p>
      )}
      <p className="bg-[#191D21] px-3 py-2 text-xs font-bold text-white">{name}</p>
    </div>
  );
}

export function About() {
  const { vehicles, contact } = useCms();
  const wa = generalEnquiry(contact.whatsappNumber);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`;
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="About"
          title="Allied Driving School Lahore"
          sub="A driving school in DHA Phase 4, Lahore, focused on clear information, straightforward enquiries and organised training arrangements. Only verified facts are published on this page — no invented history, statistics or credentials."
        />
      </Reveal>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-4">
            <ShowroomFrame
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              badge="Lahore"
              eager
            />
            <div className="grid grid-cols-2 gap-4">
              {vehicles.filter((v) => v.published && v.image).slice(0, 2).map((v) => (
                <AboutThumb key={v.id} src={v.image!} alt={v.imageAlt} name={v.name} />
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-white">Our approach</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#A6ADB5]">
              <li><strong className="text-white">Explain first.</strong> We confirm the vehicle, fees and schedule before you commit.</li>
              <li><strong className="text-white">Train practically.</strong> Sessions are arranged around your experience level.</li>
              <li><strong className="text-white">Stay reachable.</strong> Enquire by phone or WhatsApp and get a direct answer.</li>
              <li><strong className="text-white">No hidden claims.</strong> If a detail is not confirmed, we say so and ask you to call.</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-[#101214] p-4 text-sm text-[#A6ADB5]">
              <p className="font-semibold text-white">Visit us</p>
              <p className="mt-1 leading-relaxed">{contact.address}</p>
              <p className="mt-2">{contact.hoursNote}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-semibold text-[#E63946] hover:underline">
                Get directions in Google Maps →
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-10">
        <Reveal>
          <SectionHeading kicker="Fleet categories" title="Vehicle categories shared with us" sub="Availability is confirmed at enquiry. Transmission details are published only after the owner verifies them." />
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.filter((v) => v.published).map((v, i) => (
            <Reveal key={v.id} delay={i * 60}>
              <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-5">
                <p className="text-[11px] font-bold tracking-[0.18em] text-[#E63946] uppercase">{v.category}</p>
                <h3 className="font-display mt-1 font-bold text-white">{v.name}</h3>
                <p className="mt-2 text-[13px] text-[#A6ADB5]">{v.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-[#30353B] bg-[#0c0e10] p-6 text-center sm:flex-row sm:justify-center">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#E63946] px-6 py-3 text-sm font-bold text-white hover:bg-[#b92330]">
            Enquire on WhatsApp
          </a>
          <Link to="/courses" className="rounded-xl border border-[#30353B] px-6 py-3 text-sm font-bold text-white hover:border-white">
            Browse courses
          </Link>
        </div>
      </Reveal>
      <p className="mt-4 text-center text-xs text-[#6b7280]">Call {contact.phoneDisplay} · {contact.hoursNote}</p>
    </main>
  );
}
