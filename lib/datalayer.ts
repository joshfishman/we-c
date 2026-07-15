/**
 * Tina's datalayer credentials (the Redis-backed content index).
 *
 * Vercel KV was retired as a first-party product; the datalayer is now an
 * Upstash Redis store (Vercel → Storage → Marketplace → Upstash, or direct
 * from upstash.com). Both naming conventions are accepted: the Vercel
 * integration
 * historically injected KV_REST_API_*, while Upstash's own integration injects
 * UPSTASH_REDIS_REST_*.
 *
 * Pure env reads only — this is imported by edge middleware.
 */
export const DATALAYER_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";

export const DATALAYER_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const datalayerConfigured = !!(DATALAYER_URL && DATALAYER_TOKEN);
