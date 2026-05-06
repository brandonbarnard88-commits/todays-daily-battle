# Search Analytics Dashboard Queries

Use these queries to turn `default_rate`, `topic`, `blended_topics`, and `heartfelt_template_used` into actionable insights. Data flows via `trackSearchAnalytics()` → GA4 (or your analytics backend).

## GA4 (BigQuery export)

If you use GA4 with BigQuery export, run these in BigQuery (replace `project.dataset.events_*` with your table):

```sql
-- % defaults last 7 days
SELECT
  SAFE_DIVIDE(
    COUNTIF((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'default_rate') = 1),
    COUNT(*)
  ) * 100 AS default_pct
FROM `project.dataset.events_*`
WHERE event_name = 'search_query'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE());

-- Top 10 blended pairs
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'heartfelt_template_used') AS pair,
  COUNT(*) AS cnt
FROM `project.dataset.events_*`
WHERE event_name = 'search_query'
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'heartfelt_template_used') LIKE 'pair:%'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1
ORDER BY cnt DESC
LIMIT 10;

-- Most common topics (incl. keyword semantic matches)
SELECT
  COALESCE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'topic'), 'keyword_no_match') AS topic,
  COUNT(*) AS cnt
FROM `project.dataset.events_*`
WHERE event_name = 'search_query'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1
ORDER BY cnt DESC
LIMIT 20;

-- Default rate by topic (when topic exists)
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'topic') AS topic,
  COUNTIF((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'default_rate') = 1) AS defaults,
  COUNT(*) AS total,
  SAFE_DIVIDE(COUNTIF((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'default_rate') = 1), COUNT(*)) * 100 AS default_pct
FROM `project.dataset.events_*`
WHERE event_name = 'search_query'
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'topic') IS NOT NULL
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1
ORDER BY total DESC;
```

## GA4 (Reports / Explore)

In GA4 → Explore → Free form:

- **Dimensions:** `Event name`, `Event parameter: topic`, `Event parameter: heartfelt_template_used`, `Event parameter: default_rate`
- **Metrics:** Event count
- **Filters:** `Event name` = `search_query`

Use breakdowns to see topic frequency, blended pairs, and default rate.

## Supabase (if you log to a table)

If you write search events to a Supabase table (e.g. via Edge Function or webhook):

```sql
-- % defaults last 7 days
SELECT
  ROUND(100.0 * SUM(CASE WHEN default_rate = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS default_pct
FROM search_events
WHERE created_at >= NOW() - INTERVAL '7 days';

-- Top 10 blended pairs
SELECT heartfelt_template_used AS pair, COUNT(*) AS cnt
FROM search_events
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND heartfelt_template_used LIKE 'pair:%'
GROUP BY heartfelt_template_used
ORDER BY cnt DESC
LIMIT 10;

-- Most common topics
SELECT COALESCE(topic, 'keyword_no_match') AS topic, COUNT(*) AS cnt
FROM search_events
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY topic
ORDER BY cnt DESC
LIMIT 20;
```

## Action triggers

| Signal | Action |
|--------|--------|
| `default_pct` > 10% | Review top unmatched patterns; add 20–30 phrases |
| Top blend (e.g. `suffering+anxiety`) spiking | Add or refine blended template |
| Topic (e.g. `anxiety`) dominating | Add more phrases/verses for that cluster |
| `default_rate` by topic high | That topic needs more phrase coverage |

---

*See PRIVACY-ANALYTICS.md for what is and isn't sent. No raw query text, no user identity.*
