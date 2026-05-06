# Dynamic Load Example (Vanilla JS)

Use this pattern to lazy-load heavy modules only when needed. Reduces initial bundle and improves FCP/LCP.

## Existing pattern: mobius-loop.js

Homepage loads `mobius-loop.js` only when user clicks "Explore Fear → Faith Loop":

```javascript
var trigger = document.getElementById('mobius-loop-trigger');
if (trigger) {
  trigger.addEventListener('click', function () {
    if (document.querySelector('script[src*="mobius-loop.js"]')) return; // already loaded
    var m = document.createElement('script');
    m.src = 'mobius-loop.js';
    m.onload = function () { /* init drawer */ };
    document.head.appendChild(m);
  });
}
```

## For ES modules (future)

If you use `type="module"` and want true dynamic import:

```javascript
// Load on click/tab
async function loadKidsCorner() {
  const { initKidsCorner } = await import('./kids-corner.js');
  initKidsCorner();
}
document.getElementById('kids-corner-link').addEventListener('click', loadKidsCorner);
```

## For vanilla scripts (current stack)

Same pattern as mobius-loop — inject on interaction:

```javascript
function loadHeavyModule(src, onLoad) {
  if (document.querySelector('script[src*="' + src + '"]')) {
    if (onLoad) onLoad();
    return;
  }
  var s = document.createElement('script');
  s.src = trustedScriptURL(src);
  s.onload = onLoad || function () {};
  document.head.appendChild(s);
}

// Example: load bible-tools search only when user opens Bible Tool
document.querySelector('a[href="bible-tool.html"]')?.addEventListener('click', function () {
  loadHeavyModule('bible/bible-tools.js');
});
```

## Candidates for lazy load

| Module | Trigger | Notes |
|--------|---------|-------|
| mobius-loop.js | Click "Explore Fear → Faith Loop" | ✅ Already lazy |
| verse-breakdown.js | First verse breakdown click | ✅ Already lazy |
| easter-eggs.js | Idle or first interaction | ✅ Already lazy |
| kids-corner.js | Navigate to kids/ | Load on kids/index.html only |
| bible-tools.js | Navigate to bible-tool.html | Load on that page only |
| sermon builder | Navigate to sermon.html | Load on that page only |

Tool pages (bible-tool.html, sermon.html, kids/) load their own scripts — no need to load them on homepage. The homepage already keeps initial payload minimal.
