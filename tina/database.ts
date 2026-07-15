import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { RedisLevel } from "upstash-redis-level";
import { GitHubProvider } from "tinacms-gitprovider-github";

import { DATALAYER_TOKEN, DATALAYER_URL, datalayerConfigured } from "../lib/datalayer";

// Manage this flag in your CI/CD pipeline and make sure it is set to false in production
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Previously this fell back to placeholder creds (localhost:8079 /
// "example_token"), which silently degraded instead of failing. If we're not in
// local mode the datalayer is required, so say so loudly.
if (!isLocal && !datalayerConfigured) {
  throw new Error(
    "Tina datalayer is not configured. Set KV_REST_API_URL / KV_REST_API_TOKEN " +
      "(or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) from your Upstash " +
      "Redis store, or set TINA_PUBLIC_IS_LOCAL=true for local development."
  );
}

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string;
const owner = (process.env.GITHUB_OWNER ||
  process.env.VERCEL_GIT_REPO_OWNER) as string;
const repo = (process.env.GITHUB_REPO ||
  process.env.VERCEL_GIT_REPO_SLUG) as string;
const branch = (process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  "main") as string;

if (!branch) {
  throw new Error(
    "No branch found. Make sure that you have set the GITHUB_BRANCH or process.env.VERCEL_GIT_COMMIT_REF environment variable."
  );
}

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        branch,
        owner,
        repo,
        token,
      }),
      databaseAdapter: new RedisLevel<string, Record<string, unknown>>({
        redis: {
          url: DATALAYER_URL,
          token: DATALAYER_TOKEN,
        },
        debug: process.env.DEBUG === "true" || false,
      }),
      namespace: branch,
    });
