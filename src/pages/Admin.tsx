import { useEffect, useMemo, useState } from "react";
import { isOfferExpired, type Course, type Offer, type Vehicle } from "../config/business";
import { useCms } from "../store/cms";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "allied-admin-123";

type Tab = "overview" | "courses" | "vehicles" | "offers" | "gallery" | "contact" | "enquiries" | "settings";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-[#A6ADB5]">
      {label}
      <span className="mt-1 block font-normal">{children}</span>
    </label>
  );
}
const inputCls = "w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm text-white";

export function Admin() {
  const cms = useCms();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("allied_admin") === "1");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  const activeOffers = useMemo(() => cms.offers.filter((o) => o.active && !isOfferExpired(o)), [cms.offers]);

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-8">
          <h1 className="font-display text-2xl font-black text-white">Admin sign in</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#A6ADB5]">
            This dashboard edits website content on this device (browser storage). It is <strong className="text-white">not</strong> a
            production backend — see setup notes for connecting a real database and server authentication before
            giving access to staff.
          </p>
          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (pw === ADMIN_PASSWORD) {
                sessionStorage.setItem("allied_admin", "1");
                setAuthed(true);
              } else setPwErr("Incorrect password.");
            }}
          >
            <Field label="Admin password">
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} autoComplete="current-password" />
            </Field>
            {pwErr && <p className="text-xs text-[#ff8a93]" role="alert">{pwErr}</p>}
            <button className="w-full rounded-xl bg-[#E63946] py-3 text-sm font-bold text-white">Sign in</button>
            <p className="text-xs text-[#6b7280]">Default (change via VITE_ADMIN_PASSWORD env): allied-admin-123</p>
          </form>
        </div>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: "Courses" },
    { id: "vehicles", label: "Vehicles" },
    { id: "offers", label: "Offers" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
    { id: "enquiries", label: `Enquiries (${cms.enquiries.length})` },
    { id: "settings", label: "Settings" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Admin dashboard</h1>
          <p className="mt-1 text-xs text-[#6b7280]">
            Client-side content manager (localStorage). Not a secure multi-user backend — do not treat it as one.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const blob = new Blob([cms.exportJson()], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "allied-cms-export.json";
              a.click();
            }}
            className="rounded-xl border border-[#30353B] px-4 py-2 text-xs font-bold text-white"
          >
            Export JSON
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("allied_admin");
              setAuthed(false);
            }}
            className="rounded-xl border border-[#30353B] px-4 py-2 text-xs font-bold text-white"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Admin sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-bold ${tab === t.id ? "bg-[#E63946] text-white" : "border border-[#30353B] bg-[#191D21] text-[#A6ADB5]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && <Overview activeOffers={activeOffers.length} />}
        {tab === "courses" && <CoursesTab />}
        {tab === "vehicles" && <VehiclesTab />}
        {tab === "offers" && <OffersTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "contact" && <ContactTab />}
        {tab === "enquiries" && <EnquiriesTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </main>
  );
}

function Overview({ activeOffers }: { activeOffers: number }) {
  const cms = useCms();
  const cards = [
    ["Published courses", String(cms.courses.filter((c) => c.published).length)],
    ["Active offers", String(activeOffers)],
    ["Published vehicles", String(cms.vehicles.filter((v) => v.published).length)],
    ["Enquiries (this device)", String(cms.enquiries.length)],
  ];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
            <p className="font-display text-3xl font-black text-white">{v}</p>
            <p className="mt-1 text-[13px] text-[#A6ADB5]">{k}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-[13px] leading-relaxed text-amber-100/90">
        <p className="font-bold text-amber-200">Data-integrity checklist (owner confirmation still needed)</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>All prices are hidden from the public site until marked confirmed.</li>
          <li>Transmission details are hidden until marked confirmed.</li>
          <li>No testimonials section is published (no verified reviews supplied).</li>
          <li>Announcement bar is OFF by default — enable only for a verified, unexpired offer.</li>
          <li>WhatsApp number is used as supplied; confirm it is WhatsApp-enabled before advertising.</li>
        </ul>
      </div>
    </div>
  );
}

function CoursesTab() {
  const cms = useCms();
  const blank: Course = {
    id: `course_${Date.now()}`, name: "", shortDescription: "", learnerLevel: "Beginner",
    vehicleType: "", transmission: null, transmissionConfirmed: false, lessonDuration: null,
    totalDuration: null, pricePKR: null, priceConfirmed: false, includedServices: [],
    availability: "Enquire", published: false, awaitingConfirmation: true,
  };
  const [draft, setDraft] = useState<Course>(blank);
  const [editing, setEditing] = useState<string | null>(null);

  function save() {
    if (!draft.name.trim()) return alert("Course name is required.");
    cms.upsertCourse({ ...draft });
    setDraft({ ...blank, id: `course_${Date.now()}` });
    setEditing(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
        <h2 className="font-display font-bold text-white">{editing ? "Edit course" : "Add course"}</h2>
        <div className="mt-4 space-y-3">
          <Field label="Course name"><input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Short description"><textarea className={inputCls} rows={2} value={draft.shortDescription} onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Learner level">
              <select className={inputCls} value={draft.learnerLevel ?? "Beginner"} onChange={(e) => setDraft({ ...draft, learnerLevel: e.target.value as Course["learnerLevel"] })}>
                <option>Beginner</option><option>Experienced</option><option>All levels</option>
              </select>
            </Field>
            <Field label="Availability">
              <select className={inputCls} value={draft.availability} onChange={(e) => setDraft({ ...draft, availability: e.target.value as Course["availability"] })}>
                <option>Available</option><option>Limited</option><option>Enquire</option><option>Paused</option>
              </select>
            </Field>
          </div>
          <Field label="Vehicle type"><input className={inputCls} value={draft.vehicleType ?? ""} onChange={(e) => setDraft({ ...draft, vehicleType: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (PKR, blank = on enquiry)">
              <input className={inputCls} inputMode="numeric" value={draft.pricePKR ?? ""} onChange={(e) => setDraft({ ...draft, pricePKR: e.target.value ? Number(e.target.value) : null })} />
            </Field>
            <Field label="Total duration"><input className={inputCls} value={draft.totalDuration ?? ""} onChange={(e) => setDraft({ ...draft, totalDuration: e.target.value || null })} placeholder="e.g. 4 weeks" /></Field>
          </div>
          {[
            ["priceConfirmed", "Price confirmed by owner (publishes price)"],
            ["transmissionConfirmed", "Transmission confirmed (then set below)"],
            ["published", "Published on website"],
          ].map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-[13px] text-white">
              <input type="checkbox" checked={Boolean((draft as any)[k])} onChange={(e) => setDraft({ ...draft, [k]: e.target.checked } as Course)} className="h-4 w-4 accent-[#E63946]" />
              {label}
            </label>
          ))}
          {draft.transmissionConfirmed && (
            <Field label="Transmission">
              <select className={inputCls} value={draft.transmission ?? "Manual"} onChange={(e) => setDraft({ ...draft, transmission: e.target.value as Course["transmission"] })}>
                <option>Manual</option><option>Automatic</option><option>Both</option>
              </select>
            </Field>
          )}
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 rounded-xl bg-[#E63946] py-2.5 text-sm font-bold text-white">Save course</button>
            {editing && <button onClick={() => { setEditing(null); setDraft({ ...blank, id: `course_${Date.now()}` }); }} className="rounded-xl border border-[#30353B] px-4 py-2.5 text-sm text-white">Cancel</button>}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {cms.courses.map((c) => (
          <div key={c.id} className="rounded-2xl border border-[#30353B] bg-[#191D21] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-white">{c.name || "(unnamed)"}</p>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${c.published ? "bg-emerald-500/15 text-emerald-300" : "bg-zinc-500/15 text-zinc-300"}`}>
                {c.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#A6ADB5]">{c.priceConfirmed && c.pricePKR !== null ? `Rs ${c.pricePKR.toLocaleString()}` : "Price on enquiry"} · {c.availability}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => { setDraft({ ...c }); setEditing(c.id); }} className="rounded-lg border border-[#30353B] px-3 py-1.5 text-xs font-bold text-white">Edit</button>
              <button onClick={() => cms.upsertCourse({ ...c, published: !c.published })} className="rounded-lg border border-[#30353B] px-3 py-1.5 text-xs font-bold text-white">{c.published ? "Unpublish" : "Publish"}</button>
              <button onClick={() => { if (confirm("Delete this course?")) cms.removeCourse(c.id); }} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-bold text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VehiclesTab() {
  const cms = useCms();
  const blank: Vehicle = {
    id: `veh_${Date.now()}`, name: "", category: "Training car", transmission: null,
    transmissionConfirmed: false, pricePKR: null, priceConfirmed: false,
    availability: "Enquire", published: false, awaitingConfirmation: true, note: "",
    image: null, imageAlt: "",
  };
  const [draft, setDraft] = useState<Vehicle>(blank);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
        <h2 className="font-display font-bold text-white">{editing ? "Edit vehicle" : "Add vehicle"}</h2>
        <div className="mt-4 space-y-3">
          <Field label="Vehicle name"><input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><input className={inputCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
            <Field label="Availability">
              <select className={inputCls} value={draft.availability} onChange={(e) => setDraft({ ...draft, availability: e.target.value as Vehicle["availability"] })}>
                <option>Available</option><option>Limited</option><option>Enquire</option><option>Paused</option>
              </select>
            </Field>
          </div>
          <Field label="Price (PKR)"><input className={inputCls} inputMode="numeric" value={draft.pricePKR ?? ""} onChange={(e) => setDraft({ ...draft, pricePKR: e.target.value ? Number(e.target.value) : null })} /></Field>
          <Field label="Note"><textarea className={inputCls} rows={2} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></Field>
          <Field label="Photo URL (e.g. /img/fleet-mehran.jpg)"><input className={inputCls} value={draft.image ?? ""} onChange={(e) => setDraft({ ...draft, image: e.target.value || null })} /></Field>
          <Field label="Photo alt text"><input className={inputCls} value={draft.imageAlt} onChange={(e) => setDraft({ ...draft, imageAlt: e.target.value })} /></Field>
          {draft.image && <img src={draft.image} alt={draft.imageAlt} className="aspect-[16/10] w-full rounded-xl border border-[#30353B] object-cover" />}
          {[
            ["priceConfirmed", "Price confirmed (publishes price)"],
            ["transmissionConfirmed", "Transmission confirmed"],
            ["published", "Published"],
          ].map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-[13px] text-white">
              <input type="checkbox" checked={Boolean((draft as any)[k])} onChange={(e) => setDraft({ ...draft, [k]: e.target.checked } as Vehicle)} className="h-4 w-4 accent-[#E63946]" />
              {label}
            </label>
          ))}
          {draft.transmissionConfirmed && (
            <Field label="Transmission"><input className={inputCls} value={draft.transmission ?? ""} onChange={(e) => setDraft({ ...draft, transmission: e.target.value })} placeholder="Manual / Automatic" /></Field>
          )}
          <button
            onClick={() => {
              if (!draft.name.trim()) return alert("Vehicle name is required.");
              cms.upsertVehicle({ ...draft });
              setDraft({ ...blank, id: `veh_${Date.now()}` });
              setEditing(null);
            }}
            className="w-full rounded-xl bg-[#E63946] py-2.5 text-sm font-bold text-white"
          >
            Save vehicle
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {cms.vehicles.map((v) => (
          <div key={v.id} className="rounded-2xl border border-[#30353B] bg-[#191D21] p-4">
            <p className="font-bold text-white">{v.name || "(unnamed)"} <span className="text-xs font-normal text-[#A6ADB5]">· {v.category}</span></p>
            <p className="mt-1 text-xs text-[#A6ADB5]">{v.priceConfirmed && v.pricePKR !== null ? `Rs ${v.pricePKR.toLocaleString()}` : "Price on enquiry"} · {v.availability} · {v.published ? "Published" : "Draft"}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => { setDraft({ ...v }); setEditing(v.id); }} className="rounded-lg border border-[#30353B] px-3 py-1.5 text-xs font-bold text-white">Edit</button>
              <button onClick={() => cms.upsertVehicle({ ...v, published: !v.published })} className="rounded-lg border border-[#30353B] px-3 py-1.5 text-xs font-bold text-white">{v.published ? "Unpublish" : "Publish"}</button>
              <button onClick={() => { if (confirm("Delete this vehicle?")) cms.removeVehicle(v.id); }} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-bold text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OffersTab() {
  const cms = useCms();
  const blank: Offer = {
    id: `offer_${Date.now()}`, title: "", vehicleOrCourse: "", originalPricePKR: null,
    discountedPricePKR: null, pricesConfirmed: false, expiryDate: null, active: false, awaitingConfirmation: true,
  };
  const [draft, setDraft] = useState<Offer>(blank);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
        <h2 className="font-display font-bold text-white">Create / edit offer</h2>
        <div className="mt-4 space-y-3">
          <Field label="Offer title"><input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Vehicle or course"><input className={inputCls} value={draft.vehicleOrCourse} onChange={(e) => setDraft({ ...draft, vehicleOrCourse: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Original price (PKR)"><input className={inputCls} inputMode="numeric" value={draft.originalPricePKR ?? ""} onChange={(e) => setDraft({ ...draft, originalPricePKR: e.target.value ? Number(e.target.value) : null })} /></Field>
            <Field label="Discounted price (PKR)"><input className={inputCls} inputMode="numeric" value={draft.discountedPricePKR ?? ""} onChange={(e) => setDraft({ ...draft, discountedPricePKR: e.target.value ? Number(e.target.value) : null })} /></Field>
          </div>
          <Field label="Expiry date"><input type="date" className={inputCls} value={draft.expiryDate ?? ""} onChange={(e) => setDraft({ ...draft, expiryDate: e.target.value || null })} /></Field>
          {[
            ["pricesConfirmed", "Prices verified (publishes prices; discount auto-calculated)"],
            ["active", "Active promotion"],
          ].map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-[13px] text-white">
              <input type="checkbox" checked={Boolean((draft as any)[k])} onChange={(e) => setDraft({ ...draft, [k]: e.target.checked } as unknown as Offer)} className="h-4 w-4 accent-[#E63946]" />
              {label}
            </label>
          ))}
          <button
            onClick={() => {
              if (!draft.title.trim()) return alert("Offer title is required.");
              cms.upsertOffer({ ...draft });
              setDraft({ ...blank, id: `offer_${Date.now()}` });
            }}
            className="w-full rounded-xl bg-[#E63946] py-2.5 text-sm font-bold text-white"
          >
            Save offer
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {cms.offers.map((o) => (
          <div key={o.id} className="rounded-2xl border border-[#30353B] bg-[#191D21] p-4">
            <p className="font-bold text-white">{o.title || "(untitled)"}</p>
            <p className="mt-1 text-xs text-[#A6ADB5]">
              {o.vehicleOrCourse} · {o.active ? "Active" : "Inactive"} · {o.expiryDate ? (isOfferExpired(o) ? `Expired ${o.expiryDate}` : `Until ${o.expiryDate}`) : "No expiry"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => setDraft({ ...o })} className="rounded-lg border border-[#30353B] px-3 py-1.5 text-xs font-bold text-white">Edit</button>
              <button onClick={() => cms.upsertOffer({ ...o, active: !o.active })} className="rounded-lg border border-[#30353B] px-3 py-1.5 text-xs font-bold text-white">{o.active ? "Deactivate" : "Activate"}</button>
              <button onClick={() => { if (confirm("Delete this offer?")) cms.removeOffer(o.id); }} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-bold text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const cms = useCms();
  const [alt, setAlt] = useState("");
  const [src, setSrc] = useState("");

  function onFile(f: File | undefined) {
    if (!f) return;
    if (!alt.trim()) {
      alert("Please enter alt text first, then choose the file.");
      return;
    }
    if (f.size > 1_500_000) {
      alert("Image is larger than ~1.5MB. Please use a smaller optimized JPG (uploads live in browser storage only).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        cms.setGallery([...cms.gallery, { src: String(reader.result), alt: alt || f.name }]);
      } catch {
        alert("Could not save the image — browser storage is full. Use an image URL instead.");
        return;
      }
      setAlt("");
      setSrc("");
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
      <h2 className="font-display font-bold text-white">Gallery images</h2>
      <p className="mt-1 text-xs text-[#A6ADB5]">Uploads are stored in this browser only (base64). For production, connect object storage + database.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input className={inputCls} placeholder="Alt text (required, descriptive)" value={alt} onChange={(e) => setAlt(e.target.value)} />
        <input className={inputCls} placeholder="Image URL (or upload below)" value={src} onChange={(e) => setSrc(e.target.value)} />
        <button
          onClick={() => {
            if (!alt.trim()) return alert("Alt text is required.");
            if (!src.trim()) return alert("An image URL is required (or upload a file below).");
            cms.setGallery([...cms.gallery, { src: src.trim(), alt: alt.trim() }]);
            setAlt("");
            setSrc("");
          }}
          className="shrink-0 rounded-xl bg-[#E63946] px-4 py-2.5 text-sm font-bold text-white"
        >
          Add
        </button>
      </div>
      <input type="file" accept="image/*" className="mt-3 text-xs text-[#A6ADB5]" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Upload image" />
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cms.gallery.map((g, i) => (
          <div key={i} className="rounded-xl border border-[#30353B] bg-[#101214] p-2">
            {g.src ? <img src={g.src} alt={g.alt} className="h-28 w-full rounded-lg object-cover" loading="lazy" /> : <p className="grid h-28 place-items-center p-2 text-center text-[11px] text-[#6b7280]">{g.alt || "(empty slot)"}</p>}
            <input className={`${inputCls} mt-2 !py-1.5 !text-xs`} value={g.alt} onChange={(e) => { const n = [...cms.gallery]; n[i] = { ...n[i], alt: e.target.value }; cms.setGallery(n); }} aria-label="Edit alt text" />
            <div className="mt-2 flex gap-1">
              <button onClick={() => { if (i > 0) { const n = [...cms.gallery]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; cms.setGallery(n); } }} className="flex-1 rounded-lg border border-[#30353B] py-1 text-xs text-white">←</button>
              <button onClick={() => { if (i < cms.gallery.length - 1) { const n = [...cms.gallery]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; cms.setGallery(n); } }} className="flex-1 rounded-lg border border-[#30353B] py-1 text-xs text-white">→</button>
              <button onClick={() => cms.setGallery(cms.gallery.filter((_, j) => j !== i))} className="flex-1 rounded-lg border border-red-500/40 py-1 text-xs text-red-300">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactTab() {
  const cms = useCms();
  const [c, setC] = useState(cms.contact);
  const [savedTick, setSavedTick] = useState(0);
  useEffect(() => {
    // Refresh the draft when saved contact changes elsewhere (e.g. JSON import).
    setC(cms.contact);
  }, [savedTick]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
      <h2 className="font-display font-bold text-white">Contact information</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Phone display"><input className={inputCls} value={c.phoneDisplay} onChange={(e) => setC({ ...c, phoneDisplay: e.target.value })} /></Field>
        <Field label="Phone link (tel:+... — used for all Call buttons)"><input className={inputCls} value={c.phoneHref} onChange={(e) => setC({ ...c, phoneHref: e.target.value })} /></Field>
        <Field label="WhatsApp number (intl, no +)"><input className={inputCls} value={c.whatsappNumber} onChange={(e) => setC({ ...c, whatsappNumber: e.target.value })} /></Field>
        <Field label="Email"><input className={inputCls} value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></Field>
        <Field label="Maps search query"><input className={inputCls} value={c.mapsQuery} onChange={(e) => setC({ ...c, mapsQuery: e.target.value })} /></Field>
        <Field label="Area note (footer, e.g. DHA Phase 4, Lahore)"><input className={inputCls} value={c.city} onChange={(e) => setC({ ...c, city: e.target.value })} /></Field>
      </div>
      <div className="mt-3"><Field label="Address"><textarea className={inputCls} rows={2} value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} /></Field></div>
      <div className="mt-3"><Field label="Hours note (shown in footer & contact page)"><textarea className={inputCls} rows={2} value={c.hoursNote} onChange={(e) => setC({ ...c, hoursNote: e.target.value })} /></Field></div>
      <div className="mt-3"><Field label="Opening hours (leave blank if unconfirmed)"><input className={inputCls} value={c.openingHours ?? ""} onChange={(e) => setC({ ...c, openingHours: e.target.value || null })} /></Field></div>
      <label className="mt-3 flex items-center gap-2 text-[13px] text-white">
        <input type="checkbox" checked={c.whatsappConfirmed} onChange={(e) => setC({ ...c, whatsappConfirmed: e.target.checked })} className="h-4 w-4 accent-[#E63946]" />
        WhatsApp number verified as WhatsApp-enabled
      </label>
      <button onClick={() => { cms.updateContact(c); setSavedTick((t) => t + 1); alert("Contact information saved on this device."); }} className="mt-4 rounded-xl bg-[#E63946] px-6 py-2.5 text-sm font-bold text-white">
        Save contact info
      </button>
    </div>
  );
}

function EnquiriesTab() {
  const cms = useCms();
  const [status, setStatus] = useState("All");
  const list = cms.enquiries.filter((e) => status === "All" || e.status === status.toLowerCase());
  return (
    <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display font-bold text-white">Enquiries (stored on this device only)</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2 text-xs text-white">
          <option>All</option><option>New</option><option>Contacted</option><option>Resolved</option>
        </select>
      </div>
      {list.length === 0 ? (
        <p className="mt-4 text-sm text-[#A6ADB5]">No enquiries yet. Form submissions on this device will appear here.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {list.map((e) => (
            <div key={e.id} className="rounded-xl border border-[#30353B] bg-[#101214] p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-white">{e.name} <span className="font-normal text-[#A6ADB5]">· {e.phone}</span></p>
                <span className="rounded-full bg-[#1e2329] px-2.5 py-1 text-[11px] font-bold text-[#A6ADB5]">{e.status} · {new Date(e.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-[#A6ADB5]">{e.interest} · via {e.method}</p>
              {e.message && <p className="mt-1 text-white">“{e.message}”</p>}
              <div className="mt-2 flex gap-2">
                {(["new", "contacted", "resolved"] as const).map((s) => (
                  <button key={s} onClick={() => cms.setEnquiryStatus(e.id, s)} className={`rounded-lg border px-3 py-1 text-xs font-bold ${e.status === s ? "border-[#E63946] text-white" : "border-[#30353B] text-[#A6ADB5]"}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const cms = useCms();
  const [imp, setImp] = useState("");
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
        <h2 className="font-display font-bold text-white">Announcement bar</h2>
        <label className="mt-3 flex items-center gap-2 text-sm text-white">
          <input type="checkbox" checked={cms.announcement.enabled} onChange={(e) => cms.setAnnouncement({ ...cms.announcement, enabled: e.target.checked })} className="h-4 w-4 accent-[#E63946]" />
          Show announcement (only for verified, unexpired offers)
        </label>
        <textarea className={`${inputCls} mt-3`} rows={2} value={cms.announcement.text} onChange={(e) => cms.setAnnouncement({ ...cms.announcement, text: e.target.value })} />
        <h2 className="font-display mt-6 font-bold text-white">FAQs</h2>
        <p className="mt-1 text-xs text-[#A6ADB5]">One per line: Question | Answer</p>
        <textarea
          className={`${inputCls} mt-2 font-mono !text-xs`}
          rows={8}
          value={cms.faqs.map((f) => `${f.q} | ${f.a}`).join("\n")}
          onChange={(e) => {
            const faqs = e.target.value.split("\n").filter((l) => l.includes("|")).map((l) => {
              const [q, ...rest] = l.split("|");
              return { q: q.trim(), a: rest.join("|").trim() };
            });
            cms.setFaqs(faqs);
          }}
        />
      </div>
      <div className="rounded-2xl border border-[#30353B] bg-[#191D21] p-6">
        <h2 className="font-display font-bold text-white">Import / reset</h2>
        <textarea className={`${inputCls} mt-3 font-mono !text-xs`} rows={6} placeholder='Paste exported JSON here, then press Import' value={imp} onChange={(e) => setImp(e.target.value)} />
        <div className="mt-3 flex gap-2">
          <button onClick={() => { try { cms.importJson(imp); alert("Imported."); } catch { alert("Invalid JSON."); } }} className="flex-1 rounded-xl bg-[#E63946] py-2.5 text-sm font-bold text-white">Import</button>
          <button onClick={() => { if (confirm("Reset all content to defaults?")) cms.resetAll(); }} className="flex-1 rounded-xl border border-[#30353B] py-2.5 text-sm font-bold text-white">Reset</button>
        </div>
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100/90">
          Production note: this admin stores data in the browser only. For a real deployment, connect a database
          (e.g. Postgres/Supabase/Firebase), move authentication server-side, add rate limiting on the enquiry
          endpoint, and set VITE_ADMIN_PASSWORD + API secrets as server environment variables — never in client code.
        </div>
      </div>
    </div>
  );
}
