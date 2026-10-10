import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { contactFormEnquiry, telHref } from "../lib/whatsapp";
import { useCms } from "../store/cms";
import { Reveal, SectionHeading } from "../components/ui";

export function Contact() {
  const { contact, courses, vehicles, addEnquiry } = useCms();
  const interests = useMemo(() => {
    const names = [
      ...courses.filter((c) => c.published).map((c) => c.name),
      ...vehicles.filter((v) => v.published).map((v) => v.name),
    ];
    const unique = Array.from(new Set(names));
    return unique.length > 0 ? [...unique, "General enquiry"] : ["General enquiry"];
  }, [courses, vehicles]);
  const [form, setForm] = useState({ name: "", phone: "", interest: "", method: "WhatsApp", message: "", consent: false });
  const effectiveInterest = form.interest || interests[0] || "General enquiry";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const tel = telHref(contact.phoneHref);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapsQuery)}&output=embed`;

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^[+\d][\d\s\-()]{6,17}$/.test(form.phone.trim())) e.phone = "Please enter a valid phone number.";
    if (!effectiveInterest) e.interest = "Please choose a course or vehicle.";
    if (form.message.trim().length > 500) e.message = "Please keep your message under 500 characters.";
    if (!form.consent) e.consent = "Please confirm you agree to be contacted.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    // No backend email service is configured: save locally for the admin
    // enquiries list AND hand off to WhatsApp so the school actually receives it.
    addEnquiry({ name: form.name.trim(), phone: form.phone.trim(), interest: effectiveInterest, method: form.method, message: form.message.trim().slice(0, 500) });
    setSaved(true);
  }

  const waHref = contactFormEnquiry(form.name || "Visitor", form.phone || "—", effectiveInterest, form.method, form.message.trim().slice(0, 500), contact.whatsappNumber);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <SectionHeading kicker="Contact" title="Talk to the school" sub="Phone and WhatsApp are the fastest channels. The form below prepares a WhatsApp message — nothing is sent until you press Send." />
      </Reveal>
      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Reveal>
          <div className="space-y-3 lg:col-span-2">
            <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
              <h2 className="font-display font-bold text-white">Direct contact</h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A6ADB5]">
                <li>Phone: <a className="font-semibold text-white hover:underline" href={tel}>{contact.phoneDisplay}</a></li>
                <li>Email: <a className="font-semibold text-white hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a></li>
                <li className="leading-relaxed">{contact.address}</li>
                <li className="text-xs">{contact.hoursNote}</li>
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={tel} className="rounded-xl border border-[#30353B] py-2.5 text-center text-sm font-bold text-white">Call</a>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#E63946] py-2.5 text-center text-sm font-bold text-white">WhatsApp</a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#30353B] bg-[#191D21]">
              <iframe title="Map — Allied Driving School area, DHA Phase 4 Lahore" src={embedUrl} className="h-64 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="p-4">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#E63946] hover:underline">
                  Open directions in Google Maps →
                </a>
                <p className="mt-1 text-xs text-[#6b7280]">Map shows the Divine One Plaza / Bhatta Chowk area. Call before visiting to confirm the office location.</p>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6 sm:p-8 lg:col-span-3">
            <h2 className="font-display text-xl font-bold text-white">Enquiry form</h2>
            <p className="mt-1 text-[13px] text-[#A6ADB5]">
              No email service is configured on this website, so this form does <strong className="text-white">not</strong> send anything by itself. After saving, use the WhatsApp button to actually deliver your enquiry.
            </p>
            {saved ? (
              <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5" role="status">
                <p className="font-bold text-emerald-300">Your enquiry details are ready.</p>
                <p className="mt-1 text-sm text-emerald-100/80">
                  They have been saved on this device for the school's admin list. To make sure the school receives them, please press the button below to open WhatsApp — you can edit the message before sending.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-[#25D366] px-5 py-3 text-center text-sm font-bold text-[#062b16]">
                    Send via WhatsApp now
                  </a>
                  <button onClick={() => setSaved(false)} className="rounded-xl border border-[#30353B] px-5 py-3 text-sm font-bold text-white">
                    Edit details
                  </button>
                </div>
              </div>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
                <div>
                  <label htmlFor="cf-name" className="text-[13px] font-semibold text-white">Full name *</label>
                  <input id="cf-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm text-white" autoComplete="name" />
                  {errors.name && <p className="mt-1 text-xs text-[#ff8a93]" role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="cf-phone" className="text-[13px] font-semibold text-white">Phone number *</label>
                  <input id="cf-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm text-white" autoComplete="tel" placeholder="03xx xxxxxxx" />
                  {errors.phone && <p className="mt-1 text-xs text-[#ff8a93]" role="alert">{errors.phone}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cf-interest" className="text-[13px] font-semibold text-white">Preferred course or vehicle *</label>
                    <select id="cf-interest" value={effectiveInterest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm text-white">
                      {interests.map((i) => <option key={i}>{i}</option>)}
                    </select>
                    {errors.interest && <p className="mt-1 text-xs text-[#ff8a93]" role="alert">{errors.interest}</p>}
                  </div>
                  <div>
                    <label htmlFor="cf-method" className="text-[13px] font-semibold text-white">Preferred contact method *</label>
                    <select id="cf-method" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm text-white">
                      <option>WhatsApp</option>
                      <option>Phone call</option>
                      <option>Email</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="cf-msg" className="text-[13px] font-semibold text-white">Message (optional, max 500 characters)</label>
                  <textarea id="cf-msg" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} maxLength={500} className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm text-white" placeholder="Your experience level, preferred timing, questions…" />
                  {errors.message && <p className="mt-1 text-xs text-[#ff8a93]" role="alert">{errors.message}</p>}
                </div>
                <div className="flex items-start gap-3">
                  <input id="cf-consent" type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 h-4 w-4 accent-[#E63946]" />
                  <label htmlFor="cf-consent" className="text-[13px] text-[#A6ADB5]">I agree that the school may contact me about my enquiry. *</label>
                </div>
                {errors.consent && <p className="text-xs text-[#ff8a93]" role="alert">{errors.consent}</p>}
                <button type="submit" className="btn-shine w-full rounded-xl bg-[#E63946] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#b92330]">
                  Save enquiry & continue to WhatsApp
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
}

export function Privacy() {
  const { contact } = useCms();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-black text-white">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#A6ADB5]">
        <p>Allied Driving School Lahore operates this website to share course information and receive enquiries by phone, WhatsApp and the enquiry form.</p>
        <p><strong className="text-white">What we collect.</strong> If you use the enquiry form, the details you enter (name, phone number, interest, message) are stored in this browser's local storage so the school's admin view on the same device can review them. No email or server is configured, so nothing is transmitted until you choose to press a WhatsApp or call button.</p>
        <p><strong className="text-white">WhatsApp & phone.</strong> When you tap a WhatsApp button, your message is opened in WhatsApp and handled under WhatsApp's own privacy policy. When you call, standard call records apply.</p>
        <p><strong className="text-white">No tracking claims.</strong> This website does not claim analytics beyond what the owner configures at deployment. Do not enter sensitive identity or payment details in the enquiry form — fees and payments are confirmed directly with the school.</p>
        <p><strong className="text-white">Contact.</strong> Questions about your data: call {contact.phoneDisplay} or email {contact.email}.</p>
      </div>
    </main>
  );
}

export function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-4xl font-black text-white">Page not found</h1>
      <p className="mt-3 text-sm text-[#A6ADB5]">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-[#E63946] px-6 py-3 text-sm font-bold text-white">Back to home</Link>
    </main>
  );
}
