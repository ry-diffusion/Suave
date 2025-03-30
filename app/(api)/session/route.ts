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

  if (!session.isLoggedIn) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

export async function DELETE() {
  const session = await getSession();

  session.destroy();

  return Response.json(defaultSession);
}
