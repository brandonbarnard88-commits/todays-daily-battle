#!/usr/bin/env python3
"""
Full-site test: every page loads, critical content present.
Run: python3 -m http.server 8765   (in one terminal)
     python3 test-site.py          (in another)
Or run without server: python3 test-site.py --offline
Exit: 0 = all OK, non-zero = failures.
"""
import urllib.request
import sys
import re
import os

BASE = "http://127.0.0.1:8765"
ROOT = os.path.dirname(os.path.abspath(__file__))
OFFLINE = "--offline" in sys.argv

# (path, name, list of strings that must appear in body)
PAGES = [
    ("/", "Home", ["id=\"search-btn\"", "Today's Daily Battle", "quick-actions-hero", "id=\"feel-results\"", "id=\"tdb-search\"", "What battle are you facing today?", "V2 Command Deck", "Search by what you feel right now", "Verse image generator", "sky-ip-geo.js?v=20260327ipgeo", "<button type=\"button\" id=\"family-armor-stories-btn\"", "id=\"armor-builder-btn\"", "id=\"family-armor-kids-library-link\"", "kids/corner.html", "href=\"/family.html\"", "href=\"/mission-outreach-packs.html\"", "id=\"hero-save-my-verses\"", "id=\"topicPlansHint\"", "script.js?v=20260430heropolish", "footer-build-stamp.js?v=20260329fdbuild", "hero-daily-headline", "id=\"heroDailySubline\"", "Whatever your day holds", "id=\"en-hub-daily-verse\"", "data-tdb-hub-daily-rotate", "Official calendar", "Extra anchor (KJV)", "Anxiety (ES)", "Strength (ES)", "Peace (ES)", "href=\"/es/\"", "data-tdb-pick=\"es\"", "href=\"/fr/\"", "data-tdb-pick=\"fr\"", "href=\"/pt/\"", "data-tdb-pick=\"pt\"", "hreflang=\"x-default\" href=\"https://todaysdailybattle.com/\"", "hreflang=\"es\" href=\"https://todaysdailybattle.com/es/\"", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/\"", "id=\"tdb-hero-lang-hint\"", "stay English for now", "href=\"bible/tools.html\"", "Study workshop", "explore.html#start-here", "explore.html#whats-new-spring-2026", "explore.html#first-visit-tour", "tdb-whats-new-hint", "(Spring 2026)", "id=\"tdbHomeResume\"", "id=\"tdbNewHereHint\"", "New here?", "hero-my-verses-privacy-line", "hero-save-my-verses-status-line", "tdb-gentle-next-steps", "id=\"footer-support-quiet-place\"", "Support this quiet place", "href=\"/give\"", "tdb-home-mobius-week.js?v=20260330home", "id=\"tdbHomeMobiusWeek\"", "hero-daily-path-support", "id=\"heroShareBtn\"", "verse-growth-row", "prayer-wall-privacy-note", "prayer-wall-room-title", "A quiet room", "site-footer-support-nudge", "footer-support-nudge-give", "plan-category-chip"]),  # visible search results host (no hidden #output on home)
    ("/index.html", "Home (index.html)", ["id=\"search-btn\"", "Today's Daily Battle", "id=\"tdb-search\"", "sky-ip-geo.js?v=20260327ipgeo", "script.js?v=20260430heropolish", "footer-build-stamp.js?v=20260329fdbuild", "hero-daily-headline", "id=\"heroDailySubline\"", "Whatever your day holds", "id=\"armor-builder-btn\"", "<button type=\"button\" id=\"family-armor-stories-btn\"", "id=\"hero-save-my-verses\"", "id=\"topicPlansHint\"", "id=\"en-hub-daily-verse\"", "data-tdb-hub-daily-rotate", "Official calendar", "Anxiety (ES)", "Strength (ES)", "Peace (ES)", "href=\"/es/\"", "data-tdb-pick=\"es\"", "href=\"/fr/\"", "data-tdb-pick=\"fr\"", "href=\"/pt/\"", "data-tdb-pick=\"pt\"", "hreflang=\"x-default\" href=\"https://todaysdailybattle.com/\"", "hreflang=\"es\" href=\"https://todaysdailybattle.com/es/\"", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/\"", "tdb-hero-lang-today-stack", "id=\"tdb-hero-lang-label\"", "id=\"heroShareBtn\"", "id=\"tdb-hero-lang-hint\"", "stay English for now", "id=\"tdbHomeResume\"", "id=\"tdbNewHereHint\"", "hero-my-verses-privacy-line", "tdb-gentle-next-steps", "id=\"footer-support-quiet-place\"", "Support this quiet place", "href=\"/give\"", "site-footer-support-nudge", "prayer-wall-room-title", "A quiet room", "tdb-home-mobius-week.js?v=20260330home", "id=\"tdbHomeMobiusWeek\"", "hero-daily-path-support", "verse-growth-row"]),
    ("/terms.html", "Terms", ["Terms of Service", "Acceptance", "terms.html", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/terms.html\""]),
    ("/privacy.html", "Privacy", ["Privacy", "terms.html", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/privacy.html\""]),
    ("/pricing.html", "Pricing", ["Pricing", "Subscribe", "terms.html", "id=\"auth-section\"", "id=\"sidebar-toggle\""]),
    ("/explore.html", "Explore", ["Explore the site", "explore-link-list", "id=\"explore-first-visit-hint\"", "First visit?", "Supported hubs", "Additional languages", "id=\"open-beta-explore-heading\"", "honest edges", "family.html", "family-armor.html", "id=\"mission-outreach\"", "mission-outreach-packs.html", "id=\"whats-new-spring-2026\"", "What&rsquo;s new (Spring 2026)", "id=\"topics-es\">Spanish topics", "Spanish devotionals", ">Spanish topics</a>", "href=\"/es/\"", "Español — inicio", "href=\"/fr/\"", "fr/anxiete.html", "href=\"/zh/\"", "中文 — hub", "href=\"/ru/\"", "Русский — hub", "href=\"/hi/\"", "हिन्दी — hub", "zh/jiaolv.html", "ar/qalaq.html", "hi/chinta.html", "ru/trevoga.html", "zh/kongju.html", "sv/oro.html", "Português — início", "href=\"/pt/\"", "pt/ansiedade.html", "pt/medo.html", "pt/planos.html", "pt/privacy.html", "bn/chinta.html", "sw/wasiwasi.html", "Synodal", "1917", "Almeida", "Calcutta", "Kiswahili", "Van Dyck", "1851 Hindi", "fr/espoir.html", "zh/xiwang.html", "fr/solitude.html", "zh/gudu.html", "fr/culpabilite.html", "zh/neijiu.html", "fr/deborde.html", "zh/taiduo.html", "Louis Segond", "Reina-Valera 1960", "data-tdb-pick=\"en\"", "data-tdb-pick=\"pt\"", "id=\"start-here\"", "id=\"first-visit-tour\"", "Five calm minutes", "Glance when you like", "id=\"whats-new-march-2026\"", "Same daily-battle posture", "tdb-cache-hygiene:", "id=\"auth-section\""]),
    ("/about.html", "About", ["About", "Where this came from", "contact.html", "id=\"open-beta\"", "Open beta", "working ministry build", "id=\"whats-new-study\"", "href=\"/bible/tools.html\"", "id=\"whats-new-family-mission\"", "mission-outreach-packs.html"]),
    ("/contact.html", "Contact", ["Contact", "id=\"auth-section\"", "sidebar"]),
    ("/faq.html", "FAQ", ["FAQ", "pricing.html"]),
    ("/verse.html", "Verse of the Day", ["Verse", "id=\"auth-section\"", "verse-page-share", "verse-page-copy", "verse-page-save-my-verses", "verse-save-hint", "My Verses", "/bible-tool.html", "tdb-verse-ribbon-toggle", "tdb-mobius-journal", "mobius.html#mobius-loop-journal", "tdb-cache-hygiene:"]),
    ("/calm.html", "Need a verse now", ["God", "Psalm", "Isaiah", "Matthew", "Philippians", "Another verse", "Breathe with me for 60 seconds", "script.js?v=20260331kidsfam", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/paz.html\"", "hreflang=\"hi\" href=\"https://todaysdailybattle.com/hi/shanti.html\"", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/mir.html\""]),
    ("/mobius.html", "Möbius Loop", ["Möbius Loop", "mobius-season-lead", "One ribbon for every season", "id=\"mobius-loop-journal\"", "mobius-deep-journal-input", "mobius-deep-journal-export", "mobius-v2-journal-input", "tdb-mobius-journal", "what-god-has-done.html", "KJV only", "mobius-text-v2.js", "mobius-guided-audio-human", "mobius-guided-human.mp3", "mobius-guided-voice-wrap"]),
    ("/study.html", "Study", ["Study", "notes", "bible/tools.html", "Study workshop", "mystudy.html", "id=\"auth-section\"", "study-note-status"]),
    ("/my-verses.html", "My Verses", ["My Verses", "id=\"saved-verses\"", "id=\"my-verses-panel\"", "bible-tool.html", "Study workspace", "don&rsquo;t use your list for ads", "footer-humility", "We battle. He wins.", "tdb-cache-hygiene:"]),
    ("/reader.html", "Chapter Reader", ["Reader", "Chapter", "reader-xrefs-sheet-desc", "reader-wordstudy-sheet-desc", "bible/tools.html#book-intros", "href=\"/bible/tools.html\"", "Study workshop", "id=\"auth-section\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/leitor.html\""]),
    ("/church.html", "Church Center", ["Church", "id=\"auth-section\""]),
    ("/sermon.html", "Sermon Builder", ["Sermon", "id=\"auth-section\""]),
    ("/pastor-toolkit.html", "Pastor Toolkit", ["Pastor", "id=\"auth-section\""]),
    ("/team-toolkit.html", "Team Toolkit", ["Team", "Ready-to-use packs", "id=\"auth-section\""]),
    ("/resources.html", "Pastor Resources", ["Resources", "id=\"auth-section\""]),
    ("/message.html", "Message Board", ["Message", "id=\"auth-section\"", "tdb-privacy-whisper", "Before you post:", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/mural.html\""]),
    ("/prayer-wall.html", "Prayer wall bridge", ["location.replace('/#prayer-wall')", "Homepage prayer wall", "message.html#message-board", "tt-bootstrap.js", "tdb-cache-hygiene:"]),
    ("/reading-plan.html", "Reading Plan", ["Reading", "id=\"auth-section\""]),
    ("/plans.html", "Battle Plans", ["Battle Plans", "plan-list", "planIndex", "id=\"plans-lane-foundations\"", "plans-lane-quick", "href=\"#plans-lane-pain\"", "id=\"plans-lane-uncertainty\"", "id=\"plans-lane-fear\"", "id=\"plans-lane-family\"", "id=\"planFamilyIntro\"", "plan-family-intro", "familyworship", "Family Worship in the Trenches", "psalmscomfortfamily", "Psalms of Comfort (Family Edition)", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/planos.html\"", "tdb-mobius-journal", "Save to loop journal", "mobius.html#mobius-loop-journal", "tdb-cache-hygiene:"]),
    ("/bible-tool.html", "Bible Tool", ["Bible Tool", "Study workshop", "bible/tools.html", "Bible stories", "bible-story-tool-index.js", "Featured this week", "corner.html?story=davidGoliath", "id=\"lookup-btn\"", "id=\"daily-ref\"", "Read full chapter", "verse-image.html", "tdb-cache-hygiene:"]),
    ("/verse-image.html", "Verse image generator", ["Verse image generator", "verse-image-canvas", "Supporter", "recent-gens", "data-verse-store", "verse-image-text-color", "cross", "value=\"soar\"", "dawn sky", "value=\"hush\"", "verse-image.js?v=20260330verseimgv2"]),
    ("/bible-study.html", "Bible Study", ["Bible", "study-card-title", "Armor of God", "reading-plan.html?study=armor-of-god", "script.js?v=20260328studyhydrate", "id=\"auth-section\""]),
    ("/coloring.html", "Coloring", ["Coloring", "Kids", "coloring-sheet-grid", "Pick a page", "id=\"auth-section\""]),
    ("/kids-corner.html", "Kids Corner", ["Bible Loop Library", "kids-loop-og.jpg", "Download loop progress (PDF)", "loop-pdf-export", 'aria-describedby="loop-pdf-export-count-hint loop-pdf-export-hint"', "Quick calm loops", "Open Kids Coloring", "coloring.html", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/criancas.html\"", "Story Stars", "loop-grid", "script.js?v=20260328feelwire", "kids-corner.css?v=9",
    "kids-corner-daily-verse.js?v=4",
    "Verse of the day",
    "kids-daily-verse-body", "tdb-privacy-whisper",
    "kids-family-hub-banner", "Open Family hub", "For parents",
    "kids-daily-verse-root", "family.html", "kids/kids-page-sky.css?v=20260326playful", "sky-ip-geo.js?v=20260327ipgeo", "kids/kids-page-sky.js?v=20260327ipgeo"]),
    ("/family.html", "Family hub", ["For Families", "family-daily-verse-root", "daily-verse-body", "family-plan-progress-whisper", "Each plan keeps its own day", "family-plan-cards", 'id="family-prayer-wall"', "A quiet place for your family", "family-armor.html", "Family Armor &amp; Stories", "daily-quiet-time.html", "Family quiet time", "family-activity-packs.html", "family-youth-journal.html", "plans.html?plan=familyworship", "plans.html?plan=psalmscomfortfamily", "Your family has walked", "stays the younger-child space", "tdb-cache-hygiene:"]),
    ("/family-armor.html", "Family Armor", ["Family Armor &amp; Stories", "family-armor-hero-verse-frame", "id=\"family-armor-hero-ref\"", "daily-verse-body", "whole armour of God", "Ephesians 6:10", "family-armor-pieces-grid", "Praying always", "Open the Family Armor workspace", "/#armor-builder-btn", "kids/corner.html", "family.html", "curriculum.html", 'aria-current="page"', 'href="/family-armor.html"', "family-armor-trust-strip", "stays on this device"]),
    ("/family-activity-packs.html", "Family activity packs", ["Printable family activity", "plans-data.js", "familyworship", "psalmscomfortfamily", "Psalms of Comfort (Family Edition)", "fam-print-btn", "tdb-privacy-whisper", "daily-verse-body"]),
    ("/family-youth-journal.html", "Family teen journal", ["Teen journal", "See — What stands out?", "galatiansfreedom", "family-activity-packs.html"]),
    ("/mission-outreach-packs.html", "Mission outreach packs", ["Mission &amp; outreach packs", "mission-outreach-data.js", "mo-pack-themes", "hospital &amp; bedside", "prison &amp; jail", "mo-print-btn", "tdb-cache-hygiene:"]),
    ("/kids/index.html", "Kids Battle Home", ["Kids Battle", "Library deep links must hit corner.html", "location.replace('corner.html' + location.search)", "Read-along words, comic panels", "Color &amp; create", "coloring.html", "uFuzzy.iife.min.js", "kids-verses-365.js?v=20260325kidsmeans", "kids-battle.js?v=20260326kidsflow", "kids-read-quiz-data.js?v=20260330kidslib", "kids-corner.js?v=20260326kidsflow", "kids-page-sky.css?v=20260326playful", "sky-ip-geo.js?v=20260327ipgeo", "kids-page-sky.js?v=20260327ipgeo", "kids-hub-story-matches", "kids-header-site-link-wrap", "footer-humility", "We battle. He wins."]),
    ("/kids/corner.html", "Bible Story Library", ["/kids/corner.html?story=noah", "kids-story-library-og.jpg", "Download Story Library List (PDF)", "Bible Story Library", 'aria-describedby="pdf-export-count-hint pdf-export-hint"', "story-library-fonts.css?v=1", "kids-page-sky.css?v=20260326playful", "sky-ip-geo.js?v=20260327ipgeo", "kids-page-sky.js?v=20260327ipgeo", "kids-library-search-hint", "uFuzzy.iife.min.js", "fuse.min.js", "kids-story-fuse-search.js?v=20260331fuse", "kids-library-search-suggest", "kids-verses-365.js?v=20260325kidsmeans", "kids-battle.js?v=20260326kidsflow", "kids-read-quiz-data.js?v=20260330kidslib", "kids-corner.js?v=20260326kidsflow", "hard-refresh", "canvas-confetti", "global-quiz-challenge", "print-qa-btn", "kids-print-qa-sheet-wrap", "TDB_PANEL_RASTER", "nunito-latin.woff2", "panel-david-1.svg", "tdb-kids-story-meta-desc", "kids-story-modal-back-library", "kids-corner-breadcrumb"]),
    ("/kids/all-stories.html", "Kids All Stories A–Z", ["All Bible Stories", "bible-story-tool-index.js", "uFuzzy.iife.min.js", "fuse.min.js", "kids-story-fuse-search.js", "kids-all-stories.js?v=20260331kidsthemes", "kids-page-sky.css?v=20260326playful", "sky-ip-geo.js?v=20260327ipgeo", "kids-page-sky.js?v=20260327ipgeo", "corner.html?story=", "kids-all-fuse-suggest", "kids-all-stories-theme-tabs", "kids-header-site-link-wrap"]),
    ("/kids-activities-print.html", "Kids Activities Print", ["activities", "Print"]),
    ("/kids-coloring-pack.html", "Kids Coloring Pack", ["Coloring"]),
    ("/shop.html", "Shop", ["Shop", "id=\"auth-section\""]),
    ("/wins-report.html", "Wins Report", ["Wins", "Today's Daily Battle"]),
    ("/admin.html", "Admin", ["Admin", "id=\"auth-section\""]),
    ("/stats.html", "Stats", ["Stats"]),
    ("/reset.html", "Password Reset", ["Reset", "Password"]),
    ("/topic-anxiety.html", "Topic Anxiety", ["Anxiety", "topic", "tdb-mood-door-kjv-banner", "tdb-mood-door-hope-cluster", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/\"", "hreflang=\"sv\" href=\"https://todaysdailybattle.com/sv/oro.html\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/ansiedade.html\"", "hreflang=\"bn\" href=\"https://todaysdailybattle.com/bn/chinta.html\"", "hreflang=\"sw\" href=\"https://todaysdailybattle.com/sw/wasiwasi.html\"", "/ru/nadezhda.html"]),
    ("/topic-worry.html", "Topic Worry", ["Worry", "topic", "topic-mood-hero", "tdb-mood-door-kjv-banner", "tdb-mood-door-hope-cluster", "rel=\"canonical\" href=\"https://todaysdailybattle.com/topic-worry.html\"", "topic-anxiety.html", "Matthew 6:34", "Psalm 55:22", "/ru/nadezhda.html"]),
    ("/topic-fear.html", "Topic Fear", ["Fear", "topic", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/medo.html\"", "hreflang=\"zh-CN\" href=\"https://todaysdailybattle.com/zh/kongju.html\"", "hreflang=\"hi\" href=\"https://todaysdailybattle.com/hi/dar.html\"", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/strakh.html\""]),
    ("/topic-forgiveness.html", "Topic Forgiveness", ["Forgiveness"]),
    ("/topic-grief.html", "Topic Grief", ["Grief"]),
    ("/topic-hope.html", "Topic Hope", ["Hope", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/espoir.html\"", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/nadezhda.html\"", "zh/xiwang.html", "id=\"auth-section\""]),
    ("/topic-loneliness.html", "Topic Loneliness", ["When You Feel Alone", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/solitude.html\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/solidao.html\"", "hreflang=\"hi\" href=\"https://todaysdailybattle.com/hi/akelapan.html\"", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/odinochestvo.html\"", "zh/gudu.html", "hi/akelapan.html", "id=\"auth-section\""]),
    ("/topic-guilt.html", "Topic Guilt", ["When You Feel Guilty", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/culpabilite.html\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/culpa.html\"", "zh/neijiu.html", "id=\"auth-section\""]),
    ("/topic-overwhelmed.html", "Topic Overwhelmed", ["When You Feel Overwhelmed", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/deborde.html\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/sobrecarga.html\"", "zh/taiduo.html", "id=\"auth-section\""]),
    ("/topic-worthless.html", "Topic Worthless", ["When You Feel Worthless", "Key Verses", "id=\"auth-section\"", "data-tdb-lang-switcher"]),
    ("/topic-parenting.html", "Topic Parenting", ["Parenting"]),
    ("/topic-strength.html", "Topic Strength", ["Strength", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/forca.html\"", "hreflang=\"zh-CN\" href=\"https://todaysdailybattle.com/zh/liliang.html\"", "hreflang=\"hi\" href=\"https://todaysdailybattle.com/hi/shakti.html\"", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/sila.html\""]),
    ("/action-bible.html", "Action Bible Archive", ["Action Bible Documentary Archive", "Documentary Controls", "My witness profile", "Play Selected Season", "Continue Watching"]),
    ("/action-bible-workshop.html", "Action Bible Workshop Toolkit", ["Worksheet + Class Toolkit", "Generate Worksheet", "Build Leader Dashboard Plan", "Load Weekly Pack", "Download Weekly JSON"]),
    ("/action-bible-weekly-packs.json", "Action Bible Weekly Packs", ["\"totalWeeks\"", "\"weeks\""]),
    ("/pt/medo.html", "PT Medo", ["lang=\"pt\"", "Almeida", "Timóteo", "hreflang=\"en\" href=\"https://todaysdailybattle.com/topic-fear.html\"", "data-tdb-pick=\"pt\"", "site-footer-pilot-note"]),
    ("/pt/planos.html", "PT Planos shell", ["lang=\"pt\"", "plans.html", "data-tdb-pick=\"pt\"", "site-footer-pilot-note"]),
    ("/pt/privacy.html", "PT Privacy summary", ["lang=\"pt\"", "privacy.html", "data-tdb-pick=\"pt\"", "site-footer-pilot-note"]),
    ("/404.html", "404 Page", ["not found", "Today's Daily Battle", "easter-eggs.js", "data-tdb-easter-eggs"]),
]

# Auth buttons that script.js wires (must exist on pages with auth-section)
AUTH_IDS = ["signup-btn", "login-btn", "forgot-btn", "logout-btn"]


def fetch(url, timeout=10):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "test-site.py"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.getcode(), r.read().decode("utf-8", errors="replace")
    except Exception as e:
        return None, str(e)


def read_local(path):
    """Read a local file (path like /index.html or /terms.html)."""
    if path.startswith("/"):
        path = path[1:]
    filepath = os.path.join(ROOT, path)
    if not os.path.isfile(filepath):
        return None, "file not found"
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            return 200, f.read()
    except Exception as e:
        return None, str(e)


def main():
    failed = 0
    if OFFLINE:
        print("Full-site test (OFFLINE — reading files from disk)\n")
        get_body = lambda path: read_local(path)
    else:
        print("Full-site test at", BASE, "\n")
        get_body = lambda path: fetch(BASE + path)

    for path, name, must_include in PAGES:
        path_for_request = path if path != "/" else "/index.html"
        status, body = get_body(path_for_request)
        if status is None or status != 200:
            print("FAIL", name, path, "->", (body or str(status))[:60])
            failed += 1
            continue
        missing = [s for s in must_include if s not in body]
        if missing:
            print("FAIL", name, "missing:", ", ".join(missing[:3]), ("..." if len(missing) > 3 else ""))
            failed += 1
        else:
            print("OK   ", name)

    # Pages that have auth-section should have auth button IDs (only when we have body from disk or same host)
    if not OFFLINE:
        auth_pages = [p for p in PAGES if "id=\"auth-section\"" in p[2]]
        for path, name, _ in auth_pages:
            path_for_request = path if path != "/" else "/index.html"
            status, body = fetch(BASE + path_for_request)
            if status != 200:
                continue
            for aid in AUTH_IDS:
                if f'id="{aid}"' not in body and f"id='{aid}'" not in body:
                    print("WARN ", name, "missing auth button id:", aid)

    # script.js search logic
    try:
        with open("script.js", "r", encoding="utf-8") as f:
            script = f.read()
        ok = ("selfless" in script or "expandKeywords" in script) and "results.fallback" in script and "parseQuery" in script
        if ok:
            print("\nOK   search logic (expandKeywords, fallback verses)")
        else:
            print("\nFAIL search logic check in script.js")
            failed += 1
    except Exception as e:
        print("\nFAIL reading script.js", e)
        failed += 1

    # script.js quick topic + runSearchWithInput
    try:
        with open("script.js", "r", encoding="utf-8") as f:
            script = f.read()
        if ("renderQuickTopicButtons" in script or "runQuickTopicSearch" in script) and "runSearchWithInput" in script and ("ensureOutputElement" in script or "wireSearchAndQuickTopics" in script):
            print("OK   quick search wiring (renderQuickTopicButtons, runSearchWithInput)")
        else:
            print("FAIL quick search wiring in script.js")
            failed += 1
    except Exception as e:
        print("FAIL reading script.js", e)
        failed += 1

    # Homepage feel search wiring (same invariants as scripts/verify-homepage-search-wiring.mjs)
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            idx = f.read()
        with open("script.js", "r", encoding="utf-8") as f:
            scr = f.read()
        hw_fail = False
        if 'id="feel-results"' not in idx:
            hw_fail = True
        ms = idx.find('id="main-search"')
        if ms != -1:
            sec0 = idx.rfind("<section", 0, ms)
            sec1 = idx.find("</section>", ms)
            if sec0 != -1 and sec1 != -1 and sec1 > ms:
                chunk = idx[sec0:sec1]
                if 'id="output"' in chunk or "id='output'" in chunk:
                    hw_fail = True
        if "function getSearchOutputElement" not in scr:
            hw_fail = True
        if "getElementById('feelSuggestDropdown')" not in scr:
            hw_fail = True
        if hw_fail:
            print("\nFAIL homepage search wiring guard (run: node scripts/verify-homepage-search-wiring.mjs)")
            failed += 1
        else:
            print("OK   homepage search wiring guard")
    except Exception as e:
        print("\nFAIL homepage search wiring check", e)
        failed += 1

    # Internal links: collect all .html links from index and verify targets exist (file or URL)
    try:
        status, body = get_body("/index.html")
        if status == 200:
            links = re.findall(r'href=["\']([^"\']+\.html)[^"\']*["\']', body)
            seen = set()
            for href in links:
                p = href.split("#")[0].strip()
                if not p or p in seen:
                    continue
                seen.add(p)
                if p.startswith("http"):
                    continue
                if not p.startswith("/"):
                    p = "/" + p
                if OFFLINE:
                    code, _ = read_local(p)
                else:
                    code, _ = fetch(BASE + p)
                if code != 200:
                    print("FAIL link from index:", p, "->", code or "error")
                    failed += 1
            if seen:
                print("OK   index.html internal links ({} checked)".format(len(seen)))
    except Exception as e:
        print("WARN link check:", e)

    print("\n" + ("All checks passed." if failed == 0 else "{} failure(s).".format(failed)))
    sys.exit(failed)


if __name__ == "__main__":
    main()
