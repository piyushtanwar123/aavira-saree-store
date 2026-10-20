# AAVIRA ESSENTIAL

An elegant, responsive, enquiry-first saree storefront for a fictional luxury brand. Built to stay within a starter website scope: no paid commerce services, complex animations, payment gateway, or merchant dashboard.

## Technology

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 plus reusable custom design styles
- PostgreSQL with Drizzle ORM
- Local campaign images and self-hosted Cormorant Garamond / Jost fonts
- Next.js responsive image optimisation

## Local setup

1. Install dependencies: `npm install`.
2. Create a PostgreSQL database.
3. In `.env`, set `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE`.
4. Optionally set `WHATSAPP_NUMBER=919876543210` using your actual WhatsApp business number, country code included, without the plus sign. This is an example format, not a connected number. Leave unset to show the clearly labelled configuration notice and enquiry form. Rebuild/restart after configuration changes.
5. `drizzle.config.ts` reads the same `DATABASE_URL` from your environment. Never commit your `.env` or production credentials.
6. Run `npx drizzle-kit push` to create the `enquiries` and `subscribers` tables.
7. Run `npm run dev` for local development.
8. For production: `npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, then `npm run build`. Deploy on a Next.js-compatible Node host with database access and start using your host's standard Next.js production command.

## Included functionality

- Homepage with editorial hero, six categories, new arrivals, bestseller selection, promotion, story, newsletter, and footer
- Collection pages, category browsing, name/fabric/colour search, and basic sorting
- Seven illustrative products, individual detail pages, full image and cropped fabric-detail gallery views
- Shopping bag with quantity controls, removal, estimated totals, and complimentary shipping threshold
- Bag and favourites stored on the visitor's device using localStorage
- Accessible search dialog, bag drawer, enquiry form, keyboard navigation, and responsive mobile menu
- Enquiry form: `POST /api/enquiries` validates contact details and product references, calculates catalogue prices on the server, and stores the submission in PostgreSQL
- Newsletter: `POST /api/newsletter` validates and stores unique email addresses (no email delivery)
- Optional WhatsApp click-to-chat: `GET /api/whatsapp` uses the server-only `WHATSAPP_NUMBER` and opens a prefilled message using WhatsApp's official `wa.me` format
- Health check: `GET /api/health`
- Demo shipping, returns, privacy, terms, and care pages

## Editing the shop

- Catalogue, prices, category membership, featured selections, and colours: `src/lib/catalog.ts`
- Brand colours, responsive rules, type, and layout: `src/app/globals.css`
- Homepage: `src/app/page.tsx`
- Header, newsletter, footer: `src/components/chrome.tsx`
- Product and campaign images: `public/images/`
- Database tables: `src/db/schema.ts`

## Important integration boundaries

- This is a fictional demonstration. All campaign and product images are AI-generated; the gallery detail is a crop of the same campaign image, not a separate photograph.
- Products, comparative prices, descriptions, fabric composition, dimensions, shipping rates, and discounts are illustrative. Replace with verified merchant data before selling.
- **No payment collection, live inventory, order placement, tax calculation, shipping labels, delivery tracking, or fulfilment is implemented.** The UI intentionally says “Enquire to order,” not “Pay” or “Order confirmed.”
- Enquiries and subscribers are genuinely persisted, but **no email, SMS, or notification is sent**. Database records must be reviewed by the operator. There is no public admin screen or read endpoint. Use a protected database tool, e.g. `npx drizzle-kit studio`, only on a trusted local machine.
- WhatsApp requires configuration; the default interface clearly says it is not connected. Users must send the prefilled message themselves.
- Contact availability and service hours are demo copy. Configure real business contact information and replace demo policy templates with legal policies before launch.
- Basic server-side validation, same-origin checks, a honeypot for enquiries, and in-memory rate limiting are included. Rate limiting is per Node instance; use shared infrastructure/CAPTCHA if public traffic requires stronger abuse protection.
- Subscriber records are not double opt-in; use a compliant email service with consent management and unsubscribe links before sending newsletters.
- Demo search indexing is disabled in root metadata (`robots: { index: false, follow: false }`). Set your canonical production domain and enable indexing only after replacing illustrative content.
- Add a real retention/deletion workflow, monitoring, backups, HTTPS, production policy/contact information, and secure database credentials before accepting real customer data.

## Validation

```sh
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

The sandbox additionally uses the managed `build_and_start` tool to bootstrap PostgreSQL, build, start, and verify `/api/health`. Apply schema changes after that environment has been bootstrapped, then rerun all validation.

### Browser tests

With the application running, run `npx playwright install --with-deps chromium` once, then `npx playwright test --workers=1`. Set `TEST_BASE_URL` to test another deployment. The four included tests cover desktop rendering, category links, gallery views, bag quantities and reload persistence, real enquiry submission, empty-bag removal, search, favourites, price sorting, mobile navigation, and horizontal overflow. They create test enquiry records in the connected database; use a non-production database. Visual captures are written to `/tmp/aavira-desktop.png` and `/tmp/aavira-mobile.png`.

Font licences are included alongside the font files under `public/fonts/`.
