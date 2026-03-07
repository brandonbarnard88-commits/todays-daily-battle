(function () {
  'use strict';

  var MANIFEST_URL = 'story-assets-manifest.json?v=1';
  var cache = null;
  var loadPromise = null;

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9 _-]/g, '');
  }

  function hashText(value) {
    var str = String(value || '');
    var h = 0;
    for (var i = 0; i < str.length; i += 1) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  function getStories(manifest) {
    return Array.isArray(manifest && manifest.stories) ? manifest.stories : [];
  }

  function clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (_) {
      return obj;
    }
  }

  function load() {
    if (cache) return Promise.resolve(cache);
    if (loadPromise) return loadPromise;
    loadPromise = fetch(MANIFEST_URL, { cache: 'no-store' })
      .then(function (res) {
        if (!res || !res.ok) throw new Error('story-manifest-load-failed');
        return res.json();
      })
      .then(function (json) {
        cache = json && typeof json === 'object' ? json : { stories: [] };
        window.dispatchEvent(new CustomEvent('tdb:story-manifest-ready', { detail: { count: getStories(cache).length } }));
        return cache;
      })
      .catch(function () {
        cache = { stories: [] };
        return cache;
      })
      .finally(function () {
        loadPromise = null;
      });
    return loadPromise;
  }

  function getAllStories() {
    return load().then(function (manifest) {
      return clone(getStories(manifest));
    });
  }

  function getStoryByKey(storyKey) {
    var key = normalize(storyKey);
    return load().then(function (manifest) {
      var match = getStories(manifest).find(function (s) { return normalize(s && s.story_key) === key; }) || null;
      return clone(match);
    });
  }

  function filterByTag(tag) {
    var wanted = normalize(tag);
    return load().then(function (manifest) {
      var out = getStories(manifest).filter(function (s) {
        var tags = Array.isArray(s && s.tags) ? s.tags : [];
        return tags.some(function (t) { return normalize(t) === wanted; });
      });
      return clone(out);
    });
  }

  function filterByTheme(themeText) {
    var wanted = normalize(themeText);
    return load().then(function (manifest) {
      var out = getStories(manifest).filter(function (s) {
        return normalize(s && s.battle_theme).indexOf(wanted) !== -1;
      });
      return clone(out);
    });
  }

  function seededPick(list, seedText) {
    if (!Array.isArray(list) || !list.length) return null;
    var idx = hashText(seedText) % list.length;
    return list[idx];
  }

  function pickDaily(options) {
    var opts = options && typeof options === 'object' ? options : {};
    var topic = normalize(opts.topic || opts.tag || '');
    var date = opts.date ? new Date(opts.date) : new Date();
    var dayKey = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
    return load().then(function (manifest) {
      var stories = getStories(manifest);
      var pool = stories;
      if (topic) {
        var byTag = stories.filter(function (s) {
          var tags = Array.isArray(s && s.tags) ? s.tags : [];
          return tags.some(function (t) { return normalize(t) === topic; });
        });
        if (byTag.length) pool = byTag;
      }
      return clone(seededPick(pool, dayKey + '|' + topic));
    });
  }

  function titleOrKey(story) {
    return String((story && (story.title || story.story_key)) || 'Bible Story').trim();
  }

  function refText(story) {
    return String((story && story.reference) || '').trim();
  }

  function joinTags(story) {
    var tags = Array.isArray(story && story.tags) ? story.tags : [];
    return tags.slice(0, 5).join(', ');
  }

  function safeFrame(list, idx, fallback) {
    if (!Array.isArray(list)) return fallback;
    return String(list[idx] || fallback).trim();
  }

  function buildSceneFlow(story) {
    var kf = Array.isArray(story && story.keyframes) ? story.keyframes : [];
    var moment = String((story && story.scene_moment) || '').trim() || 'Key turning-point moment with reverent tension.';
    return [
      '1. Establishing wide: ' + moment,
      '2. Character intent beat: expressions shift toward faith and resolve.',
      '3. Mentor-focus close-up: emotional clarity and reverent confidence.',
      '4. Action build: ' + safeFrame(kf, 0, 'Scene enters motion with clear visual stakes.'),
      '5. Action peak: ' + safeFrame(kf, 1, 'Primary turning point lands with cinematic emphasis.'),
      '6. Resolution beat: ' + safeFrame(kf, 2, 'Hopeful transition prepares final frame.'),
      '7. Faith-forward close: battle theme visualized through posture, light, and calm.',
      '8. End hold (2s): subtle KJV verse flash from ' + (refText(story) || 'scripture reference') + ', loop-friendly finish.'
    ];
  }

  function buildVideoPrompt(story) {
    if (!story || typeof story !== 'object') return '';
    var lines = [];
    lines.push('Generate a 90-120 second Pixar-inspired 3D animated Bible story clip for todaysdailybattle.com.');
    lines.push('Story: ' + titleOrKey(story) + (refText(story) ? ' (' + refText(story) + ')' : '') + '.');
    lines.push('Tone: reverent, hopeful, faith-forward, engaging for kids and adults; no silliness or irreverence.');
    lines.push('Art direction: expressive big eyes, clean readable silhouettes, vibrant but controlled colors, soft cinematic lighting, no modern overlays, no logos, no voice required.');
    lines.push('Character continuity: keep mentor/hero design consistent across shots; animation-ready clarity for SVG scaling.');
    lines.push('Battle theme focus: ' + String(story.battle_theme || 'Faithful obedience') + '.');
    if (joinTags(story)) lines.push('Core tags: ' + joinTags(story) + '.');
    lines.push('');
    lines.push('Scene sequence:');
    buildSceneFlow(story).forEach(function (s) { lines.push(s); });
    lines.push('');
    lines.push('Output constraints: smooth 1.5-2 minute flow, clean lines, tasteful motion, no gore, transparent-background-friendly composition, high detail.');
    lines.push('If generating stills first, generate keyframe sequence.');
    return lines.join('\n');
  }

  function mentorLockLine(mentor) {
    var m = normalize(mentor || '');
    if (m === 'david') return 'Character lock: David is a young olive-skinned shepherd with curly dark hair, humble courage, beige tunic, sling silhouette.';
    if (m === 'moses') return 'Character lock: Moses is an elder prophet with white beard, weathered kindness, staff, and grounded authority posture.';
    if (m === 'esther') return 'Character lock: Esther is regal and courageous with dark wavy hair, refined crown silhouette, and compassionate strength.';
    if (m === 'ruth') return 'Character lock: Ruth is warm and loyal with gentle eyes, harvest-earth palette, and calm resilient presence.';
    if (m === 'paul') return 'Character lock: Paul is steadfast and intense with short dark hair, scarred hands, and grace-shaped resolve.';
    return 'Character lock: keep all primary figures visually consistent across scenes with stable facial structure, clothing silhouette, and emotional arc.';
  }

  function buildCinematicScenes(story) {
    var kf = Array.isArray(story && story.keyframes) ? story.keyframes : [];
    var moment = String((story && story.scene_moment) || '').trim() || 'Key faith-driven turning point unfolds with reverent cinematic momentum.';
    var theme = String((story && story.battle_theme) || 'Faithful courage').trim();
    return [
      'Epic wide establishing shot: ' + moment + ' Slow crane-in with atmospheric depth, soft volumetric light, and grounded emotional tension.',
      'Character intent beat: gentle dolly toward primary faces as expressions shift from uncertainty to faith-led resolve; subtle rack focus between foreground and background stakes.',
      'Intimate close-up: soulful eyes and micro-expressions carry the spiritual decision point; warm rim light and shallow depth-of-field isolate heart posture.',
      'Action build: ' + safeFrame(kf, 0, 'Momentum rises through purposeful movement and visual anticipation.') + ' Use controlled handheld texture for emotional immediacy.',
      'Climactic motion beat: ' + safeFrame(kf, 1, 'Turning-point action lands with cinematic clarity and reverent impact.') + ' Layer dramatic low-angle framing and soft light burst.',
      'Resolution beat: ' + safeFrame(kf, 2, 'Hope breaks through as tension resolves.') + ' Transition palette from contrast to gentle warmth while preserving continuity.',
      'Closing tableau: faith-forward stillness anchored by "' + theme + '" with a loop-friendly 2-second hold, subtle environment motion, and peaceful horizon glow.'
    ];
  }

  function buildMasterStyleBible(story) {
    return [
      'Pixar-quality cinematic 3D Bible short with reverent emotional power: expressive soulful eyes, premium textures, soft rim lighting, subtle film grain, and warm-to-hopeful color arcs.',
      'Camera language stays cinematic throughout: epic establishing wides, slow dolly-ins, intimate close-ups, gentle orbit pans, soft rack focus, and purposeful low-angle reveals.',
      mentorLockLine(story && story.mentor)
    ].join('\n');
  }

  function buildCinematicOverlayTiming(story) {
    var ref = refText(story) || 'Scripture reference';
    return 'Flash at 0:54-0:59 during climax/resolution: subtle KJV verse from ' + ref + '.';
  }

  function buildCinematicEnhancerSuffix() {
    return 'cinematic 4K render, 24fps, shallow depth of field, volumetric god-rays, subtle film grain, polished color grading, premium Pixar-quality character animation';
  }

  function buildCinematicPromptPack(story) {
    if (!story || typeof story !== 'object') return null;
    var scenes = buildCinematicScenes(story);
    var lines = [];
    lines.push('1. Master Style Bible');
    lines.push(buildMasterStyleBible(story));
    lines.push('');
    lines.push('2. Scene Prompts');
    scenes.forEach(function (s, idx) {
      lines.push((idx + 1) + '. ' + s);
    });
    lines.push('');
    lines.push('3. Suggested Subtle KJV Verse Overlay Timing');
    lines.push(buildCinematicOverlayTiming(story));
    lines.push('');
    lines.push('4. Overall Video Prompt Enhancer Suffix');
    lines.push(buildCinematicEnhancerSuffix());
    return {
      story_key: story.story_key,
      title: story.title,
      reference: story.reference,
      master_style_bible: buildMasterStyleBible(story),
      scenes: scenes,
      verse_overlay_timing: buildCinematicOverlayTiming(story),
      enhancer_suffix: buildCinematicEnhancerSuffix(),
      prompt: lines.join('\n')
    };
  }

  function buildVideoPromptByKey(storyKey) {
    return getStoryByKey(storyKey).then(function (story) {
      if (!story) return null;
      return {
        story_key: story.story_key,
        title: story.title,
        reference: story.reference,
        prompt: buildVideoPrompt(story)
      };
    });
  }

  function buildAllVideoPrompts() {
    return getAllStories().then(function (stories) {
      return stories.map(function (story) {
        return {
          id: story.id,
          story_key: story.story_key,
          title: story.title,
          reference: story.reference,
          prompt: buildVideoPrompt(story)
        };
      });
    });
  }

  function buildCinematicPromptByKey(storyKey) {
    return getStoryByKey(storyKey).then(function (story) {
      return buildCinematicPromptPack(story);
    });
  }

  function buildAllCinematicPrompts() {
    return getAllStories().then(function (stories) {
      return stories.map(function (story) {
        var out = buildCinematicPromptPack(story);
        out.id = story.id;
        return out;
      });
    });
  }

  window.TDBStoryManifest = {
    load: load,
    getAllStories: getAllStories,
    getStoryByKey: getStoryByKey,
    filterByTag: filterByTag,
    filterByTheme: filterByTheme,
    pickDaily: pickDaily,
    buildVideoPromptByKey: buildVideoPromptByKey,
    buildAllVideoPrompts: buildAllVideoPrompts,
    buildCinematicPromptByKey: buildCinematicPromptByKey,
    buildAllCinematicPrompts: buildAllCinematicPrompts
  };
})();
