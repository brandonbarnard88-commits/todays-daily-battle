#!/usr/bin/env bash
# Authz smoke: RLS (T1, T5, T8) + Edge Functions (E1, E2, E6).
# Does not run in default npm test — set env and invoke explicitly.
#
# Required:
#   SUPABASE_URL          e.g. https://YOUR_PROJECT_REF.supabase.co
#   SUPABASE_ANON_KEY     anon public key
#
# Optional (enables E2 — disallowed price_id with real session):
#   AUTHZ_ACCESS_TOKEN    signed-in user's access JWT (short-lived)
#
# Optional:
#   AUTHZ_STRICT=1        fail if a checked table returns 404 (not in schema cache)
#
# Usage:
#   SUPABASE_URL=... SUPABASE_ANON_KEY=... ./scripts/authz-smoke.sh
#   AUTHZ_ACCESS_TOKEN=eyJ... SUPABASE_URL=... SUPABASE_ANON_KEY=... ./scripts/authz-smoke.sh
#
# Exit: 0 = all checks passed or skipped (Stripe not configured on Edge — see below)
#       1 = a hard check failed
#
set -euo pipefail

RED='\033[0;31m'
GRN='\033[0;32m'
YLW='\033[0;33m'
NC='\033[0m'

fail() { echo -e "${RED}FAIL${NC} $*" >&2; exit 1; }
ok()   { echo -e "${GRN}OK${NC}   $*"; }
warn() { echo -e "${YLW}WARN${NC} $*"; }

warn_or_fail_missing() {
  local name="$1"
  if [[ "$AUTHZ_STRICT" == "1" ]]; then
    fail "$name: table not in schema cache (404) — run SQL from SUPABASE-SYNC-TABLES.md or use AUTHZ_STRICT=0"
  fi
  warn "$name: table not deployed (404) — RLS not verified for this table; run SQL or set AUTHZ_STRICT=1 after provisioning"
}

# Returns 0 if this response is "function not deployed" (handled with warn or fail).
handle_edge_not_deployed() {
  local label="$1"
  if [[ "$HTTP_CODE" != "404" ]]; then
    return 1
  fi
  if [[ "$BODY" != *"NOT_FOUND"* && "$BODY" != *"not found"* && "$BODY" != *"Requested function"* ]]; then
    return 1
  fi
  if [[ "$AUTHZ_STRICT" == "1" ]]; then
    fail "$label: Edge Function not deployed (404) — deploy supabase/functions or use AUTHZ_STRICT=0"
  fi
  warn "$label: Edge Function not deployed (404) — deploy functions or set AUTHZ_STRICT=1 in CI with a provisioned project"
  return 0
}

SUPABASE_URL="${SUPABASE_URL:-}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-}"
AUTHZ_ACCESS_TOKEN="${AUTHZ_ACCESS_TOKEN:-}"
AUTHZ_STRICT="${AUTHZ_STRICT:-0}"

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "Set SUPABASE_URL and SUPABASE_ANON_KEY (see scripts/authz-smoke.sh header)." >&2
  exit 1
fi

# Trim trailing slash
REST_BASE="${SUPABASE_URL%/}/rest/v1"
FUNC_BASE="${SUPABASE_URL%/}/functions/v1"

anon_headers=(
  -H "apikey: ${SUPABASE_ANON_KEY}"
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
  -H "Accept: application/json"
)

# --- Helpers ---
# rest_get PATH -> sets HTTP_CODE and BODY
rest_get() {
  local path="$1"
  local out
  out="$(mktemp)"
  HTTP_CODE="$(curl -sS -o "$out" -w "%{http_code}" \
    "${anon_headers[@]}" \
    "${REST_BASE}${path}")"
  BODY="$(cat "$out")"
  rm -f "$out"
}

# edge_post FUNCTION JSON_BODY AUTH_MODE -> HTTP_CODE, BODY
# AUTH_MODE: none | bearer (bearer requires AUTHZ_ACCESS_TOKEN)
edge_post() {
  local fn="$1"
  local json="$2"
  local mode="${3:-none}"
  local out
  out="$(mktemp)"
  if [[ "$mode" == "bearer" ]]; then
    if [[ -z "$AUTHZ_ACCESS_TOKEN" ]]; then
      HTTP_CODE="000"
      BODY=""
      rm -f "$out"
      return
    fi
    HTTP_CODE="$(curl -sS -o "$out" -w "%{http_code}" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${AUTHZ_ACCESS_TOKEN}" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -d "$json" \
      "${FUNC_BASE}/${fn}")"
  else
    HTTP_CODE="$(curl -sS -o "$out" -w "%{http_code}" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "apikey: ${SUPABASE_ANON_KEY}" \
      -d "$json" \
      "${FUNC_BASE}/${fn}")"
  fi
  BODY="$(cat "$out")"
  rm -f "$out"
}

empty_json_array() {
  [[ "$1" == "[]" ]]
}

# --- T1: anon GET user_sync_data ---
rest_get "/user_sync_data?select=*&limit=1"
if [[ "$HTTP_CODE" == "200" ]]; then
  if empty_json_array "$BODY"; then
    ok "T1 anon GET user_sync_data → 200 []"
  else
    fail "T1 anon GET user_sync_data returned 200 with data (expected []): ${BODY:0:200}"
  fi
elif [[ "$HTTP_CODE" == "403" ]]; then
  ok "T1 anon GET user_sync_data → 403"
elif [[ "$HTTP_CODE" == "404" ]] && [[ "$BODY" == *"Could not find the table"* ]]; then
  warn_or_fail_missing "T1 user_sync_data"
else
  fail "T1 anon GET user_sync_data → unexpected HTTP ${HTTP_CODE} body=${BODY:0:300}"
fi

# --- T5: anon GET messages ---
rest_get "/messages?select=*&limit=1"
if [[ "$HTTP_CODE" == "200" ]]; then
  if [[ "$BODY" == "[]" ]]; then
    ok "T5 anon GET messages → 200 []"
  else
    fail "T5 anon GET messages expected [] got: ${BODY:0:200}"
  fi
elif [[ "$HTTP_CODE" == "403" ]]; then
  ok "T5 anon GET messages → 403"
elif [[ "$HTTP_CODE" == "404" ]] && [[ "$BODY" == *"Could not find the table"* ]]; then
  warn_or_fail_missing "T5 messages"
else
  fail "T5 anon GET messages → unexpected HTTP ${HTTP_CODE} body=${BODY:0:300}"
fi

# --- T8: anon GET feeling_suggestions ---
rest_get "/feeling_suggestions?select=*&limit=1"
if [[ "$HTTP_CODE" == "200" ]]; then
  if [[ "$BODY" == "[]" ]]; then
    ok "T8 anon GET feeling_suggestions → 200 []"
  else
    fail "T8 anon GET feeling_suggestions expected [] on 200, got: ${BODY:0:200}"
  fi
elif [[ "$HTTP_CODE" == "403" ]]; then
  ok "T8 anon GET feeling_suggestions → 403"
elif [[ "$HTTP_CODE" == "404" ]] && [[ "$BODY" == *"Could not find the table"* ]]; then
  warn_or_fail_missing "T8 feeling_suggestions"
else
  fail "T8 anon GET feeling_suggestions → unexpected HTTP ${HTTP_CODE} body=${BODY:0:300}"
fi

# --- E1: create-checkout-session without Authorization ---
# Note: Edge checks Stripe secret before JWT; if Stripe not configured, returns 500 first.
edge_post "create-checkout-session" '{"price_id":"price_1T5C10PyNV9eq3QeHyy5RLdy"}' "none"
if handle_edge_not_deployed "E1 create-checkout-session"; then
  :
elif [[ "$HTTP_CODE" == "401" ]]; then
  ok "E1 POST create-checkout-session without Bearer → 401"
elif [[ "$HTTP_CODE" == "500" ]] && [[ "$BODY" == *"Stripe not configured"* ]]; then
  warn "E1 skipped: create-checkout-session returns 500 (Stripe not configured on Edge — set STRIPE_SECRET_KEY for full E1/E2 checks)"
else
  fail "E1 expected 401 without auth, got HTTP ${HTTP_CODE} body=${BODY:0:400}"
fi

# --- E2: invalid price_id with valid JWT ---
if [[ -z "$AUTHZ_ACCESS_TOKEN" ]]; then
  warn "E2 skipped: set AUTHZ_ACCESS_TOKEN to test disallowed price_id (400)"
else
  edge_post "create-checkout-session" '{"price_id":"price_0FakeDisallowedNotInAllowlist123456"}' "bearer"
  if [[ "$HTTP_CODE" == "000" ]]; then
    warn "E2 skipped: bearer mode failed (token empty)"
  elif handle_edge_not_deployed "E2 create-checkout-session"; then
    :
  elif [[ "$HTTP_CODE" == "500" ]] && [[ "$BODY" == *"Stripe not configured"* ]]; then
    warn "E2 skipped: Stripe not configured on Edge"
  elif [[ "$HTTP_CODE" == "400" ]] && [[ "$BODY" == *"not allowed"* || "$BODY" == *"Price not allowed"* ]]; then
    ok "E2 POST create-checkout-session disallowed price_id → 400"
  elif [[ "$HTTP_CODE" == "400" ]]; then
    ok "E2 POST create-checkout-session → 400 (reject invalid price)"
  else
    fail "E2 expected 400 for disallowed price_id, got HTTP ${HTTP_CODE} body=${BODY:0:400}"
  fi
fi

# --- E6: post-message without Authorization ---
edge_post "post-message" '{"text":"authz-smoke test"}' "none"
if handle_edge_not_deployed "E6 post-message"; then
  :
elif [[ "$HTTP_CODE" == "401" ]]; then
  ok "E6 POST post-message without Bearer → 401"
else
  fail "E6 expected 401 without auth, got HTTP ${HTTP_CODE} body=${BODY:0:400}"
fi

# --- E6b: post-message with malformed JWT (must not accept as signed-in) ---
out_mal="$(mktemp)"
HTTP_CODE="$(curl -sS -o "$out_mal" -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not.a.valid.jwt" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -d '{"text":"authz-smoke malformed jwt"}' \
  "${FUNC_BASE}/post-message")"
BODY="$(cat "$out_mal")"
rm -f "$out_mal"
if handle_edge_not_deployed "E6b post-message (malformed JWT)"; then
  :
elif [[ "$HTTP_CODE" == "401" ]]; then
  ok "E6b POST post-message with malformed JWT → 401"
else
  fail "E6b expected 401 for malformed JWT, got HTTP ${HTTP_CODE} body=${BODY:0:400}"
fi

ok "authz-smoke finished"
