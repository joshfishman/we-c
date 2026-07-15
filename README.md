# WE Creative Agency

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

> `--legacy-peer-deps` is required (and pinned in `.npmrc`): `tinacms-authjs`
> declares a Next.js peer range that doesn't yet list Next 16.

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
   notifications go to **josh@wecreativeagency.com**.
2. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (in `.env.local` / Vercel) to that form's
   URL, e.g. `https://formspree.io/f/xxxxxxx`.

Until the endpoint is set, the form falls back to opening the visitor's mail
client to `josh@wecreativeagency.com`. Submissions also fire a `generate_lead`
GTM event.

**Resend alternative:** if you'd rather send via the Resend API, add an
`app/api/contact/route.ts` server route that calls Resend with `RESEND_API_KEY`
and `to: "josh@wecreativeagency.com"` (needs a verified sending domain), and
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

- `pages/api/tina/[...routes].ts` returns **404** in production whenever it
  would run the local (no-auth) provider, or whenever `NEXTAUTH_SECRET` is
  missing. The backend isn't even constructed in those cases.
- `middleware.ts` returns **404** for `/admin` in production until hosted
  editing is fully configured. (`tinacms build` emits the editor into
  `public/admin`, and files under `public/` are served directly — a rewrite
  can't gate them, so this has to be middleware.)

`vercel.json` pins `TINA_PUBLIC_IS_LOCAL=true` **for the build only** — that's
what lets `tinacms build` run without a datalayer. It no longer pins the
runtime value, so the Vercel dashboard controls that. Setting
`TINA_PUBLIC_IS_LOCAL=false` on its own does **not** enable editing; without
the KV datalayer and `NEXTAUTH_SECRET` the guards above keep it at 404.

## Deploy to Vercel (self-hosted Tina)

1. **Push this repo to GitHub.**
2. **Provision the KV datalayer.** Tina keeps a searchable index of `content/`
   so the editor can query it over GraphQL and commit changes back to GitHub.
   Locally `tinacms dev` runs that index on your machine (ports 9000/4001);
   a serverless function has no such process, so production needs a hosted
   key-value store. In Vercel: **Storage → Create Database → Upstash Redis
   (KV)**, connect it to the project, and it injects `KV_REST_API_URL` /
   `KV_REST_API_TOKEN`. That is what "provision KV" means. Until it exists,
   `tina/database.ts` falls back to placeholder creds and cannot work.
3. **Create a GitHub Personal Access Token** with `contents: read/write` on this
   repo → `GITHUB_PERSONAL_ACCESS_TOKEN`.
4. **Import the repo into Vercel** and set Environment Variables:

   | Variable | Value |
   | --- | --- |
   | `TINA_PUBLIC_IS_LOCAL` | `false` |
   | `GITHUB_PERSONAL_ACCESS_TOKEN` | your PAT |
   | `GITHUB_OWNER` | GitHub user/org |
   | `GITHUB_REPO` | repo name |
   | `GITHUB_BRANCH` | `main` |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
   | `KV_REST_API_URL` / `KV_REST_API_TOKEN` | from Vercel KV |
   | `NEXT_PUBLIC_GTM_ID` | your GTM id |

   Build command is `npm run build` (`tinacms build --partial-reindex && next build`).
5. **Replace the seed user BEFORE the editor is ever reachable.**
   `content/users/index.json` ships Tina's default `tinauser` / `tinarocks` in
   plaintext with `passwordChangeRequired: true`. That means whoever loads the
   editor first sets the password — so seed a real user (and remove the
   default) in the same change that enables hosted editing, not after.
6. Visit `https://your-app.vercel.app/admin` to edit. Changes commit to GitHub
   and redeploy automatically.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev (Tina local mode + Next). |
| `npm run dev:prod` | Dev against the production backend (needs prod env). |
| `npm run build` | Production build (`tinacms build` + `next build`). |
| `npm start` | Serve the production build. |
