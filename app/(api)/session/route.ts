import { defaultSession } from "@/types/session-data";
import { getSession } from "@/lib/auth/server";
import { NextRequest } from "next/server";
import { moodleByName } from "@/Support/Institutions";
import {
  badRequest,
  moodleIssue,
  ok,
  unsupportedInstitution,
} from "@/lib/api/responses";
import AuthenticatedMobileApi from "@/lib/moodle/AuthenticatedMobileApi";

export async function GET() {
  const session = await getSession();

  console.log("GET /session", session);
  if (!session.isLoggedIn) {
    return Response.json(defaultSession);
  }

  if (session.loggedInAt === undefined) {
    console.log("Destruindo sessão por falta de loggedInAt");
    session.destroy();
    return Response.json(defaultSession);
  }

  // se o token tiver mais de um mês, destrói a sessão
  const loggedInAt = new Date(session.loggedInAt);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  if (loggedInAt < oneMonthAgo) {
    console.log("Destruindo sessão... Token expirado");
    session.destroy();
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

export async function DELETE() {
  const session = await getSession();

  session.destroy();

  return Response.json(defaultSession);
}
