# WE Digital Studio

A modular, editable marketing site built with **Next.js (App Router)** and a
**self-hosted TinaCMS** backend, deployed to **Vercel**.

- **Front-end visual editing** — every section is a Tina *block* with its own
  fields plus a **Visible** toggle (uncheck to hide a section). Editors click
  fields in a live preview at `/admin` and changes commit straight to GitHub.
- **Modular sections** — one component + one CSS module per section under
  `components/blocks/*`. Add/reorder/hide sections in the editor; build new
  pages by reusing the same blocks.
- **Separate, tweakable styles** — design tokens in `styles/tokens.css`, one
  scoped CSS module per section. No Tailwind, no build magic.
- **Conversion tracking** — Google Tag Manager `dataLayer` events
  (`section_view`, `scroll_depth`, `cta_click`, `outbound_click`, `form_submit`,
  and the primary `generate_lead` conversion). Wire GA4/Ads/Meta in the GTM UI.

## Local development (zero setup)

```bash
npm install --legacy-peer-deps
npm run dev
```

- Site: <http://localhost:3000>
- Visual editor: <http://localhost:3000/admin>

Local dev runs Tina in **local mode** (`TINA_PUBLIC_IS_LOCAL=true`, set in
`.env.local`): content is read/written on the filesystem under `content/`, with
no database, auth, or GitHub required. Edits save directly to the JSON files.

> `--legacy-peer-deps` is required (and pinned in `.npmrc`): some Tina
> packages declare a Next.js peer range that doesn't yet list Next 16.

## Project structure

```
app/                  routes: / (home), /one-day, /particles (sandbox), /api/tina
components/
  site/               shared chrome — SiteRenderer, Header, Analytics
  blocks/             home-page section blocks (one folder + .module.css each)
  oneday/             the One Day page renderer + its styles
  ui/                 primitives — Cta, Section, ImageSlot, ParticleField
content/              Tina content (page blocks, oneDay, global settings)
tina/collections/     schemas: page.ts, oneDay.ts, settings.ts
styles/tokens.css     design tokens (colors, gradients, type, spacing)
lib/track.ts          GTM dataLayer event layer
```

## Content model

| File | What |
| --- | --- |
| `content/page/home.json` | Home page — an ordered list of section **blocks**. |
| `content/oneDay/index.json` | The One Day page (structured sections). |
| `content/settings/global.json` | Global header (nav + CTA) and footer. |
| `tina/collections/page.ts` | Home block templates + per-block `visible` field. |
| `tina/collections/oneDay.ts` | One Day page schema. |
| `tina/collections/settings.ts` | Global settings schema. |

Each home section lives in `components/blocks/<name>/` with its
`<name>.module.css`. The dispatcher `components/blocks/Blocks.tsx` maps Tina's
block `__typename` → component and **skips any block with `visible === false`**.

## Design system

- **Tokens** live in `styles/tokens.css` — edit colors, gradients, type and
  spacing in one place. `--accent` is also overridable per-site from Settings.
- **Buttons** (`.btn` in `app/globals.css`) have three variants:
  `primary` (sunset), `secondary` (green pill, like the "View case" links),
  `cream` (light pill). All share one hover behaviour: bg + text-color
  transition, a 0.75px downward nudge, and the drop shadow removed.
- **`ParticleField`** (`components/ui/ParticleField.tsx`) — a dependency-free,
  prop-driven 3D particle background. See `/particles` for a tunable sandbox
  (delete the route when done); drop `<ParticleField/>` behind any
  `position: relative` section.

## Editing & adding sections

- **Edit copy / images / hide:** open `/admin`, pick *Pages → home*, edit fields
  in the live preview. Uncheck **Visible** to hide a section.
- **Add a new section type:** add a template in `tina/collections/page.ts`,
  create `components/blocks/<name>/<Name>.tsx` + `.module.css`, and register it
  in `components/blocks/Blocks.tsx` (key = `PageBlocks<Name>`).
- **Add a second page:** create `content/page/<slug>.json`, add
  `app/<slug>/page.tsx` (copy `app/page.tsx`, query that file). Header/footer
  come from the shared `settings` collection automatically.

### Hero background video

The hero plays a full-bleed background video. Files live in `public/media/`
and are referenced by path in the Hero block:

- **Background video (desktop)** — `bgVideo`, e.g. `/media/hero-bg.mp4`.
- **Background video (mobile)** — `bgVideoMobile`. Optional; under 768px the
  hero swaps to this file, falling back to the desktop video when empty.
- **Poster / fallback image** — `bgPoster`, shown while the video loads.

To replace a video, drop a new `.mp4` into `public/media/` and update the path
in `/admin` (Hero block) or in `content/page/home.json`. Keep clips short and
compressed (the bundled one is ~2.5 MB); the video is muted, looped and
autoplays with `playsInline`.

## Contact form

The contact form ([components/ui/ContactForm.tsx](components/ui/ContactForm.tsx)) is
used on the homepage contact section and the One Day questionnaire. It works on
the static deploy with **no backend** via **Formspree**:

1. Create a free form at [formspree.io](https://formspree.io) whose email
   notifications go to **josh@wedigital.studio**.
2. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (in `.env.local` / Vercel) to that form's
   URL, e.g. `https://formspree.io/f/xxxxxxx`.

Until the endpoint is set, the form falls back to opening the visitor's mail
client to `josh@wedigital.studio`. Submissions also fire a `generate_lead`
GTM event.

**Resend alternative:** if you'd rather send via the Resend API, add an
`app/api/contact/route.ts` server route that calls Resend with `RESEND_API_KEY`
and `to: "josh@wedigital.studio"` (needs a verified sending domain), and
point the form at `/api/contact`. Ask and I'll wire it.

## Conversion tracking

Set `NEXT_PUBLIC_GTM_ID` (e.g. `GTM-XXXXXX`). The container loads via
`@next/third-parties`. Events are pushed by `lib/track.ts`; configure tags in
the GTM UI. Tracking is suppressed inside the Tina editor preview.

Events: `cta_click`, `generate_lead` (primary conversion), `section_view`,
`scroll_depth`, `outbound_click`, `form_submit`.

## Behaviour tracking (Microsoft Clarity)

Set `NEXT_PUBLIC_CLARITY_ID` (from [clarity.microsoft.com](https://clarity.microsoft.com),
free) for session replay + heatmaps. The tag loads via `components/site/Clarity.tsx`
and is suppressed inside the Tina editor. Clarity is additive to the GTM/GA4
funnel — qualitative behaviour on top of the quantitative conversion events.

## Accessibility & testing

- **Lint:** `npm run lint` (Next + `eslint-plugin-jsx-a11y`).
- **Unit:** `npm test` (Vitest — `lib/` tracking + helpers).
- **E2E + a11y:** `npm run test:e2e` (Playwright — both pages render, header
  clearance, CTAs, contact form, read-more popover, responsive, plus `axe-core`
  scans asserting no serious/critical WCAG violations).

## Production editing is OFF by default (and fails closed)

The deployed site is **view-only**. It renders from the committed JSON in
`content/` (see `lib/loadContent.ts`), so it never calls the Tina API at
runtime. Because Tina's *local* auth provider authorises every request
(`isAuthorized: () => true`), serving that API in production would leave the
content-write endpoint open to anyone. So production refuses to serve it:

- `pages/api/tina/[...routes].ts` returns **404** in production, full stop. The
  backend isn't constructed and the database isn't even imported.
- `middleware.ts` returns **404** for `/admin` in production. (`tinacms build`
  emits the editor into `public/admin`, and files under `public/` are served
  directly — a rewrite can't gate them, so this has to be middleware.)

There is no condition to get wrong: editing is local-only, so both guards are
unconditional. The build needs **no environment variables at all** — verified
with `TINA_PUBLIC_IS_LOCAL` unset, `false` and `true`.

There used to be a hosted-editing mode behind a Supabase login, an Upstash Redis
datalayer and a GitHub PAT. It was never switched on, and `tina/database.ts`
threw at build time whenever the datalayer was missing — which is what broke
deploys. It's gone; `tina/database.ts` is now just `createLocalDatabase()`.

## Deploy to Vercel

1. **Push this repo to GitHub.**
2. **Import the repo into Vercel.** Build command is `npm run build`
   (`tinacms build && next build`).
3. **Set Environment Variables** — only the analytics ones, and both optional:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_GTM_ID` | your GTM container id (optional) |
   | `NEXT_PUBLIC_CLARITY_ID` | your Clarity project id (optional) |

That's it. No database, no Redis, no auth provider, no PAT. Pushes to `main`
deploy automatically.

## Editing content

Editing is local-only:

```bash
npm run dev     # → http://localhost:3000/admin
```

Tina indexes `content/` on your machine (ports 9000/4001), you edit in the
visual editor, and your changes are written straight to the JSON in `content/`.
Commit and push them like any other change; the push deploys the site.

To put the editor back on the internet you'd need to re-add an auth provider, a
hosted datalayer and a git provider — see the git history for the Supabase +
Upstash version (removed in "Editing is local-only").

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev (Tina local mode + Next). |
| `npm run build` | Production build (`tinacms build` + `next build`). |
| `npm start` | Serve the production build. |
