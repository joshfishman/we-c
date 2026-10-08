/**
 * Dev-only safety net for content saves.
 *
 * A Tina editor tab that was opened before the schema changed keeps the old
 * schema in the browser; saving from it rewrites the JSON in the old shape and
 * silently drops every field it doesn't know about. To make that recoverable:
 *
 * - every time a content/*.json file changes, the PREVIOUS version is copied
 *   to .content-history/<path>/<timestamp>.json (gitignored), so any save can
 *   be undone by copying a snapshot back;
 * - if a save removes fields that held content, it logs a loud warning in the
 *   dev-server terminal naming them, plus the snapshot to restore from.
 *
 * Runs once when the Next dev server starts; does nothing in production.
 */
export async function register() {
  if (process.env.NODE_ENV !== "development") return;
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const g = globalThis as { __contentHistory?: boolean };
  if (g.__contentHistory) return; // HMR re-runs register(); watch once
  g.__contentHistory = true;

  const fs = await import("fs");
  const path = await import("path");
  const root = path.join(process.cwd(), "content");
  const historyRoot = path.join(process.cwd(), ".content-history");

  const last = new Map<string, string>();
  const read = (file: string) => {
    try {
      return fs.readFileSync(file, "utf8");
    } catch {
      return null;
    }
  };
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : p.endsWith(".json") ? [p] : [];
    });
  for (const file of walk(root)) {
    const text = read(file);
    if (text !== null) last.set(file, text);
  }

  // Paths of object keys that hold a non-empty value (list indices collapsed,
  // so adding/removing a card doesn't count as "lost").
  const keyPaths = (value: unknown, prefix = "", out = new Set<string>()) => {
    if (Array.isArray(value)) {
      value.forEach((v) => keyPaths(v, `${prefix}[]`, out));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) {
        const p = prefix ? `${prefix}.${k}` : k;
        if (v !== "" && v !== null && v !== undefined) out.add(p);
        keyPaths(v, p, out);
      }
    }
    return out;
  };

  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  fs.watch(root, { recursive: true }, (_event, name) => {
    if (!name || !String(name).endsWith(".json")) return;
    const file = path.join(root, String(name));
    clearTimeout(timers.get(file));
    timers.set(
      file,
      setTimeout(() => {
        const before = last.get(file);
        const after = read(file);
        if (after === null || after === before) return;
        last.set(file, after);
        if (before === undefined) return;

        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        const dir = path.join(historyRoot, String(name).replace(/\.json$/, ""));
        fs.mkdirSync(dir, { recursive: true });
        const snapshot = path.join(dir, `${stamp}.json`);
        fs.writeFileSync(snapshot, before);

        try {
          const kept = keyPaths(JSON.parse(after));
          const lost = [...keyPaths(JSON.parse(before))].filter((p) => !kept.has(p));
          if (lost.length) {
            console.warn(
              `\n⚠️  content/${name}: this save removed ${lost.length} field(s):\n` +
                lost.slice(0, 20).map((p) => `   - ${p}`).join("\n") +
                (lost.length > 20 ? `\n   … and ${lost.length - 20} more` : "") +
                `\n   If that wasn't intended (e.g. saved from an old /admin tab),` +
                ` restore with:\n   cp "${path.relative(process.cwd(), snapshot)}" "content/${name}"\n`
            );
          }
        } catch {
          // unparsable mid-write; the snapshot is still saved
        }
      }, 300)
    );
  });
}
