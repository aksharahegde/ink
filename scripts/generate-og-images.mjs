#!/usr/bin/env node
// Build 1200x630 social cards (public/og/stories/<slug>.jpg) from each story's
// cover. Covers are mostly portrait, and link previews crop to ~1.91:1, so the
// whole cover is centred over a blurred, darkened copy of itself instead.

import { mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const storiesDir = join(root, "content/stories");
const outDir = join(root, "public/og/stories");
const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 30;

mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(storiesDir).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const frontmatter = readFileSync(join(storiesDir, file), "utf8").split(/^---$/m)[1] ?? "";
  const cover = frontmatter.match(/^cover:\s*(\S+)/m)?.[1];
  if (!cover) continue;

  const source = join(root, "public", cover);
  const target = join(outDir, `${slug}.jpg`);
  try {
    if (statSync(target).mtimeMs >= statSync(source).mtimeMs) continue;
  } catch {
    // Target missing: generate it.
  }

  const background = await sharp(source)
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .blur(40)
    .modulate({ brightness: 0.55 })
    .toBuffer();
  const foreground = await sharp(source)
    .resize(WIDTH - PADDING * 2, HEIGHT - PADDING * 2, { fit: "inside" })
    .toBuffer();

  await sharp(background)
    .composite([{ input: foreground, gravity: "centre" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target);
  console.log(`og: ${slug}`);
}
