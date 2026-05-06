import {
  getCanonVerseList,
  getDailyVerse,
} from "../../services/tdb-data.js";
import { publicProcedure, router } from "../trpc.js";

export const verseRouter = router({
  getDaily: publicProcedure.query(() => {
    return { verse: getDailyVerse() };
  }),
  getCanon: publicProcedure.query(() => {
    return { verses: getCanonVerseList() };
  }),
});
