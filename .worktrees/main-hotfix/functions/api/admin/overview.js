import {
  countRows,
  envFlagSummary,
  json,
  requireOwner,
  selectRows
} from '../../_lib/ownerApi.js';

function countByField(rows, field) {
  const counts = {};
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const key = String((row && row[field]) || 'unknown');
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

export async function onRequestGet({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const tableCounts = await Promise.all([
    countRows(env, 'messages'),
    countRows(env, 'message_reports'),
    countRows(env, 'prayers'),
    countRows(env, 'newsletter_signups'),
    countRows(env, 'supporter_waitlist'),
    countRows(env, 'shop_waitlist'),
    countRows(env, 'contact_messages'),
    countRows(env, 'daily_battles'),
    countRows(env, 'prayer_reports'),
    countRows(env, 'owner_content_entries'),
    countRows(env, 'owner_audit_log')
  ]);

  const [messages, reports, prayers, newsletter, supporterWaitlist, shopWaitlist, contactMessages, dailyBattles, prayerReports, ownerContent, ownerAudit] = tableCounts;

  const latestBattle = await selectRows(env, 'daily_battles', 'order=date.desc&limit=1');
  const profiles = await selectRows(env, 'profiles', 'select=id,tier&limit=500&order=updated_at.desc.nullslast');
  const subscriptions = await selectRows(env, 'battle_pro_subscriptions', 'select=id,plan,updated_at&limit=500&order=updated_at.desc.nullslast');

  return json({
    owner: {
      id: auth.user.id,
      email: auth.user.email || '',
      role: auth.user.app_metadata && auth.user.app_metadata.role || 'admin'
    },
    env: envFlagSummary(env),
    counts: {
      messages: messages.count,
      messageReports: reports.count,
      prayers: prayers.count,
      prayerReports: prayerReports.count,
      newsletterSignups: newsletter.count,
      supporterWaitlist: supporterWaitlist.count,
      shopWaitlist: shopWaitlist.count,
      contactMessages: contactMessages.count,
      dailyBattles: dailyBattles.count,
      ownerContentEntries: ownerContent.count,
      ownerAuditEntries: ownerAudit.count
    },
    latestBattle: latestBattle.ok && latestBattle.data[0] ? latestBattle.data[0] : null,
    subscriptionPlans: countByField(subscriptions.data, 'plan'),
    profileTiers: countByField(profiles.data, 'tier')
  });
}
