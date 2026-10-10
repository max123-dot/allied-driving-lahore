import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCms } from "../store/cms";
import { CourseCard } from "../components/cards";
import { Reveal, SectionHeading } from "../components/ui";
import { courseEnquiry, telHref } from "../lib/whatsapp";
import { formatPKR } from "../config/business";

export function Courses() {
  const { courses } = useCms();
  const [level, setLevel] = useState("All");
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (!c.published) return false;
      if (level !== "All" && c.learnerLevel !== level && c.learnerLevel !== "All levels") return false;
      if (query && !(c.name + c.shortDescription).toLowerCase().includes(query.toLowerCase())) return false;
      if (maxPrice && c.pricePKR !== null && c.pricePKR > Number(maxPrice)) return false;
      return true;
    });
  }, [courses, level, query, maxPrice]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="Driving courses"
          title="Course directory"
          sub="Filter by learner level or search. Prices appear only after owner confirmation — otherwise contact us for current fees."
        />
      </Reveal>
      <Reveal>
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#30353B] bg-[#191D21] p-4 sm:flex-row">
          <label className="flex-1 text-xs font-semibold text-[#A6ADB5]">
            Search
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. beginner, automatic…"
              className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm font-normal text-white placeholder:text-[#6b7280]"
            />
          </label>
          <label className="text-xs font-semibold text-[#A6ADB5]">
            Learner level
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm font-normal text-white sm:w-44"
            >
              <option>All</option>
              <option>Beginner</option>
              <option>Experienced</option>
              <option>All levels</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-[#A6ADB5]">
            Max price (PKR)
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 20000"
              className="mt-1 w-full rounded-xl border border-[#30353B] bg-[#101214] px-3 py-2.5 text-sm font-normal text-white sm:w-40"
            />
          </label>
        </div>
      </Reveal>
      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-[#30353B] bg-[#191D21] p-8 text-center text-sm text-[#A6ADB5]">
          No courses match these filters. Try clearing the search — or contact us for current course details and fees.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i, 5) * 60}>
              <CourseCard course={c} />
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}

export function CourseDetail() {
  const { id } = useParams();
  const { courses, contact } = useCms();
  const course = courses.find((c) => c.id === id && c.published);

  if (!course) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-3xl font-black text-white">Course not found</h1>
        <p className="mt-3 text-sm text-[#A6ADB5]">This course is unavailable or has been unpublished.</p>
        <Link to="/courses" className="mt-6 inline-block rounded-xl bg-[#E63946] px-6 py-3 text-sm font-bold text-white">
          Back to courses
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link to="/courses" className="text-sm font-semibold text-[#E63946] hover:underline">← All courses</Link>
      <h1 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl">{course.name}</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#A6ADB5]">{course.shortDescription}</p>
      <div className="mt-6 grid gap-4 rounded-2xl border border-[#30353B] bg-[#191D21] p-6 sm:grid-cols-2">
        <div className="text-sm">
          <p className="text-[#6b7280]">Learner level</p>
          <p className="font-semibold text-white">{course.learnerLevel ?? "To be confirmed"}</p>
        </div>
        <div className="text-sm">
          <p className="text-[#6b7280]">Vehicle</p>
          <p className="font-semibold text-white">{course.vehicleType ?? "To be confirmed"}</p>
        </div>
        <div className="text-sm">
          <p className="text-[#6b7280]">Transmission</p>
          <p className="font-semibold text-white">
            {course.transmissionConfirmed && course.transmission ? course.transmission : "To be confirmed — please ask"}
          </p>
        </div>
        <div className="text-sm">
          <p className="text-[#6b7280]">Availability</p>
          <p className="font-semibold text-white">{course.availability === "Enquire" ? "Enquire for availability" : course.availability}</p>
        </div>
        {(course.lessonDuration || course.totalDuration) && (
          <>
            {course.lessonDuration && (
              <div className="text-sm">
                <p className="text-[#6b7280]">Lesson duration</p>
                <p className="font-semibold text-white">{course.lessonDuration}</p>
              </div>
            )}
            {course.totalDuration && (
              <div className="text-sm">
                <p className="text-[#6b7280]">Total duration</p>
                <p className="font-semibold text-white">{course.totalDuration}</p>
              </div>
            )}
          </>
        )}
        {course.includedServices.length > 0 && (
          <div className="text-sm sm:col-span-2">
            <p className="text-[#6b7280]">Included</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 font-medium text-white">
              {course.includedServices.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="text-sm sm:col-span-2">
          <p className="text-[#6b7280]">Fee</p>
          {course.priceConfirmed && course.pricePKR !== null ? (
            <p className="font-display text-2xl font-black text-white">{formatPKR(course.pricePKR)}</p>
          ) : (
            <p className="font-semibold text-white">Contact us for current course details and fees.</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href={courseEnquiry(course.name, contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-[#E63946] px-6 py-3.5 text-center text-sm font-bold text-white hover:bg-[#b92330]">
          Enquire about this course on WhatsApp
        </a>
        <a href={telHref(contact.phoneHref)} className="flex-1 rounded-xl border border-[#30353B] px-6 py-3.5 text-center text-sm font-bold text-white hover:border-white">
          Call {contact.phoneDisplay}
        </a>
      </div>
      <p className="mt-4 text-xs text-[#6b7280]">An enquiry is a request for information, not a confirmed booking.</p>
    </main>
  );
}
