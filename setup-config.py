#!/usr/bin/env python3
"""
One-time setup: writes config.js with your Supabase URL, anon key, and admin email.
Run from project root. Your values stay in your terminal only.

Usage:
  python3 setup-config.py
"""

import os

def main():
    print("Enter your Supabase values (from Dashboard → Project Settings → API).\n")
    url = (os.environ.get("SUPABASE_URL") or input("SUPABASE_URL (e.g. https://xxxx.supabase.co): ")).strip()
    key = (os.environ.get("SUPABASE_ANON_KEY") or input("SUPABASE_ANON_KEY (anon public key): ")).strip()
    email = (os.environ.get("MASTER_EMAIL") or input("MASTER_EMAIL (your admin email): ")).strip()

    if not url or not key or not email:
        print("Missing a value. Run again and fill all three.")
        return

    # Escape for use inside JavaScript strings (backslashes and quotes)
    def js(s):
        return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "\\r")

    content = """/**
 * Optional config for Today's Daily Battle.
 * Add config.js to .gitignore — do not commit keys.
 */
window.TDB_CONFIG = {
  SUPABASE_URL: '%s',
  SUPABASE_ANON_KEY: '%s',
  MASTER_EMAIL: '%s',
  MASTER_EMAILS: ['%s'],
  WALKTHROUGH_VIDEO_URL: '',
  ERROR_REPORT_URL: ''
};
""" % (js(url), js(key), js(email), js(email))

    with open(os.path.join(os.path.dirname(__file__), "config.js"), "w") as f:
        f.write(content)

    print("config.js written. Reload the site and try signing in.")

if __name__ == "__main__":
    main()
