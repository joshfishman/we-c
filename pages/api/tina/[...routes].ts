import type { NextApiRequest, NextApiResponse } from "next";

import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";

/**
 * Tina's content API — local development only.
 *
 * Tina's local provider authorizes every request, so this must never answer in
 * production. There is no hosted-editing mode to fall back to any more (the
 * Supabase login and the Redis datalayer are gone), so the rule is simply: only
 * serve when running locally, and 404 otherwise. The public site renders from
 * committed JSON and never calls this route, so refusing costs it nothing.
 *
 * Fails closed: production is disabled outright, and an unset or malformed
 * TINA_PUBLIC_IS_LOCAL is not "true", so that disables it too.
 */
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const isProd = process.env.NODE_ENV === "production";
const enabled = isLocal && !isProd;

type Handler = (req: NextApiRequest, res: NextApiResponse) => unknown;
let handler: Handler | null = null;

/**
 * Loaded on first use rather than imported at module scope: the database reads
 * the filesystem, and production should never construct one just to 404.
 */
async function getHandler(): Promise<Handler> {
  if (!handler) {
    const { default: databaseClient } = await import(
      "../../../tina/__generated__/databaseClient"
    );
    handler = TinaNodeBackend({
      authProvider: LocalBackendAuthProvider(),
      databaseClient,
    }) as Handler;
  }
  return handler;
}

export default async function tinaHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!enabled) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const h = await getHandler();
  return h(req, res);
}
