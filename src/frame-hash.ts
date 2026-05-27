import { createHash } from "node:crypto";

export function computeFrameHash(frame: unknown): string {
  return createHash("sha256").update(JSON.stringify(frame)).digest("hex");
}
