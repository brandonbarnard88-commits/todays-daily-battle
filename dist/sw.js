// SW entrypoint alias (bump this comment/version to force update checks if needed).
// Keeps registration path simple while reusing the main worker logic.
// version: 20260805-audit-focus-lock (keep aligned with repo SW-VERSION / service-worker CACHE_NAME)
self.importScripts('/service-worker.js?v=20260805-audit-focus-lock');
