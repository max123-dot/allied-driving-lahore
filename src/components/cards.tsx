import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPKR, type Course, type Offer, type Vehicle, offerDiscountPercent } from "../config/business";
import { courseEnquiry, offerEnquiry, vehicleEnquiry } from "../lib/whatsapp";
import { useCms } from "../store/cms";

export function AvailabilityBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    Available: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    Limited: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    Enquire: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    Paused: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${map[value] ?? map.Enquire}`}>
      {value === "Enquire" ? "Enquire for availability" : value}
    </span>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const { contact } = useCms();
  return (
    <article className="flex flex-col rounded-2xl border border-[#30353B] bg-[#191D21] p-6 transition-colors hover:border-[#E63946]/60">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-white">{course.name}</h3>
        <AvailabilityBadge value={course.availability} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#A6ADB5]">{course.shortDescription}</p>
      <dl className="mt-4 space-y-1.5 text-[13px]">
        {course.learnerLevel && (
          <div className="flex justify-between gap-4">
            <dt className="text-[#6b7280]">Learner level</dt>
            <dd className="font-medium text-white">{course.learnerLevel}</dd>
          </div>
        )}
        {course.vehicleType && (
          <div className="flex justify-between gap-4">
            <dt className="text-[#6b7280]">Vehicle</dt>
            <dd className="text-right font-medium text-white">{course.vehicleType}</dd>
          </div>
        )}
        {course.transmissionConfirmed && course.transmission && (
          <div className="flex justify-between gap-4">
            <dt className="text-[#6b7280]">Transmission</dt>
            <dd className="font-medium text-white">{course.transmission}</dd>
          </div>
        )}
        {course.totalDuration && (
          <div className="flex justify-between gap-4">
            <dt className="text-[#6b7280]">Duration</dt>
            <dd className="font-medium text-white">{course.totalDuration}</dd>
          </div>
        )}
      </dl>
      <div className="mt-4 border-t border-[#30353B] pt-4">
        {course.priceConfirmed && course.pricePKR !== null ? (
          <p className="font-display text-xl font-black text-white">{formatPKR(course.pricePKR)}</p>
        ) : (
          <p className="text-sm text-[#A6ADB5]">Contact us for current course details and fees.</p>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/courses/${course.id}`}
          className="flex-1 rounded-xl border border-[#30353B] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:border-white"
        >
          Details
        </Link>
        <a
          href={courseEnquiry(course.name, contact.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-[#E63946] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#b92330]"
        >
          Enquire
        </a>
      </div>
    </article>
  );
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { contact } = useCms();
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#30353B] bg-[#191D21] transition-colors hover:border-[#E63946]/60">
      <div className="relative overflow-hidden bg-[#e8eaec]">
        {vehicle.image && !imgFailed ? (
          <img
            src={vehicle.image}
            alt={vehicle.imageAlt}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid aspect-[16/10] w-full place-items-center p-6 text-center text-xs text-[#6b7280]">
            Photo to be added — {vehicle.name}
          </div>
        )}
        <span className="absolute top-4 left-4 rounded-full bg-[#101214]/85 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
          {vehicle.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#E63946] uppercase">{vehicle.category}</p>
            <h3 className="font-display mt-1 text-xl font-bold text-white">{vehicle.name}</h3>
          </div>
          <AvailabilityBadge value={vehicle.availability} />
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[#A6ADB5]">{vehicle.note}</p>
        <div className="mt-3 text-[13px]">
          {vehicle.transmissionConfirmed && vehicle.transmission ? (
            <p className="text-white">
              <span className="text-[#6b7280]">Transmission: </span>
              <span className="font-semibold">{vehicle.transmission}</span>
            </p>
          ) : (
            <p className="text-[#6b7280]">Transmission: to be confirmed — please ask.</p>
          )}
        </div>
        <div className="mt-3 border-t border-[#30353B] pt-3">
          {vehicle.priceConfirmed && vehicle.pricePKR !== null ? (
            <p className="font-display text-lg font-black text-white">{formatPKR(vehicle.pricePKR)}</p>
          ) : (
            <p className="text-sm text-[#A6ADB5]">Price on enquiry.</p>
          )}
        </div>
        <a
          href={vehicleEnquiry(vehicle.name, contact.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-xl bg-[#E63946] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#b92330]"
        >
          Enquire about {vehicle.name}
        </a>
      </div>
    </article>
  );
}

export function OfferCard({ offer }: { offer: Offer }) {
  const { contact } = useCms();
  const pct = offerDiscountPercent(offer);
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[#E63946]/40 bg-gradient-to-br from-[#1e2329] to-[#141114] p-6">
      {pct !== null && offer.pricesConfirmed && (
        <span className="absolute top-4 right-4 rounded-full bg-[#E63946] px-3 py-1 text-xs font-black text-white">
          SAVE {pct}%
        </span>
      )}
      <p className="text-[11px] font-bold tracking-[0.2em] text-[#E63946] uppercase">Special offer</p>
      <h3 className="font-display mt-2 text-xl font-bold text-white">{offer.title}</h3>
      <p className="mt-1 text-sm text-[#A6ADB5]">{offer.vehicleOrCourse}</p>
      <div className="mt-4">
        {offer.pricesConfirmed && offer.discountedPricePKR !== null ? (
          <div className="flex items-baseline gap-3">
            <p className="font-display text-2xl font-black text-white">{formatPKR(offer.discountedPricePKR)}</p>
            {offer.originalPricePKR !== null && (
              <p className="text-sm text-[#6b7280] line-through">{formatPKR(offer.originalPricePKR)}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#A6ADB5]">Ask us for the current offer price.</p>
        )}
        {offer.expiryDate && (
          <p className="mt-2 text-xs text-[#A6ADB5]">
            Valid until {new Date(offer.expiryDate + "T00:00:00").toLocaleDateString("en-PK", { dateStyle: "medium" })}
          </p>
        )}
      </div>
      <a
        href={offerEnquiry(offer.title, offer.vehicleOrCourse, contact.whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block rounded-xl border border-[#E63946] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#E63946]"
      >
        Ask About This Offer
      </a>
    </article>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-[#30353B] rounded-2xl border border-[#30353B] bg-[#191D21]">
      {faqs.map((f, i) => (
        <details key={i} className="group px-6 py-5" name="faq">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-bold text-white">
            {f.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#30353B] text-[#E63946] transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#A6ADB5]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
