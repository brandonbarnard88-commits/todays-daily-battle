/**
 * Shared Battle Plan progress helper (My Study MS3 + export + Progress stub).
 * Scans all tdb-plan-*-day keys — not a narrow hardcoded allowlist.
 */
(function (global) {
  'use strict';

  var PLAN_LABEL_MAP = {
    battle: 'Battle Distraction (7 days)',
    gratitude: 'Gratitude (7 days)',
    simplethanks: 'Simple Thanks — Seven Gentle Days (7 days)',
    steadydays: 'Steady Days — Five Gentle Steps (5 days)',
    'steadydays-kids': 'Steady Days for Families (5 days)',
    giftsfromabove: 'Gifts from the Father of Lights (5 days)',
    strength: '30-Day Strength',
    marriage: 'Marriage (7 days)',
    peace: '7-Day Peace',
    trust: 'Worry to Trust (7 days)',
    universitywaiting: 'The University of Waiting (6 days)',
    universitygrief: 'The University of Grief (6 days)',
    universityparenting: 'The University of Parenting Young Kids (21 days)',
    universitysecretprayer: 'The University of Secret Prayer (6 days)',
    universityanxiety: 'The University of Anxiety & Fear (7 days)',
    universityexhaustion: 'The University of Exhaustion (21 days)',
    universitygratitude: 'The University of Gratitude (6 days)',
    universityloneliness: 'The University of Loneliness (21 days)',
    universityforgiveness: 'The University of Forgiveness (6 days)',
    universitydoubt: 'The University of Doubt (6 days)',
    universitybitterness: 'The University of Bitterness (6 days)',
    eveninguog: 'Evening in the University — Family (4 days)',
    universitybroken: 'The University of Broken Relationships (21 days)',
    universitycomparison: 'The University of Comparison & Contentment (6 days)',
    universityanger: 'The University of Anger (6 days)',
    universityregret: 'The University of Regret (21 days)',
    universityoverwhelm: 'The University of Overwhelm (21 days)',
    universitycontentment: 'The University of Contentment in Small Seasons (6 days)',
    universityparentfear: 'The University of Fear for My Children (28 days)',
    fearfaith: 'Fear to Faith (7 days)',
    worrytrust: 'Worry to Trust (7 days)',
    psalmscomfort: 'Psalms of Comfort (7 days)',
    heavyhope: 'The University of Depression & Hopelessness (7 days)',
    heartalone: 'When the Heart Feels Alone (7 days)',
    littlehearts: 'When Little Hearts Feel Big Fear (7 days)',
    restlessnights: 'Peace for Restless Nights (7 days)',
    wearyhands: 'Grace for Weary Hands (7 days)',
    longheavydays: 'When the Days Feel Long and Heavy (7 days)',
    preachingthroughexhaustion: 'Preaching Through Exhaustion (7 days)',
    smallchurchencouragement: 'Small Church Encouragement (7 days)',
    hopeuncertain: 'Hope in Uncertainty (7 days)',
    moneyworry: 'Financial Stress & Provision (7 days)',
    addictionhope: 'Addiction & Strongholds (7 days)',
    guiltshame: 'Guilt & Shame (7 days)',
    shamelift: 'Lifted from Shame (7 days)',
    overwhelmedburnout: 'Overwhelmed / Burnout (7 days)',
    selfworth: 'Self-Worth / Identity (7 days)',
    caregiverrest: 'Caregiver Rest (7 days)',
    familyworship: 'Family Worship in the Trenches (7 days)',
    psalmscomfortfamily: 'Psalms of Comfort — Family Edition (7 days)',
    galatiansfreedom: 'Galatians: Freedom in Christ (7 days)',
    gospeljohn: 'Gospel of John Sampler (7 days)',
    firststeps: 'New Believer — First Steps (14 days)',
    griefhope: 'Grief → Hope (7 days)',
    grief: 'Healing from Grief & Loss (7 days)',
    painwontquit: "When Pain Won't Quit (7 days)",
    cancercomfort: 'Cancer Comfort (7 days)',
    longillness: 'Long Illness — Steady Mercies (7 days)',
    sufferendure: 'Suffering & Endurance (7 days)',
    anxiety7: 'Anxiety — Steady Peace (7 days)',
    fearnot14: 'Fear Not — 14 Days',
    anger: 'Anger Release (7 days)',
    forgiveness: 'Forgiveness (7 days)',
    lettinggo: 'Bitterness & Letting Go (7 days)',
    dailylabor: 'Work & Daily Labor (7 days)',
    stewardship: 'Stewardship — Contentment & Giving (7 days)',
    identityinchrist: 'Who God Says You Are (7 days)',
    armorofgod: 'Armor of God — Daily Battle (7 days)',
    standfirm: 'Stand Firm — Temptation (7 days)',
    holyspirit: 'Holy Spirit — Comforter & Walk (7 days)',
    walktheword: 'Walk the Word — Hear & Do (7 days)',
    sower: 'Parable of the Sower (7 days)',
    greatcommission: 'Great Commission — Witness (7 days)',
    adventquiet: 'Advent Quiet (7 days)',
    christmas7: 'Christmas Week — Christ the Light (7 days)',
    newyear7: 'New Year Week (7 days)',
    gentleyear: 'Gentle New Year Reset (7 days)',
    easter: 'Resurrection Hope (7 days)',
    aftereaster: 'After Easter — Quiet Mondays (7 days)',
    schoolcourage: 'Back-to-School Courage (7 days)',
    harvestthanks: 'Harvest Gratitude (7 days)',
    summerstill: 'Summer Stillness (7 days)',
    summertimesadness: 'Summertime Sadness (7 days)',
    summergrief: 'When Grief Feels Heavy in Summer (7 days)',
    backtoschoolfear: 'Back-to-School Fear (7 days)',
    longdayslittle: 'Long Days with Little Ones (7 days)',
    praisethanks30: '30-Day Praise & Thanksgiving',
    dailyrenewing: 'Daily Renewing of the Inner Man (7 days)',
    quietfallharvest: 'Quiet Fall Harvest (5 days)',
    latefallwinter: 'Late Fall, Quiet Winter (7 days)',
    parenting: 'Parenting (7 days)',
    reading: '7-Day Reading Plan',
    doubtassurance: 'From Doubt to Assurance (7 days)',
    latesummerrest: 'Late Summer, Early Rest (5 days)',
    beatitudeskids: 'Beatitudes for Kids (8 days)',
    loneliness: '7-Day Victory Over Loneliness',
    angerpeace: 'Anger → Peace (7 days)',
    battle10: '10-Day Battle',
    battle14: '14-Day Battle',
    battle21: '21-Day Battle',
    battle30: '30-Day Battle',
    battle40: '40-Day Wilderness'
  };

  function parseDayRaw(raw) {
    if (!raw) return 0;
    var day = 0;
    try {
      var parsed = JSON.parse(raw);
      day =
        parsed && typeof parsed === 'object' && typeof parsed.day === 'number'
          ? parsed.day
          : parseInt(raw, 10);
    } catch (_) {
      day = parseInt(raw, 10);
    }
    return isNaN(day) ? 0 : day;
  }

  function planIdFromDayKey(lsKey) {
    if (lsKey === 'tdb-plan-day') return 'battle';
    var m = String(lsKey || '').match(/^tdb-plan-(.+)-day$/);
    return m ? m[1] : null;
  }

  function dayKeyForPlanId(planId) {
    if (planId === 'battle') return 'tdb-plan-day';
    return 'tdb-plan-' + planId + '-day';
  }

  function guessMaxFromLabel(label) {
    var m = String(label || '').match(/\((\d+)\s*days?\)/i);
    if (m) return parseInt(m[1], 10) || 0;
    m = String(label || '').match(/(\d+)-Day/i);
    if (m) return parseInt(m[1], 10) || 0;
    return 0;
  }

  function resolvePlanMeta(planId) {
    if (!planId) return null;
    var id = String(planId);
    var key = dayKeyForPlanId(id);
    var day = 0;
    try {
      day = parseDayRaw(localStorage.getItem(key));
    } catch (_) {
      day = 0;
    }
    var label = PLAN_LABEL_MAP[id] || '';
    var max = guessMaxFromLabel(label);
    try {
      var storedMax = parseInt(localStorage.getItem('tdb-plan-' + id + '-max') || '0', 10);
      if (!isNaN(storedMax) && storedMax > 0) max = storedMax;
    } catch (_) { /* non-fatal */ }
    try {
      var storedLabel = localStorage.getItem('tdb-plan-' + id + '-label');
      if (storedLabel && String(storedLabel).trim()) label = String(storedLabel).trim();
    } catch (_) { /* non-fatal */ }
    if (!max || max < 1) max = 7;
    if (!label) label = 'Plan: ' + id;
    day = Math.min(Math.max(day, 0), max);
    return {
      planId: id,
      day: day,
      max: max,
      label: label,
      key: key,
      percent: max > 0 ? Math.round((day / max) * 100) : 0
    };
  }

  function scanPlanIds() {
    var ids = [];
    var seen = Object.create(null);
    function add(id) {
      if (!id || seen[id]) return;
      seen[id] = true;
      ids.push(id);
    }
    try {
      var i;
      for (i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k) continue;
        var id = planIdFromDayKey(k);
        if (id) add(id);
      }
    } catch (_) { /* non-fatal */ }
    Object.keys(PLAN_LABEL_MAP).forEach(add);
    return ids;
  }

  function listAllWithProgress() {
    return scanPlanIds()
      .map(resolvePlanMeta)
      .filter(function (m) {
        return m && m.day > 0;
      })
      .sort(function (a, b) {
        return b.day - a.day;
      });
  }

  function partitionActiveCompleted() {
    var active = [];
    var completed = [];
    listAllWithProgress().forEach(function (m) {
      if (m.day >= m.max) completed.push(m);
      else active.push(m);
    });
    return { active: active, completed: completed };
  }

  /** Export-compatible rows: { label, day, key } */
  function gatherForExport() {
    return listAllWithProgress().map(function (m) {
      return { label: m.label, day: m.day, key: m.key, planId: m.planId, max: m.max };
    });
  }

  function faithLoopLine(parts) {
    var active = (parts && parts.active) || [];
    var completed = (parts && parts.completed) || [];
    if (active.length > 0) {
      var p0 = active[0];
      return (
        "You're on day " +
        p0.day +
        ' of ' +
        p0.max +
        ' in ' +
        p0.label +
        ' — stay at your own pace; you can rest, loop back, or walk it again anytime.'
      );
    }
    if (completed.length > 0) {
      return "No active plan right now — you've already finished a full lane. When you want that slow rhythm again, start fresh on the plans page; there's room to breathe here.";
    }
    return "No plan progress on this device yet — when you're ready for a day-by-day lane, open Plans; your checkmarks will gather here, quietly.";
  }

  global.TDBPlanProgress = {
    PLAN_LABEL_MAP: PLAN_LABEL_MAP,
    parseDayRaw: parseDayRaw,
    resolvePlanMeta: resolvePlanMeta,
    scanPlanIds: scanPlanIds,
    listAllWithProgress: listAllWithProgress,
    partitionActiveCompleted: partitionActiveCompleted,
    gatherForExport: gatherForExport,
    faithLoopLine: faithLoopLine
  };
})(typeof window !== 'undefined' ? window : globalThis);
