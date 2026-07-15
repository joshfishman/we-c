import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Hide the TinaCMS editor in production until hosted editing is actually
 * configured.
 *
 * `tinacms build` emits the editor into public/admin, and files under public/
 * are served directly — a rewrite can't gate them, so block the path here.
 */
export function middleware(request: NextRequest) {
  // Hosted editing needs ALL of these. Flipping TINA_PUBLIC_IS_LOCAL alone
  // doesn't enable it — that would only publish a broken editor — so require
  // the Supabase credentials, an editor allowlist (authentication is not
  // authorization) and the KV datalayer too. Same conditions the API route
  // enforces in pages/api/tina/[...routes].ts.
  const hostedEditing =
    process.env.TINA_PUBLIC_IS_LOCAL === "false" &&
    !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
    !!(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    ) &&
    !!process.env.TINA_ALLOWED_EMAILS &&
    !!process.env.KV_REST_API_URL;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !hostedEditing) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
