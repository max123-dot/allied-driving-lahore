import { IMG } from "../assets/fleet";

/**
 * CENTRAL BUSINESS CONFIGURATION
 * ------------------------------
 * Every public phone number, address, price, course, vehicle, offer and FAQ
 * is defined here. Components must import from this file — never hardcode
 * business information elsewhere.
 *
 * PRICING / AVAILABILITY STATUS: all prices below are marked
 * `awaitingConfirmation: true` until the owner approves final values.
 * The UI hides unconfirmed detail fields and shows a neutral
 * "Contact us for current fees" message instead.
 */

export interface Course {
  id: string;
  name: string;
  shortDescription: string;
  learnerLevel: "Beginner" | "Experienced" | "All levels" | null;
  vehicleType: string | null;
  transmission: "Manual" | "Automatic" | "Both" | null;
  transmissionConfirmed: boolean;
  lessonDuration: string | null;
  totalDuration: string | null;
  pricePKR: number | null;
  priceConfirmed: boolean;
  includedServices: string[];
  availability: "Available" | "Limited" | "Enquire" | "Paused";
  published: boolean;
  awaitingConfirmation: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  transmission: string | null;
  transmissionConfirmed: boolean;
  pricePKR: number | null;
  priceConfirmed: boolean;
  availability: "Available" | "Limited" | "Enquire" | "Paused";
  published: boolean;
  awaitingConfirmation: boolean;
  note: string;
  image: string | null;
  imageAlt: string;
}

export interface Offer {
  id: string;
  title: string;
  vehicleOrCourse: string;
  originalPricePKR: number | null;
  discountedPricePKR: number | null;
  pricesConfirmed: boolean;
  expiryDate: string | null; // ISO yyyy-mm-dd
  active: boolean;
  awaitingConfirmation: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

export const BUSINESS = {
  name: "Allied Driving School",
  city: "Lahore",
  tagline: "Learn to Drive with Confidence.",
  phoneDisplay: "+92 327 8000778",
  phoneHref: "tel:+923278000778",
  whatsappNumber: "923278000778", // intl format, no +, no spaces
  whatsappConfirmed: false, // set true only after owner confirms WA-enabled
  email: "Abuhurairagondal212@gmail.com",
  address:
    "Office #FF5, Second Floor, Divine One Plaza, Bhatta Chowk, Ghazi Road, Sector DD, DHA Phase 4, Lahore, Punjab, Pakistan, 54000.",
  mapsQuery: "Divine One Plaza Bhatta Chowk Ghazi Road DHA Phase 4 Lahore",
  currency: "PKR",
  hoursNote: "Opening hours to be confirmed — please call or WhatsApp before visiting.",
  openingHours: null as string | null,
  socials: [] as { label: string; href: string }[],
  canonicalDomain: "https://max123-dot.github.io/allied-driving-lahore",
};

export const ANNOUNCEMENT_DEFAULT = {
  enabled: false,
  text: "Admissions open — contact us on WhatsApp for current course fees and training times.",
};

export const COURSES_DEFAULT: Course[] = [
  {
    id: "beginner-car",
    name: "Beginner Car Training",
    shortDescription:
      "Foundational driving instruction for first-time learners. Vehicle and schedule confirmed at enquiry.",
    learnerLevel: "Beginner",
    vehicleType: "Training car (to be confirmed)",
    transmission: null,
    transmissionConfirmed: false,
    lessonDuration: null,
    totalDuration: null,
    pricePKR: null,
    priceConfirmed: false,
    includedServices: [],
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
  },
  {
    id: "refresher-car",
    name: "Refresher / Experienced Driver Training",
    shortDescription:
      "Practice sessions for licence holders or drivers returning after a break. Details confirmed on call.",
    learnerLevel: "Experienced",
    vehicleType: "Training car (to be confirmed)",
    transmission: null,
    transmissionConfirmed: false,
    lessonDuration: null,
    totalDuration: null,
    pricePKR: null,
    priceConfirmed: false,
    includedServices: [],
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
  },
  {
    id: "automatic-city",
    name: "Automatic Car Training",
    shortDescription:
      "Training option linked to the Honda City automatic category, subject to vehicle availability.",
    learnerLevel: "All levels",
    vehicleType: "Honda City automatic",
    transmission: "Automatic",
    transmissionConfirmed: false,
    lessonDuration: null,
    totalDuration: null,
    pricePKR: null,
    priceConfirmed: false,
    includedServices: [],
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
  },
  {
    id: "scooty-moto",
    name: "Scooty / Motorcycle Guidance",
    shortDescription:
      "Two-wheeler familiarisation, subject to trainer and vehicle availability. Contact for details.",
    learnerLevel: "All levels",
    vehicleType: "Scooty / motorcycle",
    transmission: null,
    transmissionConfirmed: false,
    lessonDuration: null,
    totalDuration: null,
    pricePKR: null,
    priceConfirmed: false,
    includedServices: [],
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
  },
];

export const HERO_IMAGE = {
  src: IMG.heroFortuner,
  alt: "Allied Driving School Toyota Fortuner training vehicle with Lahore skyline, Badshahi Mosque and Minar-e-Pakistan at sunset",
};

export const VEHICLES_DEFAULT: Vehicle[] = [
  {
    id: "mehran",
    name: "Suzuki Mehran",
    category: "Training car",
    transmission: null,
    transmissionConfirmed: false,
    pricePKR: null,
    priceConfirmed: false,
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
    note: "Availability and transmission to be confirmed by the school.",
    image: IMG.fleetMehran,
    imageAlt: "White Suzuki Mehran with Allied Driving School red and black livery",
  },
  {
    id: "city-auto",
    name: "Honda City Automatic",
    category: "Training car",
    transmission: "Automatic",
    transmissionConfirmed: false,
    pricePKR: null,
    priceConfirmed: false,
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
    note: "Listed as automatic in supplied material — awaiting owner confirmation.",
    image: IMG.fleetCity,
    imageAlt: "White Honda City with Allied Driving School red and black livery",
  },
  {
    id: "corolla-manual",
    name: "Toyota Corolla Altis Manual",
    category: "Training car",
    transmission: "Manual",
    transmissionConfirmed: false,
    pricePKR: null,
    priceConfirmed: false,
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
    note: "Listed as manual in supplied material — awaiting owner confirmation.",
    image: IMG.fleetCorolla,
    imageAlt: "White Toyota Corolla Altis with Allied Driving School red and black livery",
  },
  {
    id: "scooty",
    name: "Scooty / Motorcycle",
    category: "Two-wheeler",
    transmission: null,
    transmissionConfirmed: false,
    pricePKR: null,
    priceConfirmed: false,
    availability: "Enquire",
    published: true,
    awaitingConfirmation: true,
    note: "Two-wheeler training subject to confirmation.",
    image: IMG.fleetScooty,
    imageAlt: "Red scooty with Allied Driving School livery",
  },
];

export const OFFERS_DEFAULT: Offer[] = [
  {
    id: "welcome-offer",
    title: "Admission Offer",
    vehicleOrCourse: "Selected training cars",
    originalPricePKR: null,
    discountedPricePKR: null,
    pricesConfirmed: false,
    expiryDate: null,
    active: false,
    awaitingConfirmation: true,
  },
];

export const FAQS_DEFAULT: Faq[] = [
  {
    q: "How can I enquire about admissions?",
    a: "Call +92 327 8000778 or use any Enquire on WhatsApp button on this website. Tell us which course or vehicle you are interested in and we will guide you on fees, availability and next steps. An online enquiry is not a confirmed booking until the school confirms it.",
  },
  {
    q: "What vehicles are available for training?",
    a: "The categories shared with us include Suzuki Mehran, Honda City automatic, Toyota Corolla Altis manual and scooty / motorcycle training. Availability changes, so please confirm the current training vehicle before visiting.",
  },
  {
    q: "Are manual and automatic options available?",
    a: "Both options were mentioned in the supplied material but are awaiting owner confirmation. Please ask on WhatsApp which transmission is currently available for your preferred vehicle.",
  },
  {
    q: "How much does a driving course cost?",
    a: "Fees are currently awaiting owner confirmation and are not published on this website. Contact us for current course details and fees — we will confirm the exact price before you commit.",
  },
  {
    q: "How long does training take?",
    a: "Course length and lesson duration are not yet confirmed. Contact the school to discuss a schedule that suits your experience level.",
  },
  {
    q: "What are the available training times?",
    a: "Training times are arranged directly with the school and are not yet published. Call or WhatsApp to check current slots.",
  },
  {
    q: "Is pickup and drop-off available?",
    a: "This has not been confirmed. Please ask the school directly whether pickup and drop-off can be arranged for your area.",
  },
  {
    q: "How can I find the school?",
    a: "Our office is at Office #FF5, Second Floor, Divine One Plaza, Bhatta Chowk, Ghazi Road, Sector DD, DHA Phase 4, Lahore. Use the map on the Contact page for directions, and call before visiting.",
  },
  {
    q: "What are the payment options?",
    a: "Payment methods are confirmed at the time of admission. Please ask about accepted payment options when you enquire.",
  },
  {
    q: "Can I ask about current promotions?",
    a: "Yes. Any verified active offer appears in the Special Offers section. If no offer is shown, there is no confirmed promotion running — ask us on WhatsApp and we will tell you about current admissions.",
  },
];

export function formatPKR(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "Price on enquiry";
  return "Rs " + value.toLocaleString("en-PK");
}

export function offerDiscountPercent(o: Offer): number | null {
  if (
    o.originalPricePKR === null ||
    o.discountedPricePKR === null ||
    o.originalPricePKR <= 0 ||
    o.discountedPricePKR >= o.originalPricePKR
  )
    return null;
  return Math.round(
    ((o.originalPricePKR - o.discountedPricePKR) / o.originalPricePKR) * 100,
  );
}

export function isOfferExpired(o: Offer, now = new Date()): boolean {
  if (!o.expiryDate) return false;
  const end = new Date(o.expiryDate + "T23:59:59");
  return end.getTime() < now.getTime();
}
