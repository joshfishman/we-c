import fs from "fs";
import path from "path";

/**
 * Dev-only live reload for content. Streams a server-sent event whenever a
 * file under content/ changes, so pages refresh when the JSON is edited by
 * hand (the Tina editor already updates live on its own). Production: 404.
 */
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response(null, { status: 404 });
  }

  const dir = path.join(process.cwd(), "content");
  const encoder = new TextEncoder();
  let watcher: fs.FSWatcher | undefined;
  let debounce: ReturnType<typeof setTimeout> | undefined;
  let ping: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (msg: string) => {
        try {
          controller.enqueue(encoder.encode(msg));
        } catch {
          // stream already closed
        }
      };
      send(": connected\n\n");
      watcher = fs.watch(dir, { recursive: true }, (_event, file) => {
        if (!file || !String(file).endsWith(".json")) return;
        // Editors fire several events per save; Tina also reindexes the file,
        // so wait a beat before telling the page to refetch.
        clearTimeout(debounce);
        debounce = setTimeout(() => send(`data: ${file}\n\n`), 400);
      });
      // Keep the connection from idling out.
      ping = setInterval(() => send(": ping\n\n"), 25000);

      req.signal.addEventListener("abort", () => {
        watcher?.close();
        clearTimeout(debounce);
        clearInterval(ping);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
