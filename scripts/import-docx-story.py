#!/usr/bin/env python3
"""Import a Word docx story into Ink markdown + extracted images."""

from __future__ import annotations

import argparse
import re
import shutil
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

# Docx media filename -> published image filename
IMAGE_MAP: dict[str, str] = {
    "image1.png": "image1.png",
    "image4.png": "image2.png",
    "image5.png": "image3.png",
    "image7.png": "image4.png",
    "image8.png": "image5.png",
    "image9.png": "image6.png",
    "image10.png": "image7.png",
    "image11.png": "image8.png",
    "image12.png": "image9.png",
    "image13.png": "image10.png",
    "image14.png": "image11.png",
    "image15.png": "image12.png",
    "image16.png": "image13.png",
    "image17.png": "image14.png",
}

SKIP_IMAGES = {"image2.png", "image3.svg", "image6.png"}
DIVIDER_IMAGE = "image2.png"

STORY_META = {
    "rakta-kastoori": {
        "title": "ರಕ್ತ ಕಸ್ತೂರಿ",
        "description": (
            "ಬೈರಾಪುರ ಶಾಲಾ ಶಿಕ್ಷಕ ವಸಂತ, ತಂಗಿಯ ಮದುವೆಗಾಗಿ ಸಾಲ ಮಾಡಲು "
            "'ಫೈನಾನ್ಸ್ ಕಾಳಿಂಗ' ಬಳಿ ಹೋಗುತ್ತಾನೆ — ಆ ಪ್ರಯಾಣವು ಅಂಬಾಸಿಡರ್ ಕಾರು, "
            "ಕಸ್ತೂರಿ ಕಳ್ಳಸಾಗಣೆ ಮತ್ತು ಕಾಳಿಮಡ್ಡಿ ಅರಣ್ಯದ ರಕ್ತಸಿಕ್ತ ರಹಸ್ಯಗಳೊಂದಿಗೆ "
            "ಅವನ ಜೀವನವನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ."
        ),
        "author": "Arun Hegde",
        "summary_teaser": (
            "ಮಲೆನಾಡಿನ ಮುಂಗಾರು ಮಳೆಯಲ್ಲಿ ಬೈರಾಪುರ ಶಾಲಾ ಶಿಕ್ಷಕ ವಸಂತ, "
            "ತಂಗಿಯ ಮದುವೆಗಾಗಿ 'ಫೈನಾನ್ಸ್ ಕಾಳಿಂಗ' ಬಳಿ ಸಾಲ ಕೇಳಲು ಹೋಗುತ್ತಾನೆ. "
            "ಒಂದು ಹಳೆಯ ಅಂಬಾಸಿಡರ್ ಕಾರು, ಕಸ್ತೂರಿ ಕಳ್ಳಸಾಗಣೆ ಮತ್ತು "
            "ಕಾಳಿಮಡ್ಡಿ ಅರಣ್ಯದ ರಕ್ತಸಿಕ್ತ ರಹಸ್ಯಗಳು ಅವನ ಸರಳ ಜೀವನವನ್ನು "
            "ಒಂದೇ ರಾತ್ರಿಯಲ್ಲಿ ಬದಲಾಯಿಸುತ್ತವೆ."
        ),
    },
}


def load_relationships(docx: zipfile.ZipFile) -> dict[str, str]:
    rels_xml = docx.read("word/_rels/document.xml.rels").decode("utf-8")
    return {
        match.group(1): match.group(2)
        for match in re.finditer(r'Id="([^"]+)"[^>]*Target="([^"]+)"', rels_xml)
    }


def run_to_markdown(run: ET.Element) -> str:
    text_nodes = run.findall(f"{W}t")
    if not text_nodes:
        return ""

    text = "".join(node.text or "" for node in text_nodes)
    if not text:
        return ""

    r_pr = run.find(f"{W}rPr")
    if r_pr is not None:
        if r_pr.find(f"{W}i") is not None:
            return f"*{text}*"
        if r_pr.find(f"{W}b") is not None:
            return f"**{text}**"

    return text


def paragraph_to_markdown(paragraph: ET.Element) -> str:
    parts: list[str] = []
    for child in paragraph:
        if child.tag == f"{W}r":
            parts.append(run_to_markdown(child))
        elif child.tag == f"{W}hyperlink":
            for run in child.findall(f"{W}r"):
                parts.append(run_to_markdown(run))

    text = "".join(parts).strip()
    text = re.sub(r"\s+", " ", text)
    return fix_drop_caps(text)


def fix_drop_caps(text: str) -> str:
    """Remove Word drop-cap bold markers (single leading bold glyphs)."""
    text = re.sub(r"^\*\*([^*]{1,3})\*\*", r"\1", text)
    text = re.sub(r"\*\*\s*\*\*", "", text)
    return text.strip()


def paragraph_images(paragraph: ET.Element, rels: dict[str, str]) -> list[str]:
    images: list[str] = []
    for blip in paragraph.iter():
        if not blip.tag.endswith("}blip"):
            continue
        embed = blip.get(f"{R}embed")
        if not embed or embed not in rels:
            continue
        filename = rels[embed].split("/")[-1]
        if filename not in images:
            images.append(filename)
    return images


def parse_document(docx_path: Path) -> tuple[list[dict], zipfile.ZipFile]:
    docx = zipfile.ZipFile(docx_path)
    rels = load_relationships(docx)
    root = ET.fromstring(docx.read("word/document.xml"))

    blocks: list[dict] = []
    for paragraph in root.iter(f"{W}p"):
        text = paragraph_to_markdown(paragraph)
        images = paragraph_images(paragraph, rels)
        if text or images:
            blocks.append({"text": text, "images": images})

    return blocks, docx


def image_markdown(slug: str, published_name: str, alt: str = "") -> str:
    label = alt or published_name.replace(".png", "")
    if alt:
        return f"![{alt}](/stories/{slug}/{published_name})"
    return f"![](/stories/{slug}/{published_name})"


def blocks_to_markdown(blocks: list[dict], slug: str, meta: dict) -> str:
    lines: list[str] = []
    cover_done = False
    title_done = False
    last_was_hr = False

    frontmatter = [
        "---",
        f"title: {meta['title']}",
        f"description: {meta['description']}",
        f"cover: /stories/{slug}/image1.png",
        f"slug: {slug}",
        f"path: /stories/{slug}",
        f"author: {meta['author']}",
        "---",
        "",
    ]
    lines.extend(frontmatter)

    for block in blocks:
        text = block["text"]
        images = block["images"]

        # Skip decorative trailing separator text
        if text and re.fullmatch(r"_{10,}", text):
            continue

        unique_images = list(dict.fromkeys(images))

        # Divider-only paragraphs become horizontal rules
        if unique_images and all(img == DIVIDER_IMAGE for img in unique_images) and not text:
            if not last_was_hr:
                lines.extend(["", "---", ""])
                last_was_hr = True
            continue

        if text:
            if not title_done and text == meta["title"]:
                if not cover_done:
                    lines.append(f"![{meta['title']}](/stories/{slug}/image1.png)")
                    lines.append("")
                    cover_done = True
                lines.append(f"# {text}")
                lines.append("")
                title_done = True
                last_was_hr = False
                continue

            if not cover_done and "image1.png" in unique_images:
                lines.append(f"![{meta['title']}](/stories/{slug}/image1.png)")
                lines.append("")
                cover_done = True
                unique_images = [img for img in unique_images if img != "image1.png"]

            lines.append(text)
            lines.append("")
            last_was_hr = False

        for img in unique_images:
            if img in SKIP_IMAGES:
                if img == DIVIDER_IMAGE and not last_was_hr:
                    lines.extend(["", "---", ""])
                    last_was_hr = True
                continue

            published = IMAGE_MAP.get(img)
            if not published:
                continue

            if published == "image1.png" and cover_done:
                continue

            if published == "image1.png":
                lines.append(f"![{meta['title']}](/stories/{slug}/image1.png)")
                cover_done = True
            else:
                lines.append(image_markdown(slug, published))

            lines.append("")
            last_was_hr = False

    # Remove trailing horizontal rule before closing illustration
    while lines and lines[-1] in ("", "---"):
        lines.pop()

    return "\n".join(lines) + "\n"


def summary_markdown(slug: str, meta: dict) -> str:
    return f"""---
title: {meta['title']}
description: {meta['description']}
cover: /stories/{slug}/image1.png
slug: {slug}
path: /stories/{slug}
author: {meta['author']}
category: Fiction
readingTime: "25 min read"
featured: true
date: "2026-08-23"
---

{meta['summary_teaser']}
"""


def extract_images(docx: zipfile.ZipFile, raw_dir: Path) -> None:
    raw_dir.mkdir(parents=True, exist_ok=True)
    for source, target in IMAGE_MAP.items():
        source_path = f"word/media/{source}"
        if source_path not in docx.namelist():
            raise FileNotFoundError(f"Missing media file in docx: {source}")
        shutil.copyfileobj(
            docx.open(source_path),
            (raw_dir / target).open("wb"),
        )


def optimize_images(raw_dir: Path, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for image_path in sorted(raw_dir.glob("*.png")):
        target = output_dir / image_path.name
        shutil.copy2(image_path, target)
        # Resize max dimension to 1200px
        import subprocess

        subprocess.run(
            ["sips", "-Z", "1200", str(target)],
            check=True,
            capture_output=True,
        )

    # Compress with pngquant if available
    import subprocess

    pngquant = shutil.which("pngquant")
    if pngquant:
        for image_path in sorted(output_dir.glob("*.png")):
            subprocess.run(
                [
                    pngquant,
                    "--force",
                    "--quality=65-80",
                    "--output",
                    str(image_path),
                    str(image_path),
                ],
                check=True,
                capture_output=True,
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="Import docx story into Ink")
    parser.add_argument("docx", type=Path, help="Path to source .docx file")
    parser.add_argument("--slug", default="rakta-kastoori", help="Story slug")
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Ink project root",
    )
    parser.add_argument(
        "--skip-optimize",
        action="store_true",
        help="Skip image resize/compress step",
    )
    args = parser.parse_args()

    meta = STORY_META.get(args.slug)
    if not meta:
        raise SystemExit(f"No metadata configured for slug: {args.slug}")

    blocks, docx = parse_document(args.docx)
    try:
        story_md = blocks_to_markdown(blocks, args.slug, meta)
        summary_md = summary_markdown(args.slug, meta)

        story_path = args.root / "content" / "stories" / f"{args.slug}.md"
        summary_path = args.root / "content" / "stories" / "summary" / f"{args.slug}.md"
        raw_dir = args.root / ".tmp" / args.slug / "raw"
        public_dir = args.root / "public" / "stories" / args.slug

        extract_images(docx, raw_dir)

        if args.skip_optimize:
            public_dir.mkdir(parents=True, exist_ok=True)
            for image in raw_dir.glob("*.png"):
                shutil.copy2(image, public_dir / image.name)
        else:
            optimize_images(raw_dir, public_dir)

        story_path.write_text(story_md, encoding="utf-8")
        summary_path.write_text(summary_md, encoding="utf-8")

        print(f"Wrote {story_path}")
        print(f"Wrote {summary_path}")
        print(f"Images in {public_dir}")
        print(f"Blocks parsed: {len(blocks)}")
    finally:
        docx.close()


if __name__ == "__main__":
    main()
