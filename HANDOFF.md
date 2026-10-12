# Handoff: WE Digital Studio cold outreach — finish batch 1

Run this in a session started with **full permissions** (bypass / "allow all"). Do not ask permission questions. Run to completion, then report.

## State when handed off (2026-09-17)
- 388 prospects sourced and scored. Full sheet: `WE-outreach-batch1-scored.csv` (sent to Josh in chat; also in the previous session's scratchpad).
- 34 prospect tasks were mistakenly created in the **Grow Organic Baby** ClickUp workspace (id 90141342859, shared with Rodney). **All 34 are now deleted.**
- Still in Grow Organic and must be removed: an empty list **"Outreach Pipeline"** (list id 901421180075, space "Project Board" id 90146076420) and a doc **"Outreach Plan — WE Digital Studio"** (doc id 2kydff4b-234, https://app.clickup.com/90141342859/docs/2kydff4b-234).
- The ClickUp connector is authorized only for Grow Organic, and it cannot delete lists or docs. Everything in **WE Creative** (workspace id 90141342871, space "Space" id 90146072879, list "List" id 901417295489, members Josh + Matt Miller) must be done by driving the browser with **reduck** (paired Chromium "b00610ce-8e1b-4b9d-8265-b8ac67cec3b7", logged into ClickUp as josh@wecreativeagency.com). Use `start_session` + `exec_code`, screenshot/peek to find controls. Sessions expire after 15 min idle and there is a 3-session cap; stop sessions when done.
- Gmail drafts already created in josh@wecreativeagency.com → Drafts: Indigo Branding, Ludlow Kingsley, Chase Design Group, Lukasz Design. Do not duplicate those four.

## Josh's decisions
- Cold outreach only (no warm re-engagement).
- ClickUp: **one task for the whole pipeline**, not one per prospect. On the **WE Creative** board only.
- Pricing to quote: website from **$2,500**, ecommerce from **$3,500**, retainer minimum **$1,500/mo**, **15% referral** to design studios (or white-label under their name).
- Drafts only. Never send.

## Tasks
1. **Grow Organic cleanup (browser):** delete list 901421180075 and doc 2kydff4b-234. Verify both are gone.
2. **WE Creative (browser):**
   a. Create doc "Outreach Plan — WE Digital Studio" in space 90146072879 with the plan below.
   b. Create ONE task in list 901417295489 named **"Cold outreach pipeline — batch 1 (34 prospects)"**, priority high, description = the prospect list below as checklists grouped by track, with the pricing line at top and a note that drafts are in Gmail.
3. **Gmail drafts (connector `create_draft`, from josh@wecreativeagency.com):** one per remaining prospect with an email (20 drafts). Voice: short, plain, one specific observation about their site, one ask, close with "Thanks! :)" then "Josh Fishman / WE Digital Studio / 310 897 8412". Link https://wedigital.studio (local track: https://wedigital.studio/one-day). Subject = company name + a few words.
   - Studios (track A): partner pitch. We build Shopify/web and run search, paid, email. Proof: Stoned Immaculate 3x revenue in six months; 11 Honoré idea → exit. Offer 15% referral or white-label. Sites from $2,500, ecommerce from $3,500. Ask: free teardown of one portfolio client's site.
   - Brands (track B): cite the specific gap noted below. Offer a free five-point teardown. Conversion work from $3,500, ads + email retainer from $1,500/mo.
   - Local (track C): One Day Website from $2,500, planned in the morning, live by sunset, you own it.
4. Report: what was deleted, links to the new WE Creative doc and task, list of drafts created.

## Prospects
### A — design studios (partner, 15% referral / white-label)
- Indigo Branding — info@indigobrandingagency.com — DRAFT EXISTS
- Ludlow Kingsley — clark@ludlowkingsley.com — DRAFT EXISTS
- Chase Design Group — newbiz@chasedesigngroup.com — DRAFT EXISTS
- Lukasz Design Studio — luke@lukaszdesign.com — DRAFT EXISTS
- BRCHN Design House — sam@brchndesignhouse.com — industrial design, DTLA
- WANDR — hello@wandr.studio — UX/product studio (also pitch AI/app builds)
- Almost Always (formerly Boundary) — hola@almostalways.com — brand + Webflow, El Segundo (neighbors; suggest coffee)
- Farm Design — hello@farmdesign.net — branding, Pasadena
- Olive + Spark — hello@olivespark.com — graphic design, Pasadena
- Primer Studios — info@primer-studios.com — industrial design, DTLA
- Sweet Design Studio — juana.najera@sweetdesigncollective.com — interior design; her clients are restaurants/salons/retail (pitch One Day Website referrals too)
- Tower Design Interiors — hello@towerdesign.com — luxury interiors, Santa Monica; hospitality/retail clients
- Primary Design Co. — primarydesigncompany@gmail.com
- Forner — info@forner.studio

### B — Shopify / DTC brands
- Luby Bikini — info@lubybikini.com — Shopify + Klaviyo, running Meta ads, NO reviews app
- Bea Furnishings — beafurnishings@gmail.com — Squarespace, running Meta ads, NO email capture → Shopify + Klaviyo rebuild pitch
- Stratia Skin — info@stratiaskin.com — Shopify + Klaviyo, no Meta pixel, no reviews
- Eyeoba — info@eyeoba.com — Shopify + Klaviyo, no pixel, no reviews
- Katie May — marketing@katiemay.com, hello@katiemay.com — Shopify, Klaviyo, reviews, no Meta pixel
- Lauren Moshi — support@laurenmoshi.com — homepage has no title tag; no Meta pixel (ask them to forward to marketing)
- 888 Chosen Ones / 369 LA — support@369losangeles.com — streetwear (like Stoned Immaculate), no pixel
- Cerqular — connect@cerqular.com — Shopify, Klaviyo, reviews, no pixel
- Homebody — info@homebody626.com — 849 products, no email tool, no pixel, no reviews
- For Love & Beauty — forloveandbeautyinfo@gmail.com — Squarespace, no email/ads/reviews

### C — local (One Day Website). No emails except the last; reach by Instagram DM / phone on Google listing / walk-in
- The Londoner by Anthony Morrison — Hermosa salon, 390 reviews 4.9 — Vagaro booking page only
- Kelifornia Hair — Hermosa, 51 reviews — Vagaro only
- Brandon Martinez Salon — Hermosa — Square booking only
- Haute L.A. Aveda Salon — Hermosa, 74 reviews — Vagaro only
- The Studio MDR — Manhattan Beach, 99 reviews — Mindbody only (verify no shared site)
- Coreology — Manhattan Beach, 75 reviews — Mindbody only
- 4 Star Gym / Game Time Strength — El Segundo — Mindbody only
- Hot 8 Yoga — Manhattan Beach, 580 reviews — Mindbody only (multi-location; verify)
- Vando Construction — Torrance, 55 reviews — GoDaddy thin site, IG vando.construction
- F. Roberts Construction — Torrance — Wix — info@rnrcgroup.com (write a draft)

## Plan doc content (for the WE Creative doc)
**Tracks.** A: branding/packaging/identity/interior studios (2–15 people), LA then NYC; white-label or 15% referral; lead with a free teardown. B: Shopify/DTC ~$20–50k/mo; five-point teardown then conversion sprint or ads+retention retainer. C: South Bay/Westside local businesses with only a booking page or page-builder site; One Day Website. D: AI apps/MVPs; referrals, existing clients (LVBL first), track-A partners, Upwork.
**Sources.** Google Maps by category+city; Google "made in Los Angeles" + category; LinkedIn company search (1–50 staff); Instagram brand accounts with Shopify links. Site checks: platform, Klaviyo, Meta pixel, reviews app, booking tool, emails, whether the studio already sells dev/marketing (disqualifies A).
**Scoring.** A: +3 no dev, +2 no marketing, +2 email, −3 sells dev, −3 logo mills/print. B: +3 Shopify or weak builder, +2 Klaviyo, +2 Meta pixel, +1 no reviews, +2 email. C: +3 ≥40 reviews & ≥4.3, +3 booking-link-only, +2 page builder, +1 thin site, +2 email; chains out. ≥5 qualifies.
**Cadence.** Mon source 100 (25/track) → check → score. Tue–Wed research top 40, draft in Gmail. Josh 15 min/day to review/send. Follow-ups day 3, 7, 14. Fri report. ≤40 sends/day, plain text, no tracking links; check SPF/DKIM/DMARC first.
**Lessons.** Maps "no website" is wrong for restaurants (all six checked had sites); booking-link-only is the reliable local signal. ~⅓ of studios already sell web/marketing. Emails easy for studios/brands, hard for local.
**90-day targets.** A 150 sent / 2 partnerships. B 200 / 3 retainers. C 250 / 6 sites. D 80 / 1 MVP.
**Next batch.** Retry ~90 sites that failed the crawl; NYC studios; Instagram Shopify brands; Manhattan Beach / Redondo / Westside categories.
