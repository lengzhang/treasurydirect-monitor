import { NextResponse } from "next/server";

import {
  SECURITIES_BASE_URL,
  SECURITY_TYPES,
  SECURITY_TYPES_TYPE,
} from "@/constancts";

const BASE_URL = `${SECURITIES_BASE_URL}/announced`;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const format: string = searchParams.get("format") || "json";
  const pageSize: number =
    Number.parseInt(searchParams.get("pageSize") || "") || 250;
  const type = (searchParams.get("type") || "") as SECURITY_TYPES_TYPE;
  const days: number = Number.parseInt(searchParams.get("days") || "") || 7;

  const url = new URL(BASE_URL);
  url.searchParams.set("format", format);
  if (type) {
    if (!SECURITY_TYPES.includes(type)) return errorResponse("Type is invalid");
    url.searchParams.set("type", type);
  }
  url.searchParams.set("pagesize", pageSize.toString());
  url.searchParams.set("days", days.toString());

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json({ data });
};

const errorResponse = (msg: string) => new Response(msg, { status: 400 });
