#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const ports = [3000, 4001, 9000];

async function main() {
  for (const port of ports) {
    let pids = [];

    try {
      const output = execFileSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"], {
        encoding: "utf8",
      });
      pids = output
        .split(/\s+/)
        .map((pid) => pid.trim())
        .filter(Boolean);
    } catch {
      continue;
    }

    if (!pids.length) {
      continue;
    }

    console.log(`Clearing existing process(es) on port ${port}: ${pids.join(", ")}`);
    execFileSync("kill", ["-9", ...pids]);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

main().catch((error) => {
  console.error("Unable to clear dev ports:", error);
  process.exit(1);
});
