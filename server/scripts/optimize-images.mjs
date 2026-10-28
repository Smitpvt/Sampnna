// Produces web-ready copies of the curated photography.
//
//   node scripts/optimize-images.mjs [originalsDir]
//
// Reads server/src/data/media-sources.json and writes:
//   client/public/images/<folder>/<slug>.webp   max 2400 px long edge
//   client/public/images/other/og/<slug>.jpg    1200×630 social-share crops
//   client/src/data/media.generated.json        dimensions + blur placeholders
//   server/src/data/media.generated.json        mirrored manifest
//
// The full-resolution originals (~1.2 GB) live OUTSIDE the project so they are
// never committed or deployed: ../sampann-original-assets by default, or set
// ORIGINALS_DIR / pass a path.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const serverRoot = path.resolve(import.meta.dirname, "..");
const projectRoot = path.resolve(serverRoot, "..");
const sourceDir = path.resolve(process.argv[2] ?? process.env.ORIGINALS_DIR ?? path.join(projectRoot, "..", "sampann-original-assets"));
const clientImagesDir = path.join(projectRoot, "client", "public", "images");
const ogDir = path.join(clientImagesDir, "other", "og");
const clientManifest = path.join(projectRoot, "client", "src", "data", "media.generated.json");
const serverManifest = path.join(serverRoot, "src", "data", "media.generated.json");
const MAX_EDGE = 2400;

try {
  await fs.access(sourceDir);
} catch {
  console.error(`Originals folder not found: ${sourceDir}\nSet ORIGINALS_DIR or pass the folder path.`);
  process.exit(1);
}

const sources = JSON.parse(await fs.readFile(path.join(serverRoot, "src", "data", "media-sources.json"), "utf8"));
await fs.mkdir(ogDir, { recursive: true });
await fs.mkdir(path.join(clientImagesDir, "interior"), { recursive: true });
await fs.mkdir(path.join(clientImagesDir, "food"), { recursive: true });
await fs.mkdir(path.join(clientImagesDir, "gallery"), { recursive: true });

const manifest = {};
let total = 0;
for (const item of sources) {
  const base = sharp(path.join(sourceDir, item.source), { failOn: "none" }).rotate();

  let folder = "food";
  if (item.source.startsWith("interior/")) folder = "interior";
  else if (item.source.startsWith("gallery/")) folder = "gallery";

  const { data, info } = await base
    .clone()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 5, smartSubsample: true })
    .toBuffer({ resolveWithObject: true });

  await fs.writeFile(path.join(clientImagesDir, folder, `${item.slug}.webp`), data);
  // Also keep flat copy for compatibility
  await fs.writeFile(path.join(clientImagesDir, `${item.slug}.webp`), data);
  total += data.length;

  if (item.og) {
    const og = await base.clone().resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    await fs.writeFile(path.join(ogDir, `${item.slug}.jpg`), og);
    await fs.writeFile(path.join(clientImagesDir, "og", `${item.slug}.jpg`), og);
    total += og.length;
  }

  const blur = await base.clone().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  manifest[item.slug] = {
    src: `/images/${folder}/${item.slug}.webp`,
    width: info.width,
    height: info.height,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  console.log(`✓ [${folder}] ${item.slug} ${info.width}×${info.height} ${(data.length / 1024).toFixed(0)} KB${item.og ? " + og" : ""}`);
}

const json = JSON.stringify(manifest, null, 2) + "\n";
await fs.writeFile(clientManifest, json);
await fs.writeFile(serverManifest, json);
console.log(`\n${Object.keys(manifest).length} images → ${path.relative(projectRoot, clientImagesDir)} (${(total / 1024 / 1024).toFixed(1)} MB)`);
