import { NextResponse } from "next/server";

/**
 * Hide the TinaCMS editor in production.
 *
 * `tinacms build` emits the editor into public/admin, and files under public/
 * are served directly — a rewrite can't gate them, so block the path here.
 *
 * Editing is local-only, so there's nothing to configure and no condition to
 * weigh: in production the editor is always hidden. `npm run dev` runs with
 * NODE_ENV=development and serves /admin normally.
 */
export function middleware() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
