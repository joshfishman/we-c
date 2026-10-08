/**
 * Dev-only safety net for content saves (see instrumentation-node.ts): keeps a
 * snapshot of every content JSON before each save and warns when a save drops
 * fields. The Node-only code lives in its own module, imported only on the
 * Node.js runtime, so the Edge build never sees fs/path. Production: no-op.
 */
export async function register() {
  if (process.env.NODE_ENV !== "development") return;
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { watchContent } = await import("./instrumentation-node");
  await watchContent();
}
