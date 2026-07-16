import { createLocalDatabase } from "@tinacms/datalayer";

/**
 * Editing is local-only, so the database always reads the filesystem.
 *
 * `npm run dev` indexes content/ and serves /admin. A production build uses the
 * same local database to generate the editor bundle and the GraphQL client, and
 * then never touches it: pages render from the committed JSON (lib/loadContent),
 * and /admin and /api/tina both 404 in production.
 *
 * This is why the site deploys with no database, no Redis and no env vars. It
 * used to require an Upstash datalayer and a GitHub provider to commit edits
 * back, and threw at build time when they were missing. Both only existed to
 * serve hosted editing, which came with a Supabase login, was never switched on,
 * and is gone.
 */
export default createLocalDatabase();
