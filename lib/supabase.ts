import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase wiring for the TinaCMS editor login.
 *
 * The URL / anon key are public by design (they're `NEXT_PUBLIC_*` and are
 * safe in the browser — row-level security is what protects Supabase data).
 * We only use Supabase for *authentication*; the site's content still lives in
 * git and is served from committed JSON.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Who is allowed into the editor.
 *
 * Authentication is NOT authorization: any account that can sign up in the
 * Supabase project would otherwise be able to edit the site. Editing is gated
 * on an explicit allowlist, and an empty list means nobody — fail closed.
 */
export function allowedEditorEmails(): string[] {
  return (process.env.TINA_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedEditor(email?: string | null): boolean {
  if (!email) return false;
  const allowed = allowedEditorEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.toLowerCase());
}

let browserClient: SupabaseClient | null = null;

/** Browser client — persists the session so the editor survives a reload. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return browserClient;
}

/**
 * Stateless server client used only to verify a bearer token. The anon key is
 * enough: `auth.getUser(jwt)` asks Supabase to validate the token, so no
 * service-role key is needed (and none should be shipped here).
 */
export function createSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
