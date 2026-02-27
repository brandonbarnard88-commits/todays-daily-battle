#!/usr/bin/env python3
"""
Set Supabase Auth redirect URLs (uri_allow_list) via the Management API.

Requires a Supabase Personal Access Token (PAT) with auth_config_read + auth_config_write.
Create one at: https://supabase.com/dashboard/account/tokens

Usage:
  export SUPABASE_PAT="sbp_xxxx..."
  python scripts/set_supabase_redirect_urls.py

Optional:
  SUPABASE_PROJECT_REF  (default: rixsnhpwrlbvvymkfamj, from your config)
"""

import os
import sys
import urllib.request
import urllib.error
import json

API_BASE = "https://api.supabase.com/v1"
PROJECT_REF = os.environ.get("SUPABASE_PROJECT_REF", "rixsnhpwrlbvvymkfamj")

# Redirect URLs to ensure are in the allow list (.com and .org)
REDIRECT_URLS = [
    "https://todaysdailybattle.com",
    "https://todaysdailybattle.com/",
    "https://todaysdailybattle.com/reset.html",
    "https://todaysdailybattle.org",
    "https://todaysdailybattle.org/",
    "https://todaysdailybattle.org/reset.html",
]


def main():
    pat = os.environ.get("SUPABASE_PAT", "").strip()
    if not pat:
        print("Error: Set SUPABASE_PAT (Personal Access Token from https://supabase.com/dashboard/account/tokens)")
        sys.exit(1)
    if "xxxx" in pat or pat == "sbp_..." or "yourrealtonken" in pat.lower() or "yourreal" in pat.lower():
        print("Error: Use the REAL token from https://supabase.com/dashboard/account/tokens (Create token → copy the long sbp_... value).")
        sys.exit(1)

    headers = {
        "Authorization": f"Bearer {pat}",
        "Content-Type": "application/json",
    }

    # 1. GET current auth config
    url = f"{API_BASE}/projects/{PROJECT_REF}/config/auth"
    req = urllib.request.Request(url, method="GET", headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            config = json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"GET auth config failed: {e.code} {e.reason}")
        if body.strip():
            print(body)
        if e.code == 403:
            print("Tip: 403 = invalid token, or your account role cannot change auth (need Owner/Administrator). Add the URLs manually in Supabase → Authentication → URL Configuration.")
        sys.exit(1)

    # 2. Merge current uri_allow_list with our URLs (comma-separated in API)
    current = config.get("uri_allow_list") or ""
    existing = [u.strip() for u in current.split(",") if u.strip()]
    combined = list(dict.fromkeys(existing + REDIRECT_URLS))  # preserve order, no dupes
    uri_allow_list = ",".join(combined)

    # 3. PATCH only uri_allow_list (don't send the whole config)
    patch_url = f"{API_BASE}/projects/{PROJECT_REF}/config/auth"
    body = json.dumps({"uri_allow_list": uri_allow_list}).encode()
    req = urllib.request.Request(patch_url, data=body, method="PATCH", headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            print("Redirect URLs updated successfully.")
            print("Allow list now includes:", uri_allow_list)
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"PATCH auth config failed: {e.code} {e.reason}")
        if body.strip():
            print(body)
        if e.code == 403:
            print("Tip: 403 = invalid token, or your account role cannot change auth (need Owner/Administrator). Add the URLs manually in Supabase → Authentication → URL Configuration.")
        sys.exit(1)


if __name__ == "__main__":
    main()
