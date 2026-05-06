import {
  fetchStripeSummary,
  json,
  requireOwner,
  selectRows
} from '../../_lib/ownerApi.js';

function countByPlan(rows) {
  const counts = {};
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const key = String((row && row.plan) || 'unknown');
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

export async function onRequestGet({ request, env }) {
  const auth = await requireOwner(request, env);
  if (auth.error) return auth.error;

  const subscriptions = await selectRows(
    env,
    'battle_pro_subscriptions',
    'select=id,user_id,email,plan,stripe_subscription_id,updated_at&order=updated_at.desc&limit=50'
  );
  const stripe = await fetchStripeSummary(env);

  return json({
    stripeConfigured: stripe.configured,
    subscriptionPlans: countByPlan(subscriptions.data),
    subscriptions: subscriptions.data,
    stripeRecent: stripe.subscriptions.map((item) => ({
      id: item.id,
      status: item.status,
      customer: item.customer,
      current_period_end: item.current_period_end
    }))
  });
}
