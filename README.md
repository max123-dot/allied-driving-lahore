# Allied Driving School Lahore — Website

**Live:** https://max123-dot.github.io/allied-driving-lahore/

Premium automotive-style business website (React 19 + TypeScript + Tailwind CSS v4 + React Router).
All business data lives in **`src/config/business.ts`** — never hardcode phone numbers, prices or
addresses in components.

## Quick start

```bash
npm install
cp .env.example .env        # optional: set VITE_ADMIN_PASSWORD
npm run dev                 # http://localhost:5173
npm run build               # production build -> dist/
npm run preview             # preview the production build
```

## Project structure

```
src/config/business.ts   Central business data: contact, courses, vehicles, offers, FAQs
src/store/cms.tsx        Admin-editable overlay (localStorage) + enquiries store
src/lib/whatsapp.ts      wa.me link builders (intl number 923278000778, encoded text)
src/components/         layout (nav/footer/mobile bar), ui (Reveal, VehicleArt), cards
src/pages/               Home, About, Courses, CourseDetail, Vehicles, Faqs, Contact, Privacy, Admin, 404
public/robots.txt        Disallows /admin, points at sitemap
public/sitemap.xml       Update domain before launch
```

## Deploying (GitHub Pages)

- `main` holds the source. The live site is served from the `gh-pages` branch
  (static `dist/` output, including `404.html` so client-side routes work on refresh).
- Production builds use `VITE_BASE=/allied-driving-lahore/` (see `vite.config.ts` and
  the `basename` in `src/App.tsx`). The deploy workflow lives in
  `.github/workflows/deploy.yml` — note it is currently **not** pushed to the repo
  because this machine's token lacks the `workflow` scope, so publishing is done by
  pushing `dist/` to `gh-pages` (see `/tmp/opencode/deploy_pages.py`).
- To set a custom admin password in a build: `VITE_ADMIN_PASSWORD=... npm run build`.
  The `/admin` gate is client-side only — it deters casual visitors, not attackers.

## Admin dashboard (`/admin`)

- Password gate: `VITE_ADMIN_PASSWORD` (default `allied-admin-123`). Client-side only.
- Tabs: Overview | Courses | Vehicles | Offers | Gallery | Contact | Enquiries | Settings.
- Edits persist to `localStorage` (`allied_cms_v2`, `allied_enquiries_v1`) on the same device/browser.
- Export/Import JSON for backup or moving content between devices.
- **Honest limitation:** this is NOT a production backend. Before staff use, connect a real
  database + server-side auth (e.g. Supabase/Postgres/Firebase), move secrets server-side,
  add rate limiting on the enquiry endpoint, and set proper role-based access.

## Enquiry workflow (honest by design)

No email service is configured, so the contact form **never claims submission succeeded**.
It validates fields, saves a copy to the on-device admin enquiries list, then shows a
"Send via WhatsApp now" button that opens a prefilled `wa.me` message the visitor can edit
before sending. Online enquiries are labelled as requests, not confirmed bookings.

## Before production launch

1. Confirm official domain; replace `https://www.allieddrivingschool.example` in
   `index.html`, `public/robots.txt`, `public/sitemap.xml`, `src/config/business.ts`.
2. Verify the WhatsApp number is WhatsApp-enabled, then set `whatsappConfirmed: true`.
3. Approve real prices / durations / transmission / hours; mark confirmed in Admin so they publish.
4. Fleet photos are bundled in `src/assets/img/` (Mehran, City, Corolla, scooty + Lahore-sunset
   hero, all with Allied livery) and referenced via `src/assets/fleet.ts` so builds emit
   base-aware hashed URLs. The unbranded Mitsubishi shot supplied was NOT added to the
   fleet — only branded vehicles are presented as the school's. If more photos arrive,
   drop optimized JPGs into `src/assets/img/`, export them from `src/assets/fleet.ts`,
   and set the URL in Admin → Vehicles/Gallery.
5. Replace the client-side admin with a real backend + server auth (see above).
6. `npm run build` must pass; test all nav, tel:, wa.me, form, filters, offer expiry,
   320–430px mobile, and the mobile Call/WhatsApp bar overlap.

## Business information still requiring owner confirmation

- [ ] Official website domain (canonical URLs, sitemap, structured data)
- [ ] WhatsApp-enabled status of +92 327 8000778
- [ ] Final course names, lesson counts, durations, fees
- [ ] Per-vehicle availability + manual/automatic confirmation
- [ ] Pickup & drop-off availability and areas
- [ ] Female instructor availability (not claimed anywhere)
- [ ] Licence assistance offered or not
- [ ] Opening hours
- [ ] Accepted payment methods
- [ ] Current/approved promotions, prices and expiry dates
- [ ] Real vehicle + premises photographs
- [ ] Genuine testimonials (none published — section intentionally omitted)
- [ ] Social media links (none published — none confirmed)
- [ ] Instructor qualifications / certifications (nothing claimed)
