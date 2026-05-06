/**
 * characters-service.js
 *
 * Pure service for loading and querying bible-characters.json.
 * Enables deeper data-driven patterns: relational paths, character-tied devotionals, seasonal "Heroes of Faith" etc.
 * Integrates with daily-battle-core.js and plans-engine.js.
 * Phase 3 of God-Tier Level-Up. Vanilla, offline cache, KJV-focused, no test breakage.
 *
 * Quiet friend at dawn. One concrete step. God-tier quality.
 */

let charactersCache = null;
const CHARACTERS_CACHE_KEY = 'tdb_characters_cache_v1';

function canUseLocalStorage() {
  try {
    const key = '__tdb_ls_probe__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

async function loadCharacters() {
  if (charactersCache) return charactersCache;
  if (canUseLocalStorage()) {
    try {
      const cached = localStorage.getItem(CHARACTERS_CACHE_KEY);
      if (cached) {
        charactersCache = JSON.parse(cached);
        return charactersCache;
      }
    } catch (e) {}
  }
  try {
    const res = await fetch('bible-characters.json');
    if (!res.ok) throw new Error('Failed to load characters');
    charactersCache = await res.json();
    if (canUseLocalStorage()) {
      try { localStorage.setItem(CHARACTERS_CACHE_KEY, JSON.stringify(charactersCache)); } catch (_) {}
    }
    return charactersCache;
  } catch (e) {
    console.warn('Offline—still got you. Using fallback characters.');
    charactersCache = [{ name: 'David', who: 'shepherd king', did: 'faced Goliath with faith', impact: 'trusted God in battle' }];
    return charactersCache;
  }
}

function queryByImpact(keyword) {
  if (!charactersCache) return [];
  const k = (keyword || '').toLowerCase();
  return charactersCache.filter(c => 
    (c.impact && c.impact.toLowerCase().includes(k)) ||
    (c.did && c.did.toLowerCase().includes(k)) ||
    (c.who && c.who.toLowerCase().includes(k))
  );
}

function getSeasonalHeroes(season = 'faith') {
  // Example seasonal/relational paths
  const heroes = {
    faith: ['Abraham', 'David', 'Moses'],
    wilderness: ['Elijah', 'John the Baptist'],
    promise: ['Mary', 'Joseph']
  };
  return heroes[season] || heroes.faith;
}

const charactersService = {
  loadCharacters,
  queryByImpact,
  getSeasonalHeroes,
  getCache: () => charactersCache
};

if (typeof window !== 'undefined') {
  window.charactersService = charactersService;
  // Integrate with core
  if (typeof window.dailyBattleCore !== 'undefined') {
    window.dailyBattleCore.charactersService = charactersService;
  }
}

export default charactersService;
