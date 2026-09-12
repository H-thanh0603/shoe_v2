// Fill products.image from src/lib/data.ts (STITCH long URLs can't live in SQL).
// Maps products in PRODUCTS array order to rows by slug.
// Usage: DATABASE_URL=... node db/seed-images.mjs
import { readFileSync } from "node:fs";
import pg from "pg";

const src = readFileSync(new URL("../src/lib/data.ts", import.meta.url), "utf8");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Extract { slug, image } pairs from the PRODUCTS array entries.
const entry = /slug:\s*"([^"]+)"[\s\S]*?image:\s*(STITCH\.\w+|img\([^)]+\))/g;
const stitchUrl = /(\w+):\s*"(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g;
const stitch = {};
let s;
while ((s = stitchUrl.exec(src))) stitch[s[1]] = s[2];

let m, n = 0;
while ((m = entry.exec(src))) {
  const slug = m[1];
  const imgExpr = m[2];
  let url;
  if (imgExpr.startsWith("STITCH.")) {
    url = stitch[imgExpr.slice(7)];
  } else {
    const id = imgExpr.match(/img\("([^"]+)"(?:,\s*(\d+))?\)/);
    url = `https://images.unsplash.com/${id[1]}?q=80&w=${id[2] ?? 1200}&auto=format&fit=crop`;
  }
  if (!url) continue;
  const r = await pool.query("UPDATE products SET image=$1 WHERE slug=$2", [url, slug]);
  n += r.rowCount ?? 0;
}
console.log(`seeded ${n} images`);
await pool.end();
