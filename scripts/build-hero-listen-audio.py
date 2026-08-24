#!/usr/bin/env python3
"""Bake Home/Verse Listen MP3s: full KJV line, male neural voice, on-device playback.

Voice matches coloring Hear the story (en-US-AndrewNeural).
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "audio" / "hero-listen"
SCRIPTS = ROOT / "data" / "hero-listen-scripts.json"
VOICE = os.environ.get("COLORING_TTS_VOICE", "en-US-AndrewNeural")
RATE = os.environ.get("COLORING_TTS_RATE", "-8%")
PITCH = os.environ.get("COLORING_TTS_PITCH", "-2Hz")


async def synth_one(edge_tts, slug, spoken, dest):
    tmp = dest.with_suffix(".part.mp3")
    last_err = None
    for attempt in range(1, 4):
        try:
            if tmp.exists():
                tmp.unlink()
            communicate = edge_tts.Communicate(spoken, VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(str(tmp))
            if tmp.stat().st_size < 3000:
                raise RuntimeError("tiny audio " + str(tmp.stat().st_size))
            tmp.replace(dest)
            print(f"OK {slug} {dest.stat().st_size // 1024} KB", flush=True)
            return
        except Exception as err:
            last_err = err
            print(f"RETRY {slug} ({attempt}) {err}", flush=True)
            await asyncio.sleep(1.2 * attempt)
    raise RuntimeError(f"FAIL {slug}: {last_err}")


async def main():
    import edge_tts

    rows = json.loads(SCRIPTS.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    sem = asyncio.Semaphore(4)
    done = 0
    skipped = 0

    async def run(row):
        nonlocal done, skipped
        slug = row["slug"]
        dest = OUT_DIR / f"{slug}.mp3"
        if dest.exists() and dest.stat().st_size > 4000:
            skipped += 1
            return
        spoken = row["ref"] + ". " + row["text"]
        async with sem:
            await synth_one(edge_tts, slug, spoken, dest)
        done += 1
        await asyncio.sleep(0.15)

    jobs = []
    for row in rows:
        if only and row["slug"] not in only:
            continue
        jobs.append(run(row))
    await asyncio.gather(*jobs)
    print("hero listen audio: wrote", done, "skipped", skipped, "→", OUT_DIR)


if __name__ == "__main__":
    asyncio.run(main())
