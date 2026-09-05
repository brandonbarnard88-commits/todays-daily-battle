#!/usr/bin/env python3
"""Bake coloring 'Hear the story' MP3s with a warm male neural voice.

Runtime plays these static files on-device. Nothing is uploaded when a child taps Hear the story.

Voice: en-US-AndrewNeural (warm, conversational male).
Requires: edge-tts (see venv in the generate command).
"""
from __future__ import annotations

import asyncio
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "kids" / "audio" / "coloring"
VOICE = os.environ.get("COLORING_TTS_VOICE", "en-US-AndrewNeural")
RATE = os.environ.get("COLORING_TTS_RATE", "-8%")
PITCH = os.environ.get("COLORING_TTS_PITCH", "-2Hz")

# Color & Tell id → Little Shepherd narration key (same story, already kid-short).
SHEPHERD_MAP = {
    "noah": "noah",
    "david": "david",
    "daniel-lions": "daniel",
    "jesus-children": "jesus",
    "jesus-storm": "jesusCalmsStorm",
    "feeding-5000": "jesusFeeds5000",
    "good-samaritan": "goodSamaritan",
    "lost-sheep": "lostSheep",
    "creation": "creation",
    "empty-tomb": "resurrection",
    "prodigal-son": "prodigalSon",
    "zacchaeus": "zacchaeus",
    "esther": "esther",
    "jonah": "jonah",
    "moses-red-sea": "redSea",
    "nativity": "jesusBirth",
    "paul-shipwreck": "paulShipwreck",
    "rahab-spies": "rahab",
    "jericho": "joshuaJericho",
    "gideon-fleece": "gideon",
    "lazarus": "lazarus",
    "walks-on-water": "jesusWalksWater",
    "good-shepherd": "goodShepherdParable",
    "burning-bush": "mosesBush",
    "ruth-naomi": "ruthBoaz",
    "ruth-boaz": "ruthBoaz",
    "healing-paralytic": "jesusHealsParalytic",
    "triumphal-entry": "palmSunday",
    "the-sower": "parableSower",
    "joseph-coat": "josephCoat",
    "fiery-furnace": "fieryFurnace",
    "naaman": "naaman",
    "boy-samuel": "samuelHears",
    "ten-lepers": "tenLepers",
    "widows-mite": "widowsMite",
    "elisha-oil": "elishaWidow",
    "hannah-samuel": "hannahPrayer",
    "rich-young-ruler": "richYoungRuler",
    "elijah-ravens": "elijahRavens",
    "jesus-baptism": "jesusBaptism",
    "emmaus-road": "emmausRoad",
    "nehemiah-walls": "nehemiah",
    "jesus-tempted": "jesusTemptation",
    "paul-silas-prison": "silasJail",
    "tabitha-dorcas": "tabitha",
    "philip-ethiopian": "philipEthiopian",
}


def extract_stories():
    js = ROOT / "kids" / "color-and-tell.js"
    node = r"""
const fs = require('fs');
const s = fs.readFileSync(process.argv[1], 'utf8');
const start = s.indexOf('var STORIES = ');
if (start < 0) { console.error('STORIES missing'); process.exit(1); }
const i = s.indexOf('[', start);
let depth = 0, end = i;
for (let j = i; j < s.length; j++) {
  if (s[j] === '[') depth++;
  else if (s[j] === ']') { depth--; if (depth === 0) { end = j + 1; break; } }
}
const STORIES = eval(s.slice(i, end));
process.stdout.write(JSON.stringify(STORIES.map(function (st) {
  return {
    id: st.id,
    title: st.title || '',
    verse: st.verse || '',
    idea: st.idea || '',
    scenes: (st.scenes || []).map(function (sc) {
      return { caption: sc.caption || '', verse: sc.verse || '' };
    })
  };
})));
"""
    out = subprocess.check_output(["node", "-e", node, str(js)], cwd=str(ROOT))
    return json.loads(out.decode("utf-8"))


def compose_script(story):
    parts = []
    if story.get("title"):
        parts.append(story["title"].rstrip(".") + ".")
    if story.get("verse"):
        parts.append(re.sub(r"\s+", " ", story["verse"]).strip())
    for sc in story.get("scenes") or []:
        if sc.get("caption"):
            parts.append(re.sub(r"\s+", " ", sc["caption"]).strip())
        if sc.get("verse"):
            parts.append(re.sub(r"\s+", " ", sc["verse"]).strip())
    if story.get("idea"):
        parts.append("One big idea: " + story["idea"].strip())
    return " ".join(parts)


async def synth_one(edge_tts, story_id, text, dest):
    tmp = dest.with_suffix(".part.mp3")
    last_err = None
    for attempt in range(1, 4):
        try:
            if tmp.exists():
                tmp.unlink()
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(str(tmp))
            if tmp.stat().st_size < 4000:
                raise RuntimeError("tiny audio " + str(tmp.stat().st_size))
            tmp.replace(dest)
            kb = dest.stat().st_size // 1024
            print(f"OK {story_id} {kb} KB", flush=True)
            return
        except Exception as err:
            last_err = err
            print(f"RETRY {story_id} ({attempt}) {err}", flush=True)
            await asyncio.sleep(1.5 * attempt)
    raise RuntimeError(f"FAIL {story_id}: {last_err}")


async def main():
    import edge_tts

    shepherd_path = ROOT / "kids" / "data" / "shepherd-narration-tts.json"
    shepherd = json.loads(shepherd_path.read_text(encoding="utf-8")).get("stories") or {}
    listen_path = ROOT / "kids" / "data" / "coloring-listen.json"
    coloring_hear = {}
    if listen_path.exists():
        coloring_hear = json.loads(listen_path.read_text(encoding="utf-8")).get("hear") or {}
    stories = extract_stories()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    argv = [a for a in sys.argv[1:]]
    force = "--force" in argv
    only = set(a for a in argv if not a.startswith("-")) or None
    done = 0
    skipped = 0
    for st in stories:
        sid = st["id"]
        if only and sid not in only:
            continue
        text = ""
        if coloring_hear.get(sid):
            text = str(coloring_hear[sid]).strip()
        if not text:
            key = SHEPHERD_MAP.get(sid)
            if key and shepherd.get(key):
                text = str(shepherd[key]).strip()
        if not text:
            text = compose_script(st)
        if not text:
            print("SKIP empty", sid, flush=True)
            continue
        dest = OUT_DIR / f"{sid}.mp3"
        if dest.exists() and dest.stat().st_size > 8000 and not force:
            skipped += 1
            print(f"HAVE {sid}", flush=True)
            continue
        await synth_one(edge_tts, sid, text, dest)
        done += 1
        await asyncio.sleep(0.35)
    print("coloring human audio: wrote", done, "skipped", skipped, "→", OUT_DIR)


if __name__ == "__main__":
    asyncio.run(main())
