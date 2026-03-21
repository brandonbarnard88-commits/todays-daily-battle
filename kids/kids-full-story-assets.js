/**
 * Full-length Bible story videos (MP4/WebM) + WebVTT read-along captions.
 * Add one entry per story key (same keys as TDB_BIBLE_STORIES in kids-battle.js).
 *
 * Paths are site-root absolute. Ship files under /media/kids-stories/ (see docs/KIDS-FULL-STORY-MEDIA.md).
 */
(function (global) {
  'use strict';

  /**
   * @typedef {Object} KidsFullStoryMedia
   * @property {string} [mp4]  H.264 MP4 (primary for Safari/iOS)
   * @property {string} [webm] VP9/WebM (optional second source)
   * @property {string} [captionsVtt] WebVTT read-along (subtitles track)
   * @property {string} [poster]   Poster image URL (optional)
   */

  /** @type {Object.<string, KidsFullStoryMedia>} */
  var FULL_STORY_MEDIA = {
    /* Example (uncomment when files exist):
    david: {
      mp4: '/media/kids-stories/david-goliath.mp4',
      webm: '/media/kids-stories/david-goliath.webm',
      captionsVtt: '/media/kids-stories/david-goliath.vtt',
      poster: '/kids/panel-david-1.svg'
    },
    noah: {
      mp4: '/media/kids-stories/noah-ark.mp4',
      captionsVtt: '/media/kids-stories/noah-ark.vtt',
      poster: '/kids/panel-noah-1.svg'
    }
    */
  };

  global.TDB_KIDS_FULL_STORY_MEDIA = FULL_STORY_MEDIA;

  /**
   * @param {string} storyKey
   * @returns {KidsFullStoryMedia|null}
   */
  global.getKidsFullStoryMedia = function (storyKey) {
    var k = String(storyKey || '').trim();
    if (!k || !FULL_STORY_MEDIA[k]) return null;
    var o = FULL_STORY_MEDIA[k];
    if (!o || typeof o !== 'object') return null;
    if (!o.mp4 && !o.webm) return null;
    return o;
  };
})(typeof window !== 'undefined' ? window : this);
