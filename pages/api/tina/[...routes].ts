import type { NextApiRequest, NextApiResponse } from "next";

import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";

import databaseClient from "../../../tina/__generated__/databaseClient";
import { datalayerConfigured } from "../../../lib/datalayer";
import {
  allowedEditorEmails,
  createSupabaseServerClient,
  isAllowedEditor,
  supabaseConfigured,
} from "../../../lib/supabase";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const isProd = process.env.NODE_ENV === "production";

/**
 * Supabase-backed authorization for Tina's content API.
 *
 * This is the authoritative check: the browser provider only gates the UI, so
 * every read/write here re-verifies the bearer token with Supabase and then
 * confirms the account is on the editor allowlist. Authentication alone isn't
 * enough — anyone who can sign up in the Supabase project would otherwise be
 * able to write content.
 */
const SupabaseBackendAuthProvider = () => ({
  isAuthorized: async (
    req: NextApiRequest,
    _res: NextApiResponse
  ): Promise<
    { isAuthorized: true } | { isAuthorized: false; errorCode: number; errorMessage: string }
  > => {
    const denied = {
      isAuthorized: false as const,
      errorCode: 401,
      errorMessage: "Unauthorized",
    };

    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token) return denied;

    const supabase = createSupabaseServerClient();
    if (!supabase) return denied;

    // Ask Supabase to validate the JWT (signature + expiry) and resolve the user.
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return denied;

    if (!isAllowedEditor(data.user.email)) {
      return {
        isAuthorized: false as const,
        errorCode: 403,
        errorMessage: "Not an approved editor",
      };
    }

    return { isAuthorized: true as const };
  },
});

/**
 * Refuse to serve in production unless editing is genuinely configured.
 *
 * Tina's local provider authorizes every request, so it must never run in
 * production. Supabase auth is useless without an allowlist, and the API can't
 * work without the datalayer — so require all of it, or 404. The public site
 * renders from committed JSON and never calls this route, so disabling it
 * costs nothing.
 */
const hostedEditingReady =
  !isLocal &&
  supabaseConfigured &&
  allowedEditorEmails().length > 0 &&
  datalayerConfigured;

const disabled = isProd && !hostedEditingReady;

const handler = disabled
  ? null
  : TinaNodeBackend({
      authProvider: isLocal
        ? LocalBackendAuthProvider()
        : SupabaseBackendAuthProvider(),
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
