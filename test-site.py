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
    ("/", "Home", ["id=\"search-btn\"", "Today's Daily Battle", "quick-actions-hero", "id=\"feel-results\"", "id=\"tdb-search\"", "What battle are you facing today?", "V2 Command Deck", "Search by what you feel right now", "Verse image generator", "sky-ip-geo.js?v=20260327ipgeo", "id=\"family-armor-stories-btn\"", "href=\"#armor-builder-btn\"", "id=\"family-armor-kids-library-link\"", "kids/corner.html", "id=\"hero-save-my-verses\"", "script.js?v=20260425savednotes-migrate", "Anxiety (ES)", "Strength (ES)", "Peace (ES)", "fr/anxiete.html", "data-tdb-pick=\"fr\"", "zh/jiaolv.html", "data-tdb-pick=\"zh\"", "ar/qalaq.html", "data-tdb-pick=\"ar\"", "hi/chinta.html", "data-tdb-pick=\"hi\"", "ru/trevoga.html", "data-tdb-pick=\"ru\"", "sv/oro.html", "data-tdb-pick=\"sv\"", "pt/ansiedade.html", "data-tdb-pick=\"pt\"", "bn/chinta.html", "data-tdb-pick=\"bn\"", "sw/wasiwasi.html", "data-tdb-pick=\"sw\"", "hreflang=\"x-default\" href=\"https://todaysdailybattle.com/\"", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/trevoga.html\"", "hreflang=\"zh-CN\" href=\"https://todaysdailybattle.com/zh/jiaolv.html\"", "id=\"tdb-lang-eyebrow\"", "mood-door page in that language", "id=\"tdb-hero-lang-hint\"", "stay English for now"]),  # visible search results host (no hidden #output on home)
    ("/index.html", "Home (index.html)", ["id=\"search-btn\"", "Today's Daily Battle", "id=\"tdb-search\"", "sky-ip-geo.js?v=20260327ipgeo", "script.js?v=20260425savednotes-migrate", "href=\"#armor-builder-btn\"", "id=\"hero-save-my-verses\"", "Anxiety (ES)", "Strength (ES)", "Peace (ES)", "tl/kabalisahan.html", "data-tdb-pick=\"tl\"", "fr/anxiete.html", "data-tdb-pick=\"fr\"", "zh/jiaolv.html", "data-tdb-pick=\"zh\"", "ar/qalaq.html", "data-tdb-pick=\"ar\"", "hi/chinta.html", "data-tdb-pick=\"hi\"", "ru/trevoga.html", "data-tdb-pick=\"ru\"", "sv/oro.html", "data-tdb-pick=\"sv\"", "pt/ansiedade.html", "data-tdb-pick=\"pt\"", "bn/chinta.html", "data-tdb-pick=\"bn\"", "sw/wasiwasi.html", "data-tdb-pick=\"sw\"", "hreflang=\"x-default\" href=\"https://todaysdailybattle.com/\"", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/trevoga.html\"", "hreflang=\"zh-CN\" href=\"https://todaysdailybattle.com/zh/jiaolv.html\"", "tdb-hero-lang-today-stack", "id=\"tdb-hero-lang-label\"", "tdb-lang-switcher--hero-secondary", "id=\"tdb-lang-eyebrow\"", "mood-door page in that language", "id=\"tdb-hero-lang-hint\"", "stay English for now"]),
    ("/terms.html", "Terms", ["Terms of Service", "Acceptance", "terms.html"]),
    ("/privacy.html", "Privacy", ["Privacy", "terms.html"]),
    ("/pricing.html", "Pricing", ["Pricing", "Subscribe", "terms.html", "id=\"auth-section\"", "id=\"sidebar-toggle\""]),
    ("/explore.html", "Explore", ["Explore the site", "explore-link-list", "id=\"topics-es\">Spanish topics", "Spanish devotionals", ">Spanish topics</a>", "fr/anxiete.html", "zh/jiaolv.html", "ar/qalaq.html", "hi/chinta.html", "ru/trevoga.html", "sv/oro.html", "pt/ansiedade.html", "bn/chinta.html", "sw/wasiwasi.html", "Synodal", "1917", "Almeida", "Calcutta", "Kiswahili", "Van Dyck", "1851 Hindi", "fr/espoir.html", "zh/xiwang.html", "fr/solitude.html", "zh/gudu.html", "fr/culpabilite.html", "zh/neijiu.html", "fr/deborde.html", "zh/taiduo.html", "Louis Segond", "Reina-Valera 1960", "tdb-cache-hygiene:", "id=\"auth-section\""]),
    ("/about.html", "About", ["About", "Where this came from", "contact.html"]),
    ("/contact.html", "Contact", ["Contact", "id=\"auth-section\"", "sidebar"]),
    ("/faq.html", "FAQ", ["FAQ", "pricing.html"]),
    ("/verse.html", "Verse of the Day", ["Verse", "id=\"auth-section\"", "verse-page-share", "verse-page-copy", "verse-page-save-my-verses", "verse-save-hint", "My Verses", "/bible-tool.html", "tdb-cache-hygiene:"]),
    ("/calm.html", "Need a verse now", ["God", "Psalm", "Isaiah", "Matthew", "Philippians", "Another verse", "Breathe with me for 60 seconds", "script.js?v=20260325calmen"]),
    ("/study.html", "Study", ["Study", "notes", "id=\"auth-section\"", "study-note-status"]),
    ("/my-verses.html", "My Verses", ["My Verses", "id=\"saved-verses\"", "id=\"my-verses-panel\"", "bible-tool.html", "Study workspace", "footer-humility", "We battle. He wins.", "tdb-cache-hygiene:"]),
    ("/reader.html", "Chapter Reader", ["Reader", "Chapter", "id=\"auth-section\""]),
    ("/church.html", "Church Center", ["Church", "id=\"auth-section\""]),
    ("/sermon.html", "Sermon Builder", ["Sermon", "id=\"auth-section\""]),
    ("/pastor-toolkit.html", "Pastor Toolkit", ["Pastor", "id=\"auth-section\""]),
    ("/team-toolkit.html", "Team Toolkit", ["Team", "Ready-to-use packs", "id=\"auth-section\""]),
    ("/resources.html", "Pastor Resources", ["Resources", "id=\"auth-section\""]),
    ("/message.html", "Message Board", ["Message", "id=\"auth-section\""]),
    ("/reading-plan.html", "Reading Plan", ["Reading", "id=\"auth-section\""]),
    ("/plans.html", "Battle Plans", ["Battle Plans", "plan-list", "planIndex", "tdb-cache-hygiene:"]),
    ("/bible-tool.html", "Bible Tool", ["Bible Tool", "Bible stories", "bible-story-tool-index.js", "Featured this week", "corner.html?story=davidGoliath", "id=\"lookup-btn\"", "id=\"daily-ref\"", "Read full chapter", "verse-image.html", "tdb-cache-hygiene:"]),
    ("/verse-image.html", "Verse image generator", ["Verse image generator", "verse-image-canvas", "Supporter", "recent-gens", "data-verse-store", "verse-image-text-color", "cross"]),
    ("/bible-study.html", "Bible Study", ["Bible", "id=\"auth-section\""]),
    ("/coloring.html", "Coloring", ["Coloring", "Kids", "coloring-sheet-grid", "Pick a page", "id=\"auth-section\""]),
    ("/kids-corner.html", "Kids Corner", ["Bible Loop Library", "kids-loop-og.jpg", "Download loop progress (PDF)", "loop-pdf-export", 'aria-describedby="loop-pdf-export-count-hint loop-pdf-export-hint"', "Quick calm loops", "Open Kids Coloring", "coloring.html", "Story Stars", "loop-grid", "script.js?v=20260328feelwire", "kids-corner.css?v=8",
    "kids-corner-daily-verse.js?v=1",
    "Verse of the day",
    "kids-daily-verse-root", "kids/kids-page-sky.css?v=20260326playful", "sky-ip-geo.js?v=20260327ipgeo", "kids/kids-page-sky.js?v=20260327ipgeo"]),
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
    ("/topic-anxiety.html", "Topic Anxiety", ["Anxiety", "topic", "tdb-mood-door-kjv-banner", "hreflang=\"ru\" href=\"https://todaysdailybattle.com/ru/trevoga.html\"", "hreflang=\"sv\" href=\"https://todaysdailybattle.com/sv/oro.html\"", "hreflang=\"pt\" href=\"https://todaysdailybattle.com/pt/ansiedade.html\"", "hreflang=\"bn\" href=\"https://todaysdailybattle.com/bn/chinta.html\"", "hreflang=\"sw\" href=\"https://todaysdailybattle.com/sw/wasiwasi.html\""]),
    ("/topic-fear.html", "Topic Fear", ["Fear", "topic"]),
    ("/topic-forgiveness.html", "Topic Forgiveness", ["Forgiveness"]),
    ("/topic-grief.html", "Topic Grief", ["Grief"]),
    ("/topic-hope.html", "Topic Hope", ["Hope", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/espoir.html\"", "zh/xiwang.html", "id=\"auth-section\""]),
    ("/topic-loneliness.html", "Topic Loneliness", ["When You Feel Alone", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/solitude.html\"", "zh/gudu.html", "id=\"auth-section\""]),
    ("/topic-guilt.html", "Topic Guilt", ["When You Feel Guilty", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/culpabilite.html\"", "zh/neijiu.html", "id=\"auth-section\""]),
    ("/topic-overwhelmed.html", "Topic Overwhelmed", ["When You Feel Overwhelmed", "hreflang=\"fr\" href=\"https://todaysdailybattle.com/fr/deborde.html\"", "zh/taiduo.html", "id=\"auth-section\""]),
    ("/topic-worthless.html", "Topic Worthless", ["When You Feel Worthless", "Key Verses", "id=\"auth-section\"", "data-tdb-lang-switcher"]),
    ("/topic-parenting.html", "Topic Parenting", ["Parenting"]),
    ("/topic-strength.html", "Topic Strength", ["Strength"]),
    ("/action-bible.html", "Action Bible Archive", ["Action Bible Documentary Archive", "Documentary Controls", "My witness profile", "Play Selected Season", "Continue Watching"]),
    ("/action-bible-workshop.html", "Action Bible Workshop Toolkit", ["Worksheet + Class Toolkit", "Generate Worksheet", "Build Leader Dashboard Plan", "Load Weekly Pack", "Download Weekly JSON"]),
    ("/action-bible-weekly-packs.json", "Action Bible Weekly Packs", ["\"totalWeeks\"", "\"weeks\""]),
    ("/404.html", "404 Page", ["not found", "Today's Daily Battle"]),
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
