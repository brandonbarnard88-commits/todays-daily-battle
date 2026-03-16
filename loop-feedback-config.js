/**
 * Kids Corner loop feedback — Google Form config.
 * 1. Create form at forms.google.com (see docs/GOOGLE-FORM-SETUP.md)
 * 2. Get viewform URL and entry IDs from a test submission
 * 3. Replace the values below
 * 4. Save — Report mismatch button will open your form with story prefilled
 *
 * Leave as null to use mailto fallback.
 */
(function () {
  'use strict';
  window.LOOP_FEEDBACK_FORM = null;
  /* When ready, replace null with:
  window.LOOP_FEEDBACK_FORM = {
    url: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform',
    storyEntry: 'entry.XXXXXXXXX',
    commentEntry: 'entry.YYYYYYYYY'
  };
  */
})();
