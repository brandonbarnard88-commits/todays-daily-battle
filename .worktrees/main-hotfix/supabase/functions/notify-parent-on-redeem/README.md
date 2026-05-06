# notify-parent-on-redeem

Sends an email to the parent when their kid redeems an invite code on Kids Battle.

## Flow

1. Kid enters code on `/kids/` and clicks Connect.
2. Client calls `redeem_invite_code` RPC.
3. On success, client calls this edge function (fire-and-forget).
4. Function looks up parent email from `kids_beta_waitlist` (where `invite_code` matches and `used = true`).
5. Sends Mailgun email: "Your kid connected! Code: ABC123. Last story: Jonah. Talk about: ..."

## Request

```
POST /functions/v1/notify-parent-on-redeem
Content-Type: application/json

{
  "code": "ABC123",
  "lastStoryTitle": "Jonah & the Big Fish",
  "lastStoryApply": "When you run from God, He still loves you—come back and obey!"
}
```

## Response

Always returns `{ "ok": true }` (200). Failures are logged only—no error surfaced to client.

## Secrets

Set in Supabase Dashboard → Edge Functions → notify-parent-on-redeem → Secrets:

| Secret | Description |
|--------|-------------|
| MAILGUN_API_KEY | Mailgun private API key |
| MAILGUN_DOMAIN | Sending domain (e.g. mg.todaysdailybattle.com) |
| MAILGUN_FROM | e.g. Kids Battle \<noreply@mg.todaysdailybattle.com\> |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually set automatically.

## Deploy

```bash
supabase functions deploy notify-parent-on-redeem
```
