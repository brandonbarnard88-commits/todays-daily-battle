/**
 * Homepage: calm 3-step "Start My Day" (verse → feeling → plan).
 * KJV-only; no duplicate handlers on #feel-search (standalone).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "tdb_start_my_day_v1";
  var DIALOG_ID = "tdbStartMyDayDialog";
  var dialog = null;
  var currentStep = 1;
  var selected = null;

  /**
   * Keyed by feeling label. `planSlug` is the real `?plan=` id (use in Start URL).
   * (Labels like “fear-anxiety” or “strength-weariness” are not site routes; we map to peace, wearyhands, …)
   * Step 3: Battle Plan: title (7 Days) · Day day – “verse” (ref) · then plain/action below.
   */
  var dayOneMap = {
    "Anxious or worried": {
      planSlug: "peace",
      title: "Fear and Anxiety",
      day: 1,
      verse:
        "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you.",
      ref: "John 14:27",
      plain: "The world's peace depends on everything going right. His doesn't.",
      action:
        'Say: "I receive Your peace. Not circumstances—You." Then be still for 5 minutes.',
    },
    "Tired or discouraged": {
      planSlug: "wearyhands",
      title: "Strength and Weariness",
      day: 1,
      verse:
        "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.",
      ref: "Isaiah 40:31",
      plain:
        "Waiting on the Lord is not doing nothing—He renews what you cannot manufacture on your own.",
      action:
        "Write down one way you will wait on Him today instead of white-knuckling the next step.",
    },
    "Angry or frustrated": {
      planSlug: "angerpeace",
      title: "Anger and Frustration",
      day: 1,
      verse:
        "Be ye angry, and sin not: let not the sun go down upon your wrath.",
      ref: "Ephesians 4:26",
      plain:
        "You may feel the heat; you do not have to let it set the full schedule. Deal honestly before the day is gone.",
      action:
        "Name what happened in one sentence to God, then name one small repair you can make before bed.",
    },
    "Grieving or sad": {
      planSlug: "grief",
      title: "Healing from Grief",
      day: 1,
      verse:
        "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
      ref: "Psalm 34:18",
      plain: "God draws near to the brokenhearted. He doesn't stand back.",
      action: "Let Him come near. Don't push Him away. Sit with Him.",
    },
    "Struggling as a parent": {
      planSlug: "parenting",
      title: "Parenting with Wisdom",
      day: 1,
      verse: "Train up a child in the way he should go: and when he is old, he will not depart from it.",
      ref: "Proverbs 22:6",
      plain: "Training is now. The fruit is later. Don't give up.",
      action: "Do one thing today that trains them in the way they should go.",
    },
    "Fearful about the future": {
      planSlug: "worrytrust",
      title: "Worry to Trust",
      day: 1,
      verse:
        "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself.",
      ref: "Matthew 6:34",
      plain:
        "Borrowing all of next week’s fear today only empties you for the obedience God gave you for this day alone.",
      action:
        'Name tomorrow’s fear out loud, then hand it to God: "I will obey You for what You gave me—today only."',
    },
    "Needing peace": {
      planSlug: "peace",
      title: "Finding Peace",
      day: 1,
      verse:
        "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
      ref: "Isaiah 26:3",
      plain: "Perfect peace is tied to a stayed mind—anchored in Him, not in the scoreboard.",
      action: "Set a 3-minute timer: breathe, say His name, and return your thoughts to Him when they run.",
    },
    "Thankful / wanting to grow": {
      planSlug: "gratitude",
      title: "Gratitude and Growth",
      day: 1,
      verse: "In every thing give thanks: for this is the will of God in Christ Jesus concerning you.",
      ref: "1 Thessalonians 5:18",
      plain: "Not for everything — in everything. That's the difference.",
      action: "Name three specific things — not generic. Real ones. Write them down.",
    },
  };

  var FEELINGS = [
    {
      id: "anxious",
      label: "Anxious or worried",
      plan: "peace",
      planTitle: "7-Day Peace",
      planDays: 7,
      oneLine: "When your mind won’t stop, His peace is not the same as easy circumstances.",
    },
    {
      id: "tired",
      label: "Tired or discouraged",
      plan: "wearyhands",
      planTitle: "Grace for Weary Hands",
      planDays: 7,
      oneLine: "For seasons when you’re poured out and still need bread from heaven.",
    },
    {
      id: "angry",
      label: "Angry or frustrated",
      plan: "angerpeace",
      planTitle: "Anger → Peace",
      planDays: 7,
      oneLine: "Honest steps toward peace when emotions run hot.",
    },
    {
      id: "grieving",
      label: "Grieving or sad",
      plan: "grief",
      planTitle: "7-Day Healing from Grief & Loss",
      planDays: 7,
      oneLine: "Comfort in mourning—God’s nearness without rushing you to “move on.”",
    },
    {
      id: "parenting",
      label: "Struggling as a parent",
      plan: "parenting",
      planTitle: "Parenting",
      planDays: 7,
      oneLine: "For long days and little hearts—one verse-sized step a day.",
    },
    {
      id: "fearful",
      label: "Fearful about the future",
      plan: "worrytrust",
      planTitle: "Worry to Trust",
      planDays: 7,
      oneLine: "When tomorrow won’t stay in tomorrow, Scripture brings you back to today with Him.",
    },
    {
      id: "peace",
      label: "Needing peace",
      plan: "peace",
      planTitle: "7-Day Peace",
      planDays: 7,
      oneLine: "A slower pace with Christ—seven short stops in the KJV.",
    },
    {
      id: "thankful",
      label: "Thankful / wanting to grow",
      plan: "gratitude",
      planTitle: "Gratitude",
      planDays: 7,
      oneLine: "Turning your heart toward thanks—without rushing past hard truth.",
    },
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function track(ev, params) {
    try {
      if (typeof window.trackEvent === "function") {
        window.trackEvent(ev, params || {});
      }
    } catch (e) {}
  }

  function getHeroVerseBlock() {
    var ref = byId("heroRef");
    var verse = byId("heroVerse");
    var refT = ref ? ref.textContent.replace(/\s+/g, " ").trim() : "Today’s verse (KJV)";
    var verseT = verse ? verse.textContent.replace(/\s+/g, " ").trim() : "";
    return { ref: refT, text: verseT };
  }

  function hydrateStep1() {
    var block = getHeroVerseBlock();
    var refEl = byId("tdbSmdStep1Ref");
    var textEl = byId("tdbSmdStep1Text");
    var refPlain = block.ref.replace(/\s*\(KJV\)\s*$/i, "").replace(/\s+/g, " ").trim();
    var inner = block.text ? block.text.replace(/^["'\u201c]+|["'\u201d]+$/g, "").replace(/\s+/g, " ").trim() : "";
    if (inner && typeof window.__TDB_repairMatthew514ByRef === "function") {
      inner = window.__TDB_repairMatthew514ByRef(refPlain, inner);
    }
    if (refEl) refEl.textContent = block.ref;
    if (textEl) {
      if (inner) {
        textEl.textContent = "\u201c" + inner + "\u201d";
      } else {
        textEl.textContent = "Read today’s verse above, slowly.";
      }
    }
  }

  function setStep(n) {
    currentStep = n;
    var panels = document.querySelectorAll(".tdb-smd-step");
    for (var i = 0; i < panels.length; i++) {
      var p = panels[i];
      var step = parseInt(p.getAttribute("data-smd-step"), 10);
      p.hidden = step !== n;
    }
    var dots = document.querySelectorAll(".tdb-smd-dot");
    for (var j = 0; j < dots.length; j++) {
      dots[j].setAttribute("aria-current", j + 1 === n ? "step" : "false");
    }
    if (n === 1) hydrateStep1();
    if (n === 3 && selected) hydrateStep3();
    var dlg = byId(DIALOG_ID);
    if (dlg) {
      var h = n === 1 ? "tdbSmdH1" : n === 2 ? "tdbSmdH2" : "tdbSmdH3";
      dlg.setAttribute("aria-labelledby", h);
    }
  }

  function hydrateStep3() {
    if (!selected) return;
    var m = dayOneMap[selected.label];
    if (m && m.planSlug !== selected.plan) m = null;

    var t = byId("tdbSmdChoice");
    var pt = byId("tdbSmdPlanTitle");
    var sub = byId("tdbSmdPlanSub");
    if (t) t.textContent = "You chose “" + selected.label + "”";
    if (pt) {
      var battle = m && m.title ? m.title : selected.planTitle;
      pt.textContent =
        "Battle Plan: " +
        battle +
        " (" +
        selected.planDays +
        " Days)";
    }
    if (sub) sub.textContent = selected.oneLine;

    var block = byId("tdbSmdDay1");
    var h = byId("tdbSmdDay1Heading");
    var v = byId("tdbSmdDay1Verse");
    var r = byId("tdbSmdDay1RefKjv");
    var pl = byId("tdbSmdDay1Plain");
    var nx = byId("tdbSmdDay1Next");
    if (!m || !m.verse) {
      if (block) block.hidden = true;
      if (v) v.hidden = false;
      if (r) r.hidden = false;
      return;
    }
    if (block) block.hidden = false;
    var dn = m.day > 0 ? m.day : 1;
    if (h) {
      h.textContent =
        "Day " + dn + " – “" + m.verse + "” (" + m.ref + ")";
    }
    if (v) {
      v.textContent = "";
      v.hidden = true;
    }
    if (r) {
      r.textContent = "";
      r.hidden = true;
    }
    if (pl) pl.textContent = m.plain;
    if (nx) {
      nx.textContent = "";
      var strong = document.createElement("strong");
      strong.textContent = "Next step: ";
      nx.appendChild(strong);
      nx.appendChild(document.createTextNode(m.action));
    }
  }

  function openDialog() {
    dialog = byId(DIALOG_ID);
    if (!dialog) return;
    selected = null;
    hydrateStep1();
    setStep(1);
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    var next1 = byId("tdbSmdToStep2");
    if (next1) next1.focus();
    else {
      var closeBtn = byId("tdbSmdClose");
      if (closeBtn) closeBtn.focus();
    }
    track("start_my_day_open", { source: "home" });
  }

  function closeDialog() {
    if (!dialog) dialog = byId(DIALOG_ID);
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    track("start_my_day_close", { at_step: currentStep });
  }

  function wire() {
    var openBtn = byId("tdbStartMyDayBtn");
    if (!openBtn || !byId(DIALOG_ID)) return;

    openBtn.addEventListener("click", function () {
      openDialog();
    });

    var closeBtn = byId("tdbSmdClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeDialog();
      });
    }

    byId("tdbSmdReadAgain") &&
      byId("tdbSmdReadAgain").addEventListener("click", function () {
        var wrap = byId("hero-verse-wrap");
        if (wrap) {
          wrap.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        var verse = byId("heroVerse");
        if (verse) {
          verse.classList.add("tdb-smd-verse-pulse");
          setTimeout(function () {
            verse.classList.remove("tdb-smd-verse-pulse");
          }, 1200);
        }
      });

    byId("tdbSmdToStep2") &&
      byId("tdbSmdToStep2").addEventListener("click", function () {
        setStep(2);
        track("start_my_day_step", { step: 2 });
      });

    byId("tdbSmdBack1") &&
      byId("tdbSmdBack1").addEventListener("click", function () {
        setStep(1);
      });

    byId("tdbSmdBack2") &&
      byId("tdbSmdBack2").addEventListener("click", function () {
        setStep(2);
      });

    var grid = byId("tdbSmdFeelGrid");
    if (grid) {
      grid.addEventListener("click", function (e) {
        var card = e.target && e.target.closest && e.target.closest("button[data-smd-feel]");
        if (!card) return;
        var id = card.getAttribute("data-smd-feel");
        selected = null;
        for (var i = 0; i < FEELINGS.length; i++) {
          if (FEELINGS[i].id === id) {
            selected = FEELINGS[i];
            break;
          }
        }
        if (!selected) return;
        setStep(3);
        track("start_my_day_feeling", { feeling_id: id, plan: selected.plan });
      });
    }

    byId("tdbSmdStartPlan") &&
      byId("tdbSmdStartPlan").addEventListener("click", function () {
        if (!selected) return;
        var dm = dayOneMap[selected.label];
        var planSlug =
          dm && dm.planSlug === selected.plan && dm.planSlug
            ? dm.planSlug
            : selected.plan;
        var startDay = dm && dm.day > 0 ? dm.day : 1;
        var payload = {
          at: new Date().toISOString(),
          feeling: selected.id,
          plan: planSlug,
          day: startDay,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (err) {}
        track("start_my_day_start_plan", { plan: planSlug, day: startDay });
        var url =
          "plans.html?plan=" +
          encodeURIComponent(planSlug) +
          "&day=" +
          encodeURIComponent(String(startDay));
        window.location.href = url;
      });

    var dlg = byId(DIALOG_ID);
    if (dlg) {
      dlg.addEventListener("cancel", function (e) {
        e.preventDefault();
        closeDialog();
      });
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) closeDialog();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
