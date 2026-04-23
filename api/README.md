# Today’s Daily Battle — HTTP API

Separate service (Hono + REST + tRPC + OpenAPI). The static `next-app/` build and Cloudflare Pages deploy stay unchanged; you run this as its own process (e.g. Node on a VPS) or on **Cloudflare Workers** (see below).

## Requirements

- Node 20+
- **Node / VPS:** the three JSON files in one directory (pilot: `../next-app/data/`), or set `TDB_DATA_DIR`.
- **Workers:** data is **bundled** from `src/pilot-data/*.json` (kept in sync with `next-app/data` — run `npm run sync:pilot-data` after canon/plans/moods change).

## Local run (Node — unchanged)

```bash
cd api
npm install
npm run dev
```

Defaults: [http://localhost:8787](http://localhost:8787)

## Cloudflare Workers

Config: `wrangler.toml` (name: `todaysdailybattle-api`). The Worker entry is `src/worker.ts` and reuses the same Hono `createApp()` as Node.

**Sync data** (copy `next-app/data` → `src/pilot-data/` for the bundle):

```bash
cd api
npm run sync:pilot-data
```

**Develop** (local Workers runtime):

```bash
cd api
npm run dev:worker
```

**Deploy** (requires `wrangler login` and a Cloudflare account):

```bash
cd api
npm run deploy:worker
```

Optional: in `wrangler.toml`, uncomment `[[routes]]` to attach `api.todaysdailybattle.com` (set zone to your account).

| Worker env | Notes |
|------------|--------|
| `SERVICE_VERSION` | Shown on `GET /health` (see `[vars]` in `wrangler.toml`). |
| `ASSETS` | Optional. Files in `api/public/`; served under `GET /_static/*`. |
| `TDB_DATA_DIR` | **Not used** on Workers (no filesystem). Use bundled `pilot-data` or later R2/KV in code. |

**R2 / KV (later):** extend `tdb-init-worker.ts` to read bindings; keep `parseTdbToCached` as the single validation path.

## Environment (Node only)

| Variable | Purpose |
|----------|---------|
| `TDB_DATA_DIR` | Absolute path to the folder **containing** the three JSON files. |
| `PORT` | Listen port (default `8787`). |
| `SERVICE_VERSION` | Optional string returned by `GET /health`. |

## Endpoints (quick reference)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/health` | Liveness + readiness; `runtime` is `node` or `cloudflare-worker`. |
| GET | `/openapi.json` | OpenAPI 3 spec. |
| GET | `/docs` | Swagger UI. |
| GET | `/_static/*` | Only if `ASSETS` is bound (optional files under `api/public/`). |
| GET | `/v1/verse/daily` | Today’s canon verse. |
| GET | `/v1/verse/canon` | Today + catalog. |
| GET | `/v1/plans` | Battle plans list. |
| GET | `/v1/plans/:slug` | One plan. |
| GET | `/v1/calm/moods` | Calm mood lanes. |
| GET | `/v1/meta` | Resolved data root + load time. |
| \* | `/trpc/*` | tRPC over HTTP. |

**Rate limits:** in-memory, per instance (Node) or per isolate (Workers; default 100 req/min on `/v1` + `/trpc`). Add Cloudflare WAF or Rate Limiting rules in production for global limits.

## Scripts

- `npm run dev` — Node, watch (`tsx`), port `PORT` or 8787.
- `npm run build` / `npm run start` — compile and run `dist/index.js`.
- `npm run typecheck` — TypeScript.
- `npm run sync:pilot-data` — copy `next-app/data` → `src/pilot-data/`.
- `npm run dev:worker` — sync + `wrangler dev`.
- `npm run deploy:worker` — sync + `wrangler deploy`.

## Deploy note (Node)

Copy `next-app/data` onto the host and set `TDB_DATA_DIR` if path discovery from `process.cwd()` fails.
