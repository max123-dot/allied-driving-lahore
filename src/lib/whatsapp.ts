import { BUSINESS } from "../config/business";

export function normalizeTelHref(phoneHref: string): string {
  const digits = phoneHref.replace(/^tel:/, "").trim();
  return `tel:${digits}`;
}

export function telHref(phoneHref: string = BUSINESS.phoneHref): string {
  return normalizeTelHref(phoneHref);
}

export function waLink(message: string, whatsappNumber: string = BUSINESS.whatsappNumber): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function generalEnquiry(whatsappNumber?: string): string {
  return waLink(
    "Hello Allied Driving School, I would like to enquire about your available driving courses, current fees, and training schedule.",
    whatsappNumber ?? BUSINESS.whatsappNumber,
  );
}

export function courseEnquiry(courseName: string, whatsappNumber?: string): string {
  return waLink(
    `Hello Allied Driving School, I would like to enquire about "${courseName}". Please share current fees, availability and training schedule.`,
    whatsappNumber ?? BUSINESS.whatsappNumber,
  );
}

export function vehicleEnquiry(vehicleName: string, whatsappNumber?: string): string {
  return waLink(
    `Hello Allied Driving School, I would like to enquire about training on "${vehicleName}". Please share current fees, availability and training schedule.`,
    whatsappNumber ?? BUSINESS.whatsappNumber,
  );
}

export function offerEnquiry(offerTitle: string, item: string, whatsappNumber?: string): string {
  return waLink(
    `Hello Allied Driving School, I would like to ask about your offer "${offerTitle}" for ${item}. Is it still available, and what is the current price?`,
    whatsappNumber ?? BUSINESS.whatsappNumber,
  );
}

export function contactFormEnquiry(
  name: string,
  phone: string,
  interest: string,
  method: string,
  message: string,
  whatsappNumber?: string,
): string {
  const lines = [
    "Hello Allied Driving School,",
    `My name is ${name} (${phone}).`,
    `I am interested in: ${interest}.`,
    `Preferred contact method: ${method}.`,
    message ? `Message: ${message}` : "",
    "Please share current fees and availability.",
  ].filter(Boolean);
  return waLink(lines.join(" "), whatsappNumber ?? BUSINESS.whatsappNumber);
}
