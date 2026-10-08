"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isEditing } from "../../lib/track";

/**
 * Dev only: listens to /api/dev-reload and soft-refreshes the page (server data
 * refetched, scroll and client state kept) when a content JSON file changes.
 * Skipped inside the Tina editor, which already updates live.
 */
export function DevContentReload() {
  const router = useRouter();

  useEffect(() => {
    if (isEditing()) return;
    const source = new EventSource("/api/dev-reload");
    source.onmessage = () => router.refresh();
    return () => source.close();
  }, [router]);

  return null;
}
