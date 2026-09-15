import { describe, expect, it } from "vitest";
import { rateLimitDb, pruneRateHits } from "@/lib/rate-limit-db";

const HAS_DB = !!process.env.DATABASE_URL;

describe.skipIf(!HAS_DB)("rateLimitDb (shared Postgres limiter)", () => {
  it("allows up to limit, then blocks within the window", async () => {
    const key = `citest-${Date.now().toString(36)}`;
    expect(await rateLimitDb(key, 3, 60_000)).toBe(true);
    expect(await rateLimitDb(key, 3, 60_000)).toBe(true);
    expect(await rateLimitDb(key, 3, 60_000)).toBe(true);
    expect(await rateLimitDb(key, 3, 60_000)).toBe(false);
  });

  it("scopes counts per key", async () => {
    const a = `cia-${Date.now().toString(36)}`;
    const b = `cib-${Date.now().toString(36)}`;
    expect(await rateLimitDb(a, 1, 60_000)).toBe(true);
    expect(await rateLimitDb(a, 1, 60_000)).toBe(false);
    expect(await rateLimitDb(b, 1, 60_000)).toBe(true);
  });

  it("prunes old hits", async () => {
    const n = await pruneRateHits();
    expect(n).toBeGreaterThanOrEqual(0);
  });
});
