import { router } from "./trpc.js";
import { calmRouter } from "./routers/calm.js";
import { metaRouter } from "./routers/meta.js";
import { plansRouter } from "./routers/plans.js";
import { verseRouter } from "./routers/verse.js";

export const appRouter = router({
  verse: verseRouter,
  plans: plansRouter,
  calm: calmRouter,
  meta: metaRouter,
});

export type AppRouter = typeof appRouter;
