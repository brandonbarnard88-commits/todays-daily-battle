import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TrpcContext = {
  requestId: string;
};

function randomId(): string {
  return globalThis.crypto.randomUUID();
}

export async function createTrpcContext(
  opts: FetchCreateContextFnOptions
): Promise<TrpcContext> {
  const requestId =
    opts.req.headers.get("x-request-id")?.trim() || randomId();
  return { requestId };
}
