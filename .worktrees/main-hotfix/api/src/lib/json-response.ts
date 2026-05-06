export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
};

export function jsonError(
  code: string,
  message: string,
  status: number,
  requestId?: string
): Response {
  const body: ApiErrorBody = {
    error: { code, message, ...(requestId ? { requestId } : {}) },
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
