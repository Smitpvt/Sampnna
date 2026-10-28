// Produces web-ready copies of the curated photography.
//
//   node scripts/optimize-images.mjs [originalsDir]
//
// Reads src/data/media-sources.json and writes:
//   public/images/<slug>.webp       max 2400 px long edge — next/image derives AVIF/WebP sizes from these
//   public/images/og/<slug>.jpg     1200×630 social-share crops for entries marked "og": true
//   src/data/media.generated.json   dimensions + blur placeholders
//
// The full-resolution originals (~1.2 GB) live OUTSIDE the project so they are
// never committed or deployed: ../sampann-original-assets by default, or set
// ORIGINALS_DIR / pass a path.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const sourceDir = path.resolve(process.argv[2] ?? process.env.ORIGINALS_DIR ?? path.join(root, "..", "sampann-original-assets"));
const outDir = path.join(root, "public", "images");
const ogDir = path.join(outDir, "og");
const manifestPath = path.join(root, "src", "data", "media.generated.json");
const MAX_EDGE = 2400;

try {
  await fs.access(sourceDir);
} catch {
  console.error(`Originals folder not found: ${sourceDir}\nSet ORIGINALS_DIR or pass the folder path.`);
  process.exit(1);
}

const sources = JSON.parse(await fs.readFile(path.join(root, "src", "data", "media-sources.json"), "utf8"));
await fs.mkdir(ogDir, { recursive: true });

const manifest = {};
let total = 0;
for (const item of sources) {
  const base = sharp(path.join(sourceDir, item.source), { failOn: "none" }).rotate();

  const { data, info } = await base
    .clone()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 5, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(path.join(outDir, `${item.slug}.webp`), data);
  total += data.length;

  if (item.og) {
    const og = await base.clone().resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    await fs.writeFile(path.join(ogDir, `${item.slug}.jpg`), og);
    total += og.length;
  }

  const blur = await base.clone().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  manifest[item.slug] = {
    src: `/images/${item.slug}.webp`,
    width: info.width,
    height: info.height,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  console.log(`✓ ${item.slug} ${info.width}×${info.height} ${(data.length / 1024).toFixed(0)} KB${item.og ? " + og" : ""}`);
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} images → ${path.relative(root, outDir)} (${(total / 1024 / 1024).toFixed(1)} MB)`);
