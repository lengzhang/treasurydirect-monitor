import { NextResponse } from "next/server";

import { SECURITIES_BASE_URL } from "@/app/api/constancts";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const cusip: string = searchParams.get("cusip") || "";
  if (!cusip) return errorResponse("Missing cusip");
  const issueDate: string = searchParams.get("issueDate") || "";
  if (!issueDate) return errorResponse("Missing issue date");

  const date = new Date(issueDate);
  if (isNaN(date.getTime())) return errorResponse("Issue date is invalid");

  const year = date.getUTCFullYear().toString();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");

  const res = await fetch(
    `${SECURITIES_BASE_URL}/${cusip}/${month}/${day}/${year}`
  );
  const data = await res.json();

  return NextResponse.json(data);
};

const errorResponse = (msg: string) => new Response(msg, { status: 400 });
