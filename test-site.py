#!/usr/bin/env python3
"""
Hard test of the static site: pages load, critical content present.
Run: python3 test-site.py
Requires: server at http://127.0.0.1:8765 (e.g. python3 -m http.server 8765)
"""
import urllib.request
import sys

BASE = "http://127.0.0.1:8765"
PAGES = [
    ("/", "Home", ["id=\"query\"", "id=\"search-btn\"", "Today's Daily Battle"]),
    ("/terms.html", "Terms", ["Terms of Service", "Acceptance"]),
    ("/pricing.html", "Pricing", ["Pricing", "Subscribe", "terms.html"]),
    ("/privacy.html", "Privacy", ["Privacy", "terms.html"]),
    ("/study.html", "Study", ["Study", "notes"]),
    ("/verse.html", "Verse of the Day", ["Verse"]),
    ("/church.html", "Church", ["Church"]),
    ("/sermon.html", "Sermon", ["Sermon"]),
    ("/reading-plan.html", "Reading plan", ["Reading"]),
    ("/faq.html", "FAQ", ["FAQ"]),
    ("/contact.html", "Contact", ["Contact"]),
]

def main():
    failed = 0
    print("Testing site at", BASE, "\n")
    for path, name, must_include in PAGES:
        url = BASE + path
        try:
            with urllib.request.urlopen(url, timeout=8) as r:
                body = r.read().decode("utf-8", errors="replace")
                status = r.getcode()
        except Exception as e:
            print("FAIL", name, str(e)[:50])
            failed += 1
            continue
        if status != 200:
            print("FAIL", name, path, "->", status)
            failed += 1
            continue
        missing = [s for s in must_include if s not in body]
        if missing:
            print("FAIL", name, "missing:", ", ".join(missing))
            failed += 1
        else:
            print("OK   ", name)
    # Search logic in script.js
    try:
        with open("script.js", "r", encoding="utf-8") as f:
            script = f.read()
        ok = "'selfless'" in script and "singleWord" in script and "results.fallback" in script
        if ok:
            print("\nOK   search logic (selfless->love, fallback verses)")
        else:
            print("\nFAIL search logic check in script.js")
            failed += 1
    except Exception as e:
        print("\nFAIL reading script.js", e)
        failed += 1
    print("\n" + ("All checks passed." if failed == 0 else f"{failed} failure(s)."))
    sys.exit(failed)

if __name__ == "__main__":
    main()
