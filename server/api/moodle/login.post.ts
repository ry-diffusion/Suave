import { MoodleApiClient } from "~~/shared/moodle";
import { institutions } from "~~/server/lib/institutions";
import type { MoodleLoginInput } from "~~/shared/moodle.d";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    const body = await readBody<MoodleLoginInput>(event);
    const institutionId = getHeader(event, "X-Institution");

    if (!institutionId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Institution not specified",
        data: { error: "INSTITUTION_NOT_SPECIFIED" },
      });
    }

    const institution = institutions.find((inst) => inst.id === institutionId);
    if (!institution || !institution.moodle) {
      throw createError({
        statusCode: 400,
        statusMessage: "Institution not supported",
        data: { error: "INSTITUTION_NOT_SUPPORTED" },
      });
    }

    const moodleClient = new MoodleApiClient(institution.moodle.moodleUrl);
    const loginResult = await moodleClient.login(body);

    if (loginResult.error) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication failed",
        data: { error: "AUTHENTICATION_FAILED" },
      });
    }

    return loginResult.data;
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: {
        error: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
    });
  }
});
