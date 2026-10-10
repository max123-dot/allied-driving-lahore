import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../store/cms";
import { generalEnquiry, telHref } from "../lib/whatsapp";
import { Logo } from "./ui";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Driving Courses" },
  { to: "/vehicles", label: "Vehicles & Offers" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

export function AnnouncementBar() {
  const { announcement } = useCms();
  if (!announcement.enabled || !announcement.text.trim()) return null;
  return (
    <div className="bg-[#E63946] px-4 py-2 text-center text-[13px] font-medium text-white" role="status">
      {announcement.text}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { contact } = useCms();
  const tel = telHref(contact.phoneHref);
  const wa = generalEnquiry(contact.whatsappNumber);

  return (
    <header className="sticky top-0 z-40 border-b border-[#30353B]/70 bg-[#101214]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-[#1e2329] text-white" : "text-[#A6ADB5] hover:bg-[#1e2329] hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={tel}
            className="rounded-xl border border-[#30353B] px-4 py-2.5 text-sm font-semibold text-[#F7F8FA] transition-colors hover:border-[#E63946]"
          >
            Call
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(230,57,70,0.35)] transition-colors hover:bg-[#b92330]"
          >
            Enquire on WhatsApp
          </a>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-[#30353B] text-[#F7F8FA] lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>
      {open && (
        <div className="border-t border-[#30353B] bg-[#14171a] px-4 py-4 lg:hidden">
          <ul className="space-y-1" onClick={() => setOpen(false)}>
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`block rounded-xl px-4 py-3 text-[15px] font-medium ${
                    loc.pathname === l.to ? "bg-[#1e2329] text-white" : "text-[#A6ADB5]"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={tel}
              className="rounded-xl border border-[#30353B] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Call the School
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#E63946] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { contact } = useCms();
  const tel = telHref(contact.phoneHref);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`;
  return (
    <footer className="border-t border-[#30353B] bg-[#0c0e10]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-[#A6ADB5]">
            Structured driving instruction in DHA Phase 4, Lahore. Contact us to discuss training options
            and current fees.
          </p>
          <p className="mt-3 text-xs text-[#6b7280]">DHA Phase 4, Lahore</p>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#A6ADB5]">
            <li>
              <a className="hover:text-white" href={tel}>
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
            <li className="leading-relaxed">{contact.address}</li>
            <li>
              <a className="text-[#E63946] hover:underline" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#A6ADB5]">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link className="hover:text-white" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="hover:text-white" to="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/admin">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase">Hours</h3>
          <p className="mt-4 text-sm leading-relaxed text-[#A6ADB5]">{contact.hoursNote}</p>
          {contact.openingHours && <p className="mt-2 text-sm text-white">{contact.openingHours}</p>}
        </div>
      </div>
      <div className="border-t border-[#30353B]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-[#6b7280] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {contact.name} {contact.city}. All rights reserved.</p>
          <p>Prices and availability shown only after owner confirmation.</p>
        </div>
      </div>
    </footer>
  );
}

export function MobileContactBar() {
  const { contact } = useCms();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#30353B] bg-[#14171a]/95 backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-2 gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={telHref(contact.phoneHref)}
          className="rounded-xl border border-[#30353B] py-3 text-center text-sm font-bold text-white"
          aria-label="Call Allied Driving School"
        >
          Call Now
        </a>
        <a
          href={generalEnquiry(contact.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-[#E63946] py-3 text-center text-sm font-bold text-white"
          aria-label="Enquire on WhatsApp"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
