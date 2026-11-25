// One Line, One Laugh — u-coral-404-one-line-one-laugh-22f2c9f3
// Writes a single hilarious line (max 200 chars) to /output/entry.txt.
// Gate: UTF-8 text, 1-200 characters, not only whitespace, exactly one line.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const ENTRY =
  "I told my AI assistant to keep it brief. It has now been explaining why brevity matters for forty minutes.";

function checkGate(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`gate: entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be exactly one line");
  }
  if (text !== text.trim()) {
    throw new Error("gate: entry must not have leading/trailing whitespace");
  }
  // Reject control characters (tabs, NUL, etc.) so the line reads clean aloud.
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error("gate: entry must not contain control characters");
  }
  // Byte length matters for the leaderboard's Size column: log it too.
  const byteLen = Buffer.byteLength(text, "utf8");
  console.log(`gate OK: ${text.length} chars, ${byteLen} bytes`);
}

function main(): void {
  checkGate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}/entry.txt`;
  writeFileSync(outPath, ENTRY + "\n", "utf8");
  // Read back and verify byte-for-byte.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY + "\n") {
    throw new Error("gate: read-back mismatch");
  }
  const sha = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(`entry (${ENTRY.length} chars): ${ENTRY}`);
  console.log(`wrote ${outPath} (${back.length} bytes incl. newline), sha256 ${sha}`);
}

main();
