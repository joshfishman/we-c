import { createWriteStream } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";

import type { NextApiRequest, NextApiResponse } from "next";
import bodyParser from "body-parser";
import busboy from "busboy";

import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";

/**
 * Tina's content API — local development only.
 *
 * Tina's local provider authorizes every request, so this must never answer in
 * production. There is no hosted-editing mode to fall back to any more (the
 * Supabase login and the Redis datalayer are gone), so the rule is simply: only
 * serve when running locally, and 404 otherwise. The public site renders from
 * committed JSON and never calls this route, so refusing costs it nothing.
 *
 * Fails closed: production is disabled outright, and an unset or malformed
 * TINA_PUBLIC_IS_LOCAL is not "true", so that disables it too.
 */
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const isProd = process.env.NODE_ENV === "production";
const enabled = isLocal && !isProd;

type Handler = (req: NextApiRequest, res: NextApiResponse) => unknown;
let handler: Handler | null = null;

const mediaRootDir = path.resolve(process.cwd(), "public", "media");
const jsonParser = bodyParser.json({ limit: "5mb" });

function getRouteSegments(req: NextApiRequest) {
  const rawRoutes = req.query.routes;
  if (Array.isArray(rawRoutes)) {
    return rawRoutes.filter((segment): segment is string => typeof segment === "string");
  }
  if (typeof rawRoutes === "string") {
    return rawRoutes.split("/").filter(Boolean);
  }
  return [];
}

function normalizeMediaPath(rawPath: string) {
  const decoded = decodeURIComponent(rawPath || "").replace(/\\/g, "/");
  const parts = decoded.split("/").filter(Boolean);
  if (parts.some((part) => part === "." || part === ".." || part.includes("\0"))) {
    throw new Error("Invalid media path");
  }
  return parts.join("/");
}

function resolveMediaTarget(relativePath: string) {
  const absoluteBase = path.resolve(mediaRootDir);
  const normalized = normalizeMediaPath(relativePath);
  const absoluteTarget = path.resolve(absoluteBase, normalized || ".");
  const relative = path.relative(absoluteBase, absoluteTarget);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Invalid media path");
  }
  return absoluteTarget;
}

function toPublicMediaUrl(filePath: string) {
  const relative = path.relative(mediaRootDir, filePath).split(path.sep).join("/");
  return `/media/${relative}`.replace(/\/+/g, "/");
}

async function handleMediaList(req: NextApiRequest, res: NextApiResponse) {
  const segments = getRouteSegments(req);
  const folder = segments[2] ? segments.slice(2).join("/") : "";
  const targetDir = resolveMediaTarget(folder);
  await fs.mkdir(targetDir, { recursive: true });

  const entries = await fs.readdir(targetDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const fullPath = path.join(targetDir, entry.name);
      return {
        filename: entry.name,
        isFile: true,
        size: 0,
        src: toPublicMediaUrl(fullPath),
      };
    });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  res.status(200).json({ files, directories, cursor: null });
}

async function handleMediaDelete(req: NextApiRequest, res: NextApiResponse) {
  const segments = getRouteSegments(req);
  const filePath = segments.slice(1).join("/");
  if (!filePath) {
    res.status(400).json({ error: "A media file or folder path is required" });
    return;
  }
  const targetPath = resolveMediaTarget(filePath);
  await fs.rm(targetPath, { force: true, recursive: true });
  res.status(200).json({ ok: true });
}

function parseJsonBody(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    if (typeof req.body !== "undefined") {
      resolve();
      return;
    }

    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json") && !contentType.includes("application/graphql")) {
      resolve();
      return;
    }

    jsonParser(req, res, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function handleMediaUpload(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    const uploadedFiles: Array<{ filename: string; src: string }> = [];
    const pendingUploads: Array<Promise<void>> = [];
    let savedPath = "";

    bb.on("field", (_name, value) => {
      if (_name === "path" || _name === "directory") {
        savedPath = value;
      }
    });

    bb.on("file", (_name, file, info) => {
      const uploadPromise = (async () => {
        const requestedPath = normalizeMediaPath(savedPath || "");
        const resolvedDir = resolveMediaTarget(requestedPath);
        await fs.mkdir(resolvedDir, { recursive: true });

        const safeName = path.basename(info.filename || "upload");
        const savePath = path.join(resolvedDir, safeName);
        const writer = createWriteStream(savePath);
        file.pipe(writer);
        await new Promise<void>((resolveWrite, rejectWrite) => {
          writer.on("finish", () => resolveWrite());
          writer.on("error", rejectWrite);
        });
        uploadedFiles.push({ filename: safeName, src: toPublicMediaUrl(savePath) });
      })();

      pendingUploads.push(uploadPromise);
    });

    bb.on("finish", async () => {
      try {
        await Promise.all(pendingUploads);
        res.status(200).json({ success: true, files: uploadedFiles });
        resolve();
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Upload failed" });
        reject(error);
      }
    });

    bb.on("error", (error) => {
      res.status(500).json({ error: error instanceof Error ? error.message : "Upload failed" });
      reject(error);
    });

    req.pipe(bb);
  });
}

/**
 * Loaded on first use rather than imported at module scope: the database reads
 * the filesystem, and production should never construct one just to 404.
 */
async function getHandler(): Promise<Handler> {
  if (!handler) {
    const { default: databaseClient } = await import(
      "../../../tina/__generated__/databaseClient"
    );
    handler = TinaNodeBackend({
      authProvider: LocalBackendAuthProvider(),
      databaseClient,
    }) as Handler;
  }
  return handler;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function tinaHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!enabled) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const routes = getRouteSegments(req);
  const [firstRoute, secondRoute] = routes;

  if (firstRoute === "media") {
    if (req.method === "GET" && secondRoute === "list") {
      await handleMediaList(req, res);
      return;
    }
    if (req.method === "DELETE") {
      await handleMediaDelete(req, res);
      return;
    }
    if (req.method === "POST" && secondRoute === "upload") {
      await handleMediaUpload(req, res);
      return;
    }
  }

  if (req.method === "POST") {
    await parseJsonBody(req, res);
  }

  const h = await getHandler();
  return h(req, res);
}
