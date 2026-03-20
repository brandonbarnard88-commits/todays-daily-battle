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
    ("/", "Home", ["id=\"search-btn\"", "Today's Daily Battle", "quick-actions-hero", "id=\"output\"", "id=\"tdb-search\"", "V2 Command Deck", "Search by what you feel right now"]),  # id="query" or id="tdb-search"
    ("/index.html", "Home (index.html)", ["id=\"search-btn\"", "Today's Daily Battle", "id=\"tdb-search\""]),
    ("/terms.html", "Terms", ["Terms of Service", "Acceptance", "terms.html"]),
    ("/privacy.html", "Privacy", ["Privacy", "terms.html"]),
    ("/pricing.html", "Pricing", ["Pricing", "Subscribe", "terms.html", "id=\"auth-section\"", "id=\"sidebar-toggle\""]),
    ("/explore.html", "Explore", ["Explore the site", "explore-link-list", "id=\"auth-section\""]),
    ("/about.html", "About", ["About", "Brandon", "contact.html"]),
    ("/contact.html", "Contact", ["Contact", "id=\"auth-section\"", "sidebar"]),
    ("/faq.html", "FAQ", ["FAQ", "pricing.html"]),
    ("/verse.html", "Verse of the Day", ["Verse", "id=\"auth-section\"", "verse-page-share", "verse-page-copy"]),
    ("/calm.html", "Need a verse now", ["God", "Psalm", "Isaiah", "Matthew", "Philippians", "Another verse"]),
    ("/study.html", "Study", ["Study", "notes", "id=\"auth-section\"", "study-note-status"]),
    ("/reader.html", "Chapter Reader", ["Reader", "Chapter", "id=\"auth-section\""]),
    ("/church.html", "Church Center", ["Church", "id=\"auth-section\""]),
    ("/sermon.html", "Sermon Builder", ["Sermon", "id=\"auth-section\""]),
    ("/pastor-toolkit.html", "Pastor Toolkit", ["Pastor", "id=\"auth-section\""]),
    ("/team-toolkit.html", "Team Toolkit", ["Team", "id=\"auth-section\""]),
    ("/resources.html", "Pastor Resources", ["Resources", "id=\"auth-section\""]),
    ("/message.html", "Message Board", ["Message", "id=\"auth-section\""]),
    ("/reading-plan.html", "Reading Plan", ["Reading", "id=\"auth-section\""]),
    ("/bible-tool.html", "Bible Tool", ["Bible Tool", "id=\"lookup-btn\"", "id=\"daily-ref\"", "Read full chapter"]),
    ("/bible-study.html", "Bible Study", ["Bible", "id=\"auth-section\""]),
    ("/coloring.html", "Coloring", ["Coloring", "Kids", "id=\"auth-section\""]),
    ("/kids-corner.html", "Kids Corner", ["Kids", "Today's Daily Battle"]),
    ("/kids-activities-print.html", "Kids Activities Print", ["activities", "Print"]),
    ("/kids-coloring-pack.html", "Kids Coloring Pack", ["Coloring"]),
    ("/shop.html", "Shop", ["Shop", "id=\"auth-section\""]),
    ("/wins-report.html", "Wins Report", ["Wins", "Today's Daily Battle"]),
    ("/admin.html", "Admin", ["Admin", "id=\"auth-section\""]),
    ("/stats.html", "Stats", ["Stats"]),
    ("/reset.html", "Password Reset", ["Reset", "Password"]),
    ("/topic-anxiety.html", "Topic Anxiety", ["Anxiety", "topic"]),
    ("/topic-fear.html", "Topic Fear", ["Fear", "topic"]),
    ("/topic-forgiveness.html", "Topic Forgiveness", ["Forgiveness"]),
    ("/topic-grief.html", "Topic Grief", ["Grief"]),
    ("/topic-hope.html", "Topic Hope", ["Hope"]),
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
