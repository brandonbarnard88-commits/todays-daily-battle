#!/usr/bin/env node
/**
 * Rewrite Color & Tell colorPrompt strings to the locked house style.
 * See docs/COLOR-AND-TELL-HOUSE-STYLE.md
 *
 * Usage: node scripts/rewrite-color-prompts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const AVOID =
  'shading, shadows, gradients, gray, grayscale, color, texture, crosshatching, stippling, noise, watermark, text, signature, photorealistic, 3d, realistic, scary, violent, detailed background, small details, thin lines, broken outlines';

const STYLE_CORE =
  'Thick bold consistent black outlines (3–5 px visual weight). Large simple closed shapes for little hands or digital fill. Generous white space. Minimal internal detail — no tiny patterns, no cross-hatching, no texture. Pure black lines only on pure white background. Flat 2D, no perspective tricks. Friendly, warm, peaceful, respectful (never cartoonish, never scary, never irreverent). Centered composition with room for a short KJV verse at the bottom if needed. High contrast, print-ready at 300 DPI, letter size (8.5×11). Technical: no shading, no gray tones, no gradients, no halftone, no soft edges, no color of any kind; no background scenery unless extremely simple and large; closed outlines only (no gaps so flood-fill works); clean edges, no anti-aliased fringes.';

const LITTLES =
  'Age band: Littles (ages 3–6). Extra-thick outlines, very large simple shapes, almost no internal lines, maximum white space, preschool coloring page.';

const OLDER =
  'Age band: Older kids (ages 7–10). Slightly more detail, medium-bold outlines, a few clear internal shapes that are still easy to color, still clean and uncluttered.';

function buildPrompt(subject, age) {
  const ageLine = age === 'older' ? OLDER : LITTLES;
  const subjectClean = String(subject).replace(/\s+/g, ' ').trim().replace(/[.\s]+$/, '');
  return [
    'Black and white coloring book page for Christian children, clean vector-style line art.',
    ageLine,
    `Subject: ${subjectClean}.`,
    `Style: ${STYLE_CORE}`,
    'Mood: calm, gentle, wonder-filled, “Little Shepherd” feel — God’s story is the bright part.',
    `Avoid: ${AVOID}`
  ].join(' ');
}

/** id → { subject, age: 'littles' | 'older' } */
const SCENES = {
  'david-goliath': {
    age: 'older',
    subject:
      'Young David standing bravely with a simple sling, looking up at a large but not terrifying Goliath, both figures clear and bold, minimal background, focus on trusting God'
  },
  'jesus-children': {
    age: 'littles',
    subject:
      'Jesus sitting among several children of different ages, gentle and kind expression, open arms, simple robes, children looking at him with joy, simple hillside or ground under them'
  },
  'good-shepherd': {
    age: 'littles',
    subject:
      'Jesus as the Good Shepherd carrying a little lost lamb in His arms, simple hillside and a quiet stream as large shapes only, focus on being safely found'
  },
  'noah-rainbow': {
    age: 'littles',
    subject:
      'Noah and his family standing on dry ground with the ark as a large simple shape nearby, a clear rainbow outline arching across the sky (line only, no fill), a few gentle animals, focus on God’s faithful promise'
  },
  'feeding-five-thousand': {
    age: 'littles',
    subject:
      'Jesus blessing a small basket of five loaves and two fishes while a few children and families sit nearby on simple ground, focus on Jesus providing for everyone'
  },
  'lost-sheep': {
    age: 'littles',
    subject:
      'The Good Shepherd gently carrying a little lost lamb on His shoulders, a few other sheep as large simple shapes in the distance, simple hillside, focus on being safely found'
  },
  'daniel-lions-den': {
    age: 'littles',
    subject:
      'Daniel kneeling peacefully in prayer while large friendly-looking lions sit calmly around him, simple stone den walls, calm and trusting mood, never scary'
  },
  'seventh-day': {
    age: 'littles',
    subject:
      'A peaceful rest day over finished creation: large simple trees, flowers, a quiet stream, and a smiling child sitting beside a lamb, focus on God resting and blessing the day'
  },
  'jesus-walks-water': {
    age: 'older',
    subject:
      'Jesus standing calmly on simple wave outlines with His hand reaching out to Peter, who is walking toward Him, a boat with a few disciples as large shapes nearby, focus on Jesus saving Peter, never scary'
  },
  'prodigal-son': {
    age: 'older',
    subject:
      'A joyful father running with open arms to welcome his tired younger son on the path home, a simple house as a large shape in the distance, focus on being welcomed back with love'
  },
  'mustard-seed': {
    age: 'littles',
    subject:
      'A small mustard seed in a child’s open hand beside a tall leafy mustard tree with a few birds in the branches, simple field, focus on small things growing big with God'
  },
  'good-samaritan': {
    age: 'older',
    subject:
      'The Good Samaritan gently bandaging the wounded man’s leg beside a simple road, a donkey waiting nearby as a large shape, focus on showing mercy, never graphic or scary'
  },
  zacchaeus: {
    age: 'littles',
    subject:
      'Zacchaeus in a large simple sycamore tree looking down at Jesus, who looks up with a kind smile, a few crowd figures as large shapes below, focus on Jesus calling him by name'
  },
  'lost-coin': {
    age: 'littles',
    subject:
      'A smiling woman on her knees with a lamp beside her, holding a found coin in her open hand, simple room shapes only, focus on finding what was lost'
  },
  'house-on-rock': {
    age: 'older',
    subject:
      'A sturdy house built on a big rock with a happy family inside, simple rain and wind lines around it (house stays strong), a fallen sandy house as a clear large shape nearby, focus on building on Jesus’ words, never scary'
  },
  'the-sower': {
    age: 'older',
    subject:
      'A kind sower scattering seed from a basket into four clear ground patches — path with birds, rocky soil, thorny patch, and good soil with tall shoots — large closed shapes, focus on seed in good ground'
  },
  'pearl-of-great-price': {
    age: 'littles',
    subject:
      'A happy merchant holding up one large pearl in his open hand, bag of coins and other treasures set aside on the ground, minimal background, focus on choosing the one priceless pearl'
  },
  'hidden-treasure': {
    age: 'littles',
    subject:
      'A joyful man kneeling in a field, carefully uncovering a treasure chest, other belongings set aside nearby, simple hillside shapes, focus on discovering something priceless'
  },
  'the-leaven': {
    age: 'littles',
    subject:
      'A gentle woman mixing a small bit of leaven into a large bowl of dough, dough rising in a clear shape, a simple loaf nearby, focus on quiet growth'
  },
  'friend-at-midnight': {
    age: 'littles',
    subject:
      'A man at a closed door holding a lantern, gently knocking, while his friend inside hands out loaves of bread through a window, simple night sky as empty space, focus on a friend helping at midnight'
  },
  'widows-mite': {
    age: 'littles',
    subject:
      'A gentle widow quietly dropping two small coins into a temple treasury box, a couple of rich figures with large bags walking past as big simple shapes, minimal temple shapes, focus on giving with love'
  },
  'persistent-widow': {
    age: 'older',
    subject:
      'A gentle widow standing calmly at the door of a judge’s house, knocking again with a hopeful face, the judge visible inside as a large simple figure, minimal city shapes, focus on not giving up'
  },
  'pharisee-publican': {
    age: 'older',
    subject:
      'Inside a simple temple outline, a proud Pharisee standing tall with hands raised, while a humble publican kneels farther away with head bowed, focus on humble prayer'
  },
  'the-talents': {
    age: 'older',
    subject:
      'A joyful servant standing before his lord, handing over bags of coins while the lord smiles and praises him, minimal road shapes, focus on faithful work'
  },
  'unforgiving-servant': {
    age: 'older',
    subject:
      'A king on a throne kindly forgiving a kneeling servant with hands together; keep the scene gentle and non-violent — focus on mercy received, not harm, calm and reverent'
  },
  'the-two-sons': {
    age: 'older',
    subject:
      'A father speaking kindly to his two sons in a vineyard; one son later working happily among the vines, the other standing still after saying yes, focus on true obedience'
  },
  'the-rich-fool': {
    age: 'older',
    subject:
      'A rich man looking at large simple overflowing barns and fields, with a small simple house nearby, focus on choosing what truly lasts, thoughtful and reverent'
  },
  'ten-virgins': {
    age: 'older',
    subject:
      'Five wise young women with clear lamp outlines standing ready at a closed door as the bridegroom arrives, five other young women with empty lamps as large shapes farther away looking concerned (not terrified), focus on being ready, never scary'
  },
  'sheep-and-goats': {
    age: 'older',
    subject:
      'Jesus as the King with simple sheep shapes on His right and goat shapes on His left, people in the foreground offering food, water, and clothing to someone in need, focus on caring for others as caring for Jesus'
  },
  'vineyard-workers': {
    age: 'older',
    subject:
      'A kind vineyard owner handing the same wage to both early workers and late-arriving workers, grapes and vines as large simple shapes, focus on the owner’s generous goodness'
  },
  'great-banquet': {
    age: 'older',
    subject:
      'A joyful master at a big banquet table with empty seats, while people who need help are gently led in from the street by a servant, focus on the generous invitation'
  },
  'barren-fig-tree': {
    age: 'older',
    subject:
      'A kind man standing beside a fig tree in a vineyard, gently digging around its roots, the tree with a few hopeful leaves and tiny figs beginning to grow, focus on patient care'
  },
  'wedding-feast': {
    age: 'older',
    subject:
      'A joyful king at a wedding feast table with guests in simple robes, one guest standing quietly aside without a wedding garment, focus on being properly prepared for the feast, calm and welcoming'
  },
  'unjust-steward': {
    age: 'older',
    subject:
      'A steward sitting at a table carefully writing on bills while debtors stand nearby with relieved faces, minimal background, focus on careful planning, calm and thoughtful'
  },
  'rich-man-lazarus': {
    age: 'older',
    subject:
      'Lazarus being gently carried by simple angel figures into comfort with Abraham, keep any rich-man figure distant and non-graphic, focus on comfort for the humble, calm compassionate reverent — never scary'
  }
};

/** Extra package-only scenes (not in colorPrompt index block) */
const PACKAGE_EXTRAS = {
  'creation-package.md': {
    age: 'littles',
    subject:
      'Simple scene of Creation: large sun as a simple circle, tall trees with fruit, a few happy animals (lamb, bird, fish) as big closed shapes, and a smiling child in a garden looking up in wonder, focus on God making a beautiful world'
  },
  'noah-package.md': {
    age: 'littles',
    subject:
      'A large wooden ark resting on a mountain after the flood, sun as a simple circle, rainbow as a clear outline arch (line only), Noah and family with happy animal pairs coming down a ramp, calm hopeful reverent, never crowded or scary'
  },
  'abraham-isaac-package.md': {
    age: 'older',
    subject:
      'Abraham and young Isaac walking up a mountain path together carrying wood, a simple stone altar in the distance, a ram caught in a bush by its horns, hills as large shapes only, reverent calm hopeful — never scary'
  },
  'daniel-lions-package.md': {
    age: 'littles',
    subject:
      'Daniel kneeling peacefully in prayer while large friendly-looking lions sit calmly around him, simple stone den walls, calm and trusting mood, never scary'
  },
  'feeding-5000-package.md': {
    age: 'littles',
    subject:
      'Jesus blessing a small basket of five loaves and two fishes while a few children and families sit nearby on simple ground, focus on Jesus providing for everyone'
  },
  'woman-at-well-package.md': {
    age: 'littles',
    subject:
      'Jesus sitting by a well talking kindly to a woman holding a water jar, a bucket and rope on the well, minimal distant shapes, gentle welcoming hopeful mood'
  },
  'jacob-ladder-package.md': {
    age: 'littles',
    subject:
      'A young man sleeping on the ground with a stone for a pillow, a tall ladder from the ground into the sky with simple angels going up and down, hills as large shapes only, peaceful holy hopeful mood'
  },
  'silas-paul-singing-package.md': {
    age: 'littles',
    subject:
      'Paul and Silas sitting together in a simple jail cell, singing with happy faces, chains as large clear shapes only, empty night sky as white space, focus on friends praising God together'
  }
};

function escapeJsString(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function rewriteIndex() {
  const file = path.join(root, 'kids/bible-story-tool-index.js');
  let src = fs.readFileSync(file, 'utf8');

  // Remove duplicate entries (second copies of four stories)
  const dupIds = ['the-sower', 'pearl-of-great-price', 'persistent-widow', 'pharisee-publican'];
  for (const id of dupIds) {
    const re = new RegExp(
      `,\\s*\\{\\s*id:\\s*"${id}"[\\s\\S]*?flow:\\s*"[^"]*"\\s*\\}`,
      'g'
    );
    const matches = [...src.matchAll(re)];
    if (matches.length >= 2) {
      // Remove the last match (duplicate)
      const last = matches[matches.length - 1];
      src = src.slice(0, last.index) + src.slice(last.index + last[0].length);
    }
  }

  let replaced = 0;
  for (const [id, meta] of Object.entries(SCENES)) {
    const prompt = buildPrompt(meta.subject, meta.age);
    const re = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?colorPrompt:\\s*")(?:\\\\.|[^"\\\\])*(")`);
    if (!re.test(src)) {
      console.warn('Missing colorPrompt for', id);
      continue;
    }
    src = src.replace(re, `$1${escapeJsString(prompt)}$2`);
    replaced += 1;
  }

  fs.writeFileSync(file, src);
  console.log(`Updated ${replaced} colorPrompts in bible-story-tool-index.js`);

  // Verify unique ids with colorPrompt
  const ids = [...src.matchAll(/id:\s*"([^"]+)"[\s\S]*?colorPrompt:/g)].map((m) => m[1]);
  const counts = {};
  ids.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });
  const stillDupes = Object.entries(counts).filter(([, c]) => c > 1);
  if (stillDupes.length) {
    console.warn('Still duplicate colorPrompt ids:', stillDupes);
  } else {
    console.log(`Unique colorPrompt stories: ${ids.length}`);
  }
}

function packageIdFromFilename(name) {
  // david-goliath-package.md → david-goliath
  return name.replace(/-package\.md$/, '');
}

function rewritePackages() {
  const dir = path.join(root, 'kids/stories');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('-package.md'));
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const full = path.join(dir, file);
    let text = fs.readFileSync(full, 'utf8');
    const hasColorSection =
      /## Coloring Page Prompt/i.test(text) ||
      /## Coloring Prompt/i.test(text) ||
      /Create one simple black-and-white/i.test(text) ||
      /Simple(?:, warm)? black-and-white line[- ]art/i.test(text) ||
      /\[Paste the coloring prompt\]/i.test(text) ||
      /\[One peaceful coloring scene/i.test(text);
    if (!hasColorSection) {
      skipped += 1;
      continue;
    }

    const id = packageIdFromFilename(file);
    let meta = SCENES[id] || null;

    // Alias filenames
    const aliases = {
      'feeding-5000-package.md': 'feeding-five-thousand',
      'daniel-lions-package.md': 'daniel-lions-den',
      'noah-package.md': 'noah-rainbow',
      'sower-package.md': 'the-sower',
      'the-sower-package.md': 'the-sower'
    };
    if (!meta && aliases[file] && SCENES[aliases[file]]) {
      meta = SCENES[aliases[file]];
    }
    if (!meta && PACKAGE_EXTRAS[file]) {
      meta = PACKAGE_EXTRAS[file];
    }

    if (!meta) {
      // If it has an old-style prompt, upgrade generically from existing subject sentence
      const oldMatch = text.match(
        /Create one simple black-and-white line-art coloring page[^\n]*/
      );
      if (!oldMatch) {
        skipped += 1;
        continue;
      }
      // Extract scene after "Peaceful scene:" / "Joyful scene:" etc.
      const sceneMatch = oldMatch[0].match(
        /(?:Peaceful and courageous|Peaceful|Joyful|Courageous) scene:\s*(.+?)(?:\.\s*Focus|\.\s*Calm|\.\s*Peaceful|\.\s*Joyful|$)/i
      );
      const subject = sceneMatch
        ? sceneMatch[1]
            .replace(/\bsoft\b/gi, 'simple')
            .replace(/\bgreen\b/gi, '')
            .replace(/\bbright\b/gi, 'clear')
            .replace(/\s+/g, ' ')
            .trim()
        : 'A calm Bible story moment with large simple closed shapes, minimal background, peaceful and reverent';
      meta = { age: 'littles', subject };
    }

    const prompt = buildPrompt(meta.subject, meta.age);

    if (/## Coloring Page Prompt/i.test(text)) {
      text = text.replace(
        /(## Coloring Page Prompt[^\n]*\s*\n\n)([\s\S]*?)(?=\n\*\*Existing|\n---|\n## )/,
        `$1${prompt}\n\n`
      );
    } else if (/## Coloring Prompt/i.test(text)) {
      text = text.replace(
        /(## Coloring Prompt\s*\n)([\s\S]*?)(?=\n## |\n\*\*)/,
        `$1${prompt}\n\n`
      );
    } else if (/Create one simple black-and-white[^\n]*/.test(text)) {
      text = text.replace(/Create one simple black-and-white[^\n]*/, prompt);
    } else if (/Simple(?:, warm)? black-and-white line[- ]art[^\n]*/i.test(text)) {
      text = text.replace(/Simple(?:, warm)? black-and-white line[- ]art[^\n]*/i, prompt);
    }

    // Placeholder lines
    if (/\[Paste the coloring prompt\]/i.test(text)) {
      text = text.replace(/\[Paste the coloring prompt\]/i, prompt);
    }
    if (/\[One peaceful coloring scene[^\]]*\]/i.test(text)) {
      text = text.replace(/\[One peaceful coloring scene[^\]]*\]/i, prompt);
    }

    fs.writeFileSync(full, text);
    updated += 1;
  }

  console.log(`Updated ${updated} package.md coloring prompts (skipped ${skipped})`);
}

rewriteIndex();
rewritePackages();
console.log('Done. House style: docs/COLOR-AND-TELL-HOUSE-STYLE.md');
