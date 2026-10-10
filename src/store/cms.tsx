import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { IMG } from "../assets/fleet";
import {
  ANNOUNCEMENT_DEFAULT,
  BUSINESS,
  COURSES_DEFAULT,
  FAQS_DEFAULT,
  OFFERS_DEFAULT,
  VEHICLES_DEFAULT,
  type Course,
  type Faq,
  type Offer,
  type Vehicle,
} from "../config/business";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  interest: string;
  method: string;
  message: string;
  status: "new" | "contacted" | "resolved";
  createdAt: string;
}

interface CmsState {
  announcement: { enabled: boolean; text: string };
  courses: Course[];
  vehicles: Vehicle[];
  offers: Offer[];
  faqs: Faq[];
  gallery: { src: string; alt: string }[];
  contact: typeof BUSINESS;
  enquiries: Enquiry[];
  setAnnouncement: (a: { enabled: boolean; text: string }) => void;
  upsertCourse: (c: Course) => void;
  removeCourse: (id: string) => void;
  upsertVehicle: (v: Vehicle) => void;
  removeVehicle: (id: string) => void;
  upsertOffer: (o: Offer) => void;
  removeOffer: (id: string) => void;
  setFaqs: (f: Faq[]) => void;
  setGallery: (g: { src: string; alt: string }[]) => void;
  updateContact: (patch: Partial<typeof BUSINESS>) => void;
  addEnquiry: (e: Omit<Enquiry, "id" | "createdAt" | "status">) => Enquiry;
  setEnquiryStatus: (id: string, s: Enquiry["status"]) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (json: string) => void;
}

const KEY = "allied_cms_v2";
const ENQ_KEY = "allied_enquiries_v1";

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota exceeded (e.g. base64 gallery uploads) — keep the app running
    // on in-memory state rather than crashing.
  }
}

function load<T>(key: string): Partial<T> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<T>;
  } catch {
    return {};
  }
}

const Ctx = createContext<CmsState | null>(null);

const DEFAULT_GALLERY = [
  { src: IMG.heroFortuner, alt: "Allied Driving School training SUV with Lahore skyline at sunset" },
  { src: IMG.fleetMehran, alt: "White Suzuki Mehran with Allied Driving School livery" },
  { src: IMG.fleetCity, alt: "White Honda City with Allied Driving School livery" },
  { src: IMG.fleetCorolla, alt: "White Toyota Corolla Altis with Allied Driving School livery" },
  { src: IMG.fleetScooty, alt: "Red scooty with Allied Driving School livery" },
];

export function CmsProvider({ children }: { children: ReactNode }) {
  const saved = useMemo(() => load<any>(KEY), []);
  const [announcement, setAnnouncementState] = useState(
    saved.announcement ?? ANNOUNCEMENT_DEFAULT,
  );
  const [courses, setCourses] = useState<Course[]>(saved.courses ?? COURSES_DEFAULT);
  const [vehicles, setVehicles] = useState<Vehicle[]>(saved.vehicles ?? VEHICLES_DEFAULT);
  const [offers, setOffers] = useState<Offer[]>(saved.offers ?? OFFERS_DEFAULT);
  const [faqs, setFaqsState] = useState<Faq[]>(saved.faqs ?? FAQS_DEFAULT);
  const [gallery, setGalleryState] = useState<{ src: string; alt: string }[]>(
    saved.gallery ?? DEFAULT_GALLERY,
  );
  const [contact, setContact] = useState<typeof BUSINESS>(saved.contact ?? BUSINESS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const raw = localStorage.getItem(ENQ_KEY);
      return raw ? (JSON.parse(raw) as Enquiry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    safeSet(
      KEY,
      JSON.stringify({ announcement, courses, vehicles, offers, faqs, gallery, contact }),
    );
  }, [announcement, courses, vehicles, offers, faqs, gallery, contact]);

  useEffect(() => {
    safeSet(ENQ_KEY, JSON.stringify(enquiries));
  }, [enquiries]);

  const setAnnouncement = useCallback((a: { enabled: boolean; text: string }) => {
    setAnnouncementState(a);
  }, []);
  const upsertCourse = useCallback((c: Course) => {
    setCourses((prev) => {
      const i = prev.findIndex((x) => x.id === c.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = c;
        return next;
      }
      return [...prev, c];
    });
  }, []);
  const removeCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((x) => x.id !== id));
  }, []);
  const upsertVehicle = useCallback((v: Vehicle) => {
    setVehicles((prev) => {
      const i = prev.findIndex((x) => x.id === v.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = v;
        return next;
      }
      return [...prev, v];
    });
  }, []);
  const removeVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((x) => x.id !== id));
  }, []);
  const upsertOffer = useCallback((o: Offer) => {
    setOffers((prev) => {
      const i = prev.findIndex((x) => x.id === o.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = o;
        return next;
      }
      return [...prev, o];
    });
  }, []);
  const removeOffer = useCallback((id: string) => {
    setOffers((prev) => prev.filter((x) => x.id !== id));
  }, []);
  const setFaqs = useCallback((f: Faq[]) => setFaqsState(f), []);
  const setGallery = useCallback((g: { src: string; alt: string }[]) => setGalleryState(g), []);
  const updateContact = useCallback((patch: Partial<typeof BUSINESS>) => {
    setContact((prev) => ({ ...prev, ...patch }));
  }, []);
  const addEnquiry = useCallback((e: Omit<Enquiry, "id" | "createdAt" | "status">) => {
    const full: Enquiry = {
      ...e,
      id: `enq_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    setEnquiries((prev) => [full, ...prev]);
    return full;
  }, []);
  const setEnquiryStatus = useCallback((id: string, s: Enquiry["status"]) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: s } : e)));
  }, []);
  const resetAll = useCallback(() => {
    setAnnouncementState(ANNOUNCEMENT_DEFAULT);
    setCourses(COURSES_DEFAULT);
    setVehicles(VEHICLES_DEFAULT);
    setOffers(OFFERS_DEFAULT);
    setFaqsState(FAQS_DEFAULT);
    setGalleryState(DEFAULT_GALLERY);
    setContact(BUSINESS);
    localStorage.removeItem(KEY);
  }, []);
  const exportJson = useCallback(() => {
    return JSON.stringify({ announcement, courses, vehicles, offers, faqs, gallery, contact }, null, 2);
  }, [announcement, courses, vehicles, offers, faqs, gallery, contact]);
  const importJson = useCallback((json: string) => {
    const data = JSON.parse(json);
    if (data.announcement) setAnnouncementState(data.announcement);
    if (data.courses) setCourses(data.courses);
    if (data.vehicles) setVehicles(data.vehicles);
    if (data.offers) setOffers(data.offers);
    if (data.faqs) setFaqsState(data.faqs);
    if (data.gallery) setGalleryState(data.gallery);
    if (data.contact) setContact(data.contact);
  }, []);

  const value: CmsState = {
    announcement,
    courses,
    vehicles,
    offers,
    faqs,
    gallery,
    contact,
    enquiries,
    setAnnouncement,
    upsertCourse,
    removeCourse,
    upsertVehicle,
    removeVehicle,
    upsertOffer,
    removeOffer,
    setFaqs,
    setGallery,
    updateContact,
    addEnquiry,
    setEnquiryStatus,
    resetAll,
    exportJson,
    importJson,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCms(): CmsState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCms must be used inside CmsProvider");
  return ctx;
}
