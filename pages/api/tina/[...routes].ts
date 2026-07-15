import type { NextApiRequest, NextApiResponse } from "next";

import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";

import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from "tinacms-authjs";

import databaseClient from "../../../tina/__generated__/databaseClient";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const isProd = process.env.NODE_ENV === "production";
const hasAuthSecret = !!process.env.NEXTAUTH_SECRET;

/**
 * This route serves TinaCMS's content API (GraphQL reads + document writes).
 *
 * It must never run in production with the local auth provider: that provider's
 * isAuthorized() unconditionally returns true, which would leave the write API
 * open to anyone. It must also never run with real auth but no session secret.
 * Refuse to serve in either case — the public site renders from committed JSON
 * (see lib/loadContent.ts) and never calls this route, so disabling it in
 * production costs nothing until hosted editing is properly configured.
 *
 * To enable hosted editing: provision the KV datalayer (KV_REST_API_URL /
 * KV_REST_API_TOKEN), set NEXTAUTH_SECRET and the GitHub token, then set
 * TINA_PUBLIC_IS_LOCAL=false. See README → "Deploy to Vercel".
 */
const disabled = isProd && (isLocal || !hasAuthSecret);

// Only construct the backend when it's actually safe to serve. Building it
// eagerly would either wire up the no-auth provider or throw on a missing
// secret, so keep it behind the guard.
const handler = disabled
  ? null
  : TinaNodeBackend({
      authProvider: isLocal
        ? LocalBackendAuthProvider()
        : AuthJsBackendAuthProvider({
            authOptions: TinaAuthJSOptions({
              databaseClient: databaseClient,
              secret: process.env.NEXTAUTH_SECRET!,
            }),
          }),
      databaseClient,
    });

const tinaHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!handler) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  return handler(req, res);
};

export default tinaHandler;
