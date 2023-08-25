import { NextResponse } from "next/server";

import {
  SECURITIES_BASE_URL,
  SECURITY_TYPES,
} from "@/constancts";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const type: any = searchParams.get("type") || "";
  if (!type) return errorResponse("Missing type");
  if (!SECURITY_TYPES.includes(type)) return errorResponse("Type is invalid");

  const url = new URL(`${SECURITIES_BASE_URL}/${type}`);
  url.searchParams.set("format", "json");

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json({ data });
};

const errorResponse = (msg: string) => new Response(msg, { status: 400 });
