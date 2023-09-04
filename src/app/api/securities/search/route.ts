import { NextResponse } from "next/server";

import {
  SECURITIES_BASE_URL,
  SECURITY_TYPES,
  SECURITY_TYPES_TYPE,
} from "@/constancts";

const BASE_URL = `${SECURITIES_BASE_URL}/search`;

export const GET = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const searchParams = Object.fromEntries(requestUrl.searchParams);

  const pagesize = Number.parseInt(searchParams.pagesize || "250");
  if (Number.isNaN(pagesize)) return errorResponse("pagesize must be numeric");
  const pagenum = Number.parseInt(searchParams.pagenum || "0");
  if (Number.isNaN(pagenum)) return errorResponse("pagenum must be numeric");

  if (
    searchParams.type &&
    !SECURITY_TYPES.includes(searchParams.type as SECURITY_TYPES_TYPE)
  ) {
    return errorResponse("type is invalid");
  }

  const url = new URL(`${BASE_URL}${requestUrl.search}`);
  url.searchParams.set("format", "json");
  url.searchParams.set("pagesize", `${pagesize}`);
  url.searchParams.set("pagenum", `${pagenum}`);

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json({ data, pagesize, pagenum });
};

const errorResponse = (msg: string) => new Response(msg, { status: 400 });
