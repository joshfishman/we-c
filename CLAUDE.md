# WE Creative Agency — site

Marketing site for WE Creative Agency. Two pages:

- **Home** (`/`, `app/page.tsx`) — ecommerce-marketing landing. Forest/green theme.
- **One Day** (`/one-day`, `app/one-day/page.tsx`) — "1 Day Website" offer. Sunset/dusk theme, cinematic sky hero.

## Golden rule

**Do NOT `git push` or deploy unless the user explicitly asks.** Pushing to `main` on the `wec` remote auto-deploys to Vercel (production). Make and verify changes locally; leave them uncommitted by default and wait for an explicit "push"/"ship it".

## CMS requirements (product goals)

The CMS must be **easy to use with a front-end WYSIWYG editor** — non-technical editors edit in place, not in code. Specifically:

- **Every section** is editable inline via TinaCMS (`/admin`), including a `visible` toggle to hide/show it.
- **Work module (Our Work)** — editors can **add and remove** project cards (it's a Tina `list` field) and reorder them.
- **"Read more" case studies** — the body is a **rich-text (WYSIWYG) field** (`caseBody` on each project), so editors write formatted copy in the editor. If empty, a sensible default is shown.

When adding new sections/fields, keep them editor-friendly: real Tina fields (string/rich-text/image/list), clear labels, and a `visible` boolean — never hard-code copy that an editor would want to change.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **CSS Modules** per component + design tokens in `styles/tokens.css`. **No Tailwind.**
- **Self-hosted TinaCMS** (local mode) for content editing.
- **Formspree** (`@formspree/react`) for the contact form — form id `mdarygor`, public, **no API key**. Notification email is set in the Formspree dashboard (→ josh@wecreativeagency.com).
- **Radix Popover** (`@radix-ui/react-popover`) for the Our Work "Read more" case studies.

## Dev / build / deploy

- **Dev:** `npm run dev` → runs `tinacms dev -c "next dev"`. App on `localhost:3000`, editor at `/admin`, Tina datalayer on ports `9000`/`4001`. If a build/port conflict happens, kill stale procs on 3000/9000/4001.
- **Build:** `npm run build` → `tinacms build && next build`. (No `--partial-reindex` — it needs `.git`, absent in Vercel's CLI tarball.)
- **Deploy:** GitHub repo `joshfishman/we-c` (remote `wec`) is connected to Vercel → **push to `main` auto-deploys**. Production URL: `we-c.vercel.app`. (Remote `origin` = the older `wecreative` repo.)

## Content & rendering

- Content lives in `content/` as JSON: `page/home.json`, `oneDay/index.json`, `settings/global.json`.
- Pages fetch through `lib/loadContent.ts`:
  - **Dev** → Tina `databaseClient` (real GraphQL query, so `/admin` visual editing works).
  - **Production / `next build`** → reads the committed JSON directly (static render, no runtime backend). This is why the site deploys with no DB.
- `components/blocks/Blocks.tsx` maps a page's `blocks[]` to components by Tina `__typename`. `OneDay.tsx` renders the One Day page directly.

## Theming conventions

Shared components take a `theme`/tone prop so the two pages share layout but differ in color:

- **OurWork** — `theme="green"` (home) vs `"sunset"` (One Day). Same staggered 66% card layout; only the palette differs (`.green` overrides layer over the `.sunset` layout in `ourWork.module.css`).
- **CtaSection** (the footer + contact form) — `theme="forest"` (home, green) vs default dusk (One Day). The `ContactForm` takes a `forest` prop for green-tinted fields + green submit.
- **Header / Logo** — `tone="sky"` on One Day (darker header backing, sky links); logo is always the gold gradient. Nav shows only the cross-page link (Home shows "1 Day Website", One Day shows "Ecommerce Marketing").

## Assets

- Images live in `public/media/`. Some (Ovando, Stoned Immaculate project fans) are dropped in by the user — pasted screenshots can't be written to disk from here, so those are wired to expected paths and the user adds the files.
- Favicon: `app/icon.svg` (gold "WE" on dark green).

## Verifying changes

Use the preview tools against the running dev server (screenshots can be flaky on the heavy hero pages — prefer `preview_eval`/computed-style checks for measurements). Don't ask the user to check manually.

## Analytics, tracking & tests

- **Conversion (GTM/GA4):** `lib/track.ts` pushes `cta_click`, `generate_lead` (primary), `section_view`, `scroll_depth`, `outbound_click`, `form_submit` to the GTM dataLayer (`NEXT_PUBLIC_GTM_ID`). Suppressed in the editor via `isEditing()`.
- **Behaviour (Microsoft Clarity):** `components/site/Clarity.tsx` loads session replay + heatmaps when `NEXT_PUBLIC_CLARITY_ID` is set; also suppressed in the editor.
- **Header clearance:** `Header.tsx` publishes `--header-h` (measured, re-measured after `fonts.ready`); both heroes reserve `calc(var(--header-h) + 28px)` so content never sits behind the fixed bar. Header padding is 12px (10px scrolled); the One Day header (`.skyHeader`) is fully transparent (no backing/divider/shadow) in all states.
- **Hero entrance:** both hero headlines type in via `components/ui/Typewriter.tsx` (SSR-safe: starts empty → caret → types; full text for SR via sr-only + a hidden sizer that prevents reflow; disabled under `prefers-reduced-motion` and inside the Tina editor — so editing the headline doesn't retrigger typing, but the headline is then edited via the sidebar form, not inline). Content fades/rises in on load (`heroRise` keyframe, staggered, `both` fill so it's hidden until its delay — the load shows only the header logo + CTA first).
- **Background media:** `components/ui/BgVideo.tsx` renders the poster as an `<img>` layer behind the video (still-frame fallback on every browser), sets `muted` as a property + retries `play()` on mount/`canplay`/`loadeddata` (mobile autoplay), and is `loop`/`playsInline`/no-`controls`/no-PiP so it never shows a play button. Home hero has no video (poster image only); One Day uses `sky-video.mp4`.
- **Tests:** `npm run lint` (Next + `jsx-a11y`, a11y rules are errors, `no-explicit-any` is a warning for Tina files), `npm test` (Vitest — `lib/`), `npm run test:e2e` (Playwright — render/clearance/form/popover/responsive + `@axe-core` WCAG A/AA gate on both pages, failing on serious/critical). Playwright reuses a running dev server locally; builds+starts in CI.
- **A11y invariant:** both pages must pass the axe scan — keep accent text/badges above AA contrast (the One Day process badges/tags were deepened for this).

## Not yet enabled

- **Production visual editing** — the deployed site is view-only. Turning on hosted `/admin` needs: a KV datalayer (Vercel KV), a GitHub PAT (content commits), **Supabase Auth** for login, and `TINA_PUBLIC_IS_LOCAL=false`.
- **Questionnaire page** — the "What are you planning?" CTA links to `#`; the multi-step questionnaire isn't built.
