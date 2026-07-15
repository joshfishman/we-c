# WE Creative Agency — site

Marketing site for WE Creative Agency. Two pages:

- **Home** (`/`, `app/page.tsx`) — ecommerce-marketing landing. Sunset/dusk theme (same palette as One Day).
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

## Theming (token layer — never hard-code a hex)

Colour is a **theme**, not per-component props. `styles/tokens.css` defines semantic `--t-*` tokens in two palettes: `forest` (the `:root` default) and `sunset`. A page's **Color theme** field (Tina → Pages) sets `data-theme` on the page root (`SiteRenderer`), and the whole page re-skins. Adding a palette = copy a block; no component changes.

- Sections read `var(--t-panel-bg)`, `--t-card-bg`, `--t-proof-bg`, `--t-accent-grad`, `--t-connector`, `--t-cta-bg`, `--t-stars`, etc. **Both pages currently run `sunset`.**
- **Keyframes must live in the module that uses them.** CSS Modules scopes `animation-name`, so `animation: gradShift` in a `.module.css` referencing a keyframe in `globals.css` resolves to a scoped name that doesn't exist and silently never runs. (This bit the whole site once.)
- **Header** — transparent at the top on both pages; a minimal dusk backing only when `.scrolled` (over light content the nav link drops to ~1.1:1 without it). One shared `.sunText` gradient link.
- Shared UI: `ui/Starfield.tsx` (visibility via `--t-stars`, `flip` for night-at-the-foot panels), `ui/Squiggle.tsx` (the dashed connector, used by both the One Day steps and the home Attract→Convert→Retain flow).

## Assets

- Images live in `public/media/`. Some (Ovando, Stoned Immaculate project fans) are dropped in by the user — pasted screenshots can't be written to disk from here, so those are wired to expected paths and the user adds the files.
- Favicon: `app/icon.svg` (gold "WE" on the brand dusk purple).

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

- **Production visual editing** — deliberately OFF and **fails closed**: `/admin` and `/api/tina/*` return 404 in production unless editing is fully configured (see README). Editing happens locally via `npm run dev` → `/admin`.
  The code is built and dormant: **Supabase Auth** for login (`tina/SupabaseAuthProvider.tsx` + a server-side token check in the API route, gated on the `TINA_ALLOWED_EMAILS` allowlist — authentication is not authorization). Turning it on also needs an **Upstash Redis** datalayer (Vercel KV is retired; `lib/datalayer.ts` takes `KV_REST_API_*` or `UPSTASH_REDIS_REST_*`), a GitHub PAT, and `TINA_PUBLIC_IS_LOCAL=false`. Untested: the live sign-in round trip.
- **Questionnaire page** — the "What are you planning?" CTA links to `#`; the multi-step questionnaire isn't built.
