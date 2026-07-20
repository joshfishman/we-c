type MediaItem = {
  id: string;
  type: "file" | "dir";
  directory: string;
  filename: string;
  src?: string;
  thumbnails?: Record<string, string>;
};

type ListOptions = {
  directory?: string;
  limit?: number;
  offset?: number | string;
  thumbnailSizes?: Array<{ w: number; h: number }>;
};

/** Browser-side media store for Tina's local-only editor. */
export class LocalMediaStore {
  accept = "image/*,video/*";
  maxSize = 100 * 1024 * 1024;

  parse(item: MediaItem) {
    return item.src || "";
  }

  async persist(
    media: Array<{ directory: string; file: File }>
  ): Promise<MediaItem[]> {
    const uploaded: MediaItem[] = [];

    for (const item of media) {
      const form = new FormData();
      form.append("directory", item.directory || "");
      form.append("file", item.file, item.file.name);

      const response = await fetch("/api/tina/media/upload", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Upload failed");
      }

      for (const file of result.files || []) {
        uploaded.push({
          id: file.filename,
          type: "file",
          directory: item.directory || "",
          filename: file.filename,
          src: file.src,
          thumbnails: {
            "75x75": file.src,
            "400x400": file.src,
            "1000x1000": file.src,
          },
        });
      }
    }

    return uploaded;
  }

  async list(options: ListOptions) {
    const directory = (options.directory || "").replace(/^\/+|\/+$/g, "");
    const query = new URLSearchParams({
      limit: String(options.limit || 20),
    });
    if (options.offset) query.set("cursor", String(options.offset));

    const response = await fetch(
      `/api/tina/media/list/${directory}?${query.toString()}`
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to load media");

    const items: MediaItem[] = [
      ...(result.directories || []).map((filename: string) => ({
        id: filename,
        type: "dir" as const,
        directory,
        filename,
      })),
      ...(result.files || []).map(
        (file: { filename: string; src: string }) => ({
          id: file.filename,
          type: "file" as const,
          directory,
          filename: file.filename,
          src: file.src,
          thumbnails: Object.fromEntries(
            (options.thumbnailSizes || [{ w: 400, h: 400 }]).map(({ w, h }) => [
              `${w}x${h}`,
              file.src,
            ])
          ),
        })
      ),
    ];

    return { items, nextOffset: result.cursor || 0 };
  }

  async delete(item: MediaItem) {
    const mediaPath = [item.directory, item.filename]
      .filter(Boolean)
      .map((part) => encodeURIComponent(part))
      .join("/");
    const response = await fetch(`/api/tina/media/${mediaPath}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Unable to delete media");
  }
}
