import { z } from "zod";

import { getBattlePlanBySlug, listBattlePlans } from "../../services/tdb-data.js";
import { publicProcedure, router } from "../trpc.js";

export const plansRouter = router({
  list: publicProcedure.query(() => {
    return { plans: listBattlePlans() };
  }),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(({ input }) => {
      const plan = getBattlePlanBySlug(input.slug);
      if (!plan) {
        return { found: false as const, plan: null };
      }
      return { found: true as const, plan };
    }),
});
