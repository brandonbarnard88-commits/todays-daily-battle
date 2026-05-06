import { listCalmMoods } from "../../services/tdb-data.js";
import { publicProcedure, router } from "../trpc.js";

/** Calm “library” lanes: mood → ordered KJV refs (pilot data). */
export const calmRouter = router({
  listMoods: publicProcedure.query(() => {
    return { moods: listCalmMoods() };
  }),
});
