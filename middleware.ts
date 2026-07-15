import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Hide the TinaCMS editor in production until hosted editing is actually
 * configured.
 *
 * `tinacms build` emits the editor into public/admin, and files under public/
 * are served directly — a rewrite can't gate them, so block the path here.
 * Hosted editing needs the KV datalayer + NEXTAUTH_SECRET; while
 * TINA_PUBLIC_IS_LOCAL is anything but "false" the editor can't work in
 * production anyway, so serving it only advertises an admin surface.
 */
export function middleware(request: NextRequest) {
  // Hosted editing needs ALL of these. Flipping TINA_PUBLIC_IS_LOCAL alone
  // doesn't enable it — it would just publish a broken, unauthenticated
  // editor — so require the datalayer and session secret too.
  const hostedEditing =
    process.env.TINA_PUBLIC_IS_LOCAL === "false" &&
    !!process.env.NEXTAUTH_SECRET &&
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
