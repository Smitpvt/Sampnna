// Produces the round-plate photographs for the homepage Featured Dishes.
//
//   node server/scripts/featured-images.mjs [originalsDir]
//
// Each dish is a square crop of a camera original, centred on the plate, with
// a light global brightness / saturation match so the eight read as one set.
// Nothing is retouched, composited or added — the food, crockery (including the
// restaurant's own printed SAMPANN tableware) and backgrounds are as shot.
// Writes:
//   client/public/images/featured/<slug>.webp     1000×1000
//   client/src/data/featured.generated.json       src, alt, size + blur placeholder
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const serverRoot = path.resolve(import.meta.dirname, "..");
const projectRoot = path.resolve(serverRoot, "..");
const sourceDir = path.resolve(process.argv[2] ?? process.env.ORIGINALS_DIR ?? path.join(projectRoot, "..", "sampann-original-assets"));
const outDir = path.join(projectRoot, "client", "public", "images", "featured");
const manifestPath = path.join(projectRoot, "client", "src", "data", "featured.generated.json");
const SIZE = 1000;

// cx / cy: crop centre as a fraction of the photo; size: crop side as a fraction
// of the photo's short edge; brightness / saturation: sharp modulate factors.
const DISHES = [
  { slug: "khao-suey", source: "food/burmese-khao-suey-soup-06.jpg", cx: 0.44, cy: 0.6, size: 0.78, saturation: 1.02,
    alt: "Burmese khao suey in a SAMPANN-printed bowl and saucer" },
  { slug: "ortolana-pizza", source: "food/food-14.jpg", cx: 0.39, cy: 0.56, size: 0.7, brightness: 0.95,
    alt: "Pizza topped with zucchini, peppers and parmesan on a round wooden board" },
  { slug: "seafood-thali", source: "food/seafood-thali-02.jpg", cx: 0.5, cy: 0.53, size: 0.98, brightness: 1.08,
    alt: "Seafood thali with fried pomfret, curries, rice, bread and sol kadhi on a banana leaf" },
  { slug: "fettuccine-bolognese", source: "food/food-05.jpg", cx: 0.555, cy: 0.62, size: 0.54, brightness: 0.98, saturation: 1.03,
    alt: "Fettuccine in a minced chicken bolognese sauce in a pale blue bowl" },
  { slug: "murgh-biryani", source: "food/food-23.jpg", cx: 0.47, cy: 0.5, size: 0.92,
    alt: "Murgh matka dum biryani in a clay pot with a chicken leg, raita and sliced onions" },
  { slug: "kombadi-vade", source: "food/kombadi-vade.jpg", cx: 0.5, cy: 0.55, size: 0.98, brightness: 1.1,
    alt: "Kombadi vade thali with puffed vade, chicken curry, rice and sol kadhi on a banana leaf" },
  { slug: "lotus-stem", source: "food/honey-chilli-lotus-stem-06.jpg", cx: 0.575, cy: 0.67, size: 0.4, brightness: 1.1,
    alt: "Honey chilli lotus stem scattered with sesame seeds on a white plate" },
  { slug: "ukadiche-modak", source: "food/ukadiche-modak-04.jpg", cx: 0.44, cy: 0.7, size: 0.84, brightness: 1.15, saturation: 1.04,
    alt: "Ukadiche modak on a leaf in a brass bowl" },
];

await fs.mkdir(outDir, { recursive: true });
const manifest = {};
for (const d of DISHES) {
  const buf = await sharp(path.join(sourceDir, d.source), { failOn: "none" }).rotate().toBuffer();
  const { width, height } = await sharp(buf).metadata();
  const side = Math.round(Math.min(width, height) * d.size);
  const left = Math.max(0, Math.min(width - side, Math.round(width * d.cx - side / 2)));
  const top = Math.max(0, Math.min(height - side, Math.round(height * d.cy - side / 2)));
  const square = sharp(buf)
    .extract({ left, top, width: side, height: side })
    .resize(SIZE, SIZE)
    .modulate({ brightness: d.brightness ?? 1, saturation: d.saturation ?? 1 });

  const data = await square.clone().webp({ quality: 82, effort: 5, smartSubsample: true }).toBuffer();
  await fs.writeFile(path.join(outDir, `${d.slug}.webp`), data);
  const blur = await square.clone().resize(16, 16).webp({ quality: 40 }).toBuffer();
  manifest[d.slug] = {
    src: `/images/featured/${d.slug}.webp`,
    alt: d.alt,
    width: SIZE,
    height: SIZE,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  console.log(`✓ ${d.slug} ← ${d.source} ${(data.length / 1024).toFixed(0)} KB`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${DISHES.length} featured plates → ${path.relative(projectRoot, outDir)}`);
