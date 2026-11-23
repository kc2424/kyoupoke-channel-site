import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Original brand artwork stays intact. Both hosts serve the same prepared images.
const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const widths = [48, 96, 192, 256, 384, 640, 960, 1280, 1600];
const manifest = {};
await mkdir(path.join(publicDir, "optimized"), { recursive: true });
for (const file of (await readdir(publicDir, { recursive: true })).sort()) {
  if (!/\.(png|jpe?g)$/i.test(file) || file.startsWith("optimized/") || file === "og-image.jpg") continue;
  const original = path.join(publicDir, file);
  const metadata = await sharp(original).metadata();
  const sizes = [...new Set([...widths.filter((width) => width < metadata.width), Math.min(metadata.width, 1600)])];
  const stem = file.replace(/\.[^.]+$/, "").replaceAll(path.sep, "-");
  const variants = [];
  for (const width of sizes) {
    const src = `/optimized/${stem}-${width}.webp`;
    await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path.join(publicDir, src));
    variants.push({ width, src });
  }
  manifest[`/${file.replaceAll(path.sep, "/")}`] = { width: metadata.width, height: metadata.height, variants };
}
await mkdir(path.join(root, "src/data"), { recursive: true });
await writeFile(path.join(root, "src/data/image-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await sharp(path.join(publicDir, "hero-members.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(path.join(publicDir, "og-image.jpg"));

// Remove non-image JPEG metadata without recompressing the photo or changing pixels.
const photoPath = path.join(publicDir, "hero-members.jpg");
const photo = await readFile(photoPath);
const chunks = [photo.subarray(0, 2)];
let offset = 2;
while (offset < photo.length) {
  if (photo[offset] !== 0xff) throw new Error("Unexpected JPEG segment");
  const marker = photo[offset + 1];
  if (marker === 0xda || marker === 0xd9) { chunks.push(photo.subarray(offset)); break; }
  const length = photo.readUInt16BE(offset + 2) + 2;
  if (![0xe1, 0xed, 0xfe].includes(marker)) chunks.push(photo.subarray(offset, offset + length));
  offset += length;
}
const cleaned = Buffer.concat(chunks);
if (!photo.equals(cleaned)) {
  const before = await sharp(photo).raw().toBuffer();
  const after = await sharp(cleaned).raw().toBuffer();
  if (!before.equals(after)) throw new Error("Metadata cleanup would alter pixels");
  await writeFile(photoPath, cleaned);
}
console.log(`Prepared responsive variants for ${Object.keys(manifest).length} images and a 1200×630 share image.`);
