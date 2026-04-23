import { randomUUID } from "node:crypto";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TrpcContext = {
  requestId: string;
};

export async function createTrpcContext(
  opts: FetchCreateContextFnOptions
): Promise<TrpcContext> {
  const requestId =
    opts.req.headers.get("x-request-id")?.trim() || randomUUID();
  return { requestId };
}
