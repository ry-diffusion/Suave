import { institutions } from "~~/server/lib/institutions";

export default defineEventHandler(async () => {
  try {
    // Filter institutions that have Moodle configured
    const moodleInstitutions = institutions
      .filter((institution) => institution.moodle)
      .map((institution) => ({
        id: institution.id,
        name: institution.name,
        moodleUrl: institution.moodle?.moodleUrl,
      }));

    return {
      institutions: moodleInstitutions,
    };
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: { error: "INTERNAL_ERROR" },
    });
  }
});
