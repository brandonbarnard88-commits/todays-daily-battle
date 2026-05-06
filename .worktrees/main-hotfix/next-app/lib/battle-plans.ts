import plansRaw from "@/data/battle-plans.json";

export type PlanDay = {
  day: number;
  reference: string;
  gentleNote?: string;
};

export type BattlePlan = {
  slug: string;
  title: string;
  tagline: string;
  days: PlanDay[];
};

const plans = (plansRaw.plans ?? []) as BattlePlan[];

export function listPlans(): readonly BattlePlan[] {
  return plans;
}

export function getPlanBySlug(slug: string): BattlePlan | undefined {
  return plans.find((p) => p.slug === slug);
}

export function listPlanSlugs(): string[] {
  return plans.map((p) => p.slug);
}
