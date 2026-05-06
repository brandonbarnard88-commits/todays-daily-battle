import { getDataMeta } from "../../services/tdb-data.js";
import { publicProcedure, router } from "../trpc.js";

export const metaRouter = router({
  getData: publicProcedure.query(() => getDataMeta()),
});
