import { NextResponse } from "next/server";
import { corsHeaders } from "./cors";

function applyCors(response, request) {
  const incoming = corsHeaders(request);
  incoming.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}

export function jsonWithCors(body, init, request) {
  const response = NextResponse.json(body, init);
  return applyCors(response, request);
}

export function emptyWithCors(request, status = 204) {
  const response = new NextResponse(null, { status });
  return applyCors(response, request);
}
