import { institutions } from "~~/server/lib/institutions";
import {
  AuthenticatedMoodleApiClient,
  MoodleApiClient,
} from "~~/shared/moodle";

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const institution = session?.user?.institution;
    const authContext = session?.secure?.authContext;

    if (!institution || !authContext) {
      throw createError({
        statusCode: 401,
        statusMessage: "Sessão expirada ou inválida. Faça login novamente.",
        data: { error: "UNAUTHORIZED" },
      });
    }

    const institutionConfig = institutions.find(
      (inst) => inst.id === institution
    );
    if (!institutionConfig || !institutionConfig.moodle) {
      throw createError({
        statusCode: 400,
        statusMessage: "Institution not supported",
        data: { error: "INSTITUTION_NOT_SUPPORTED" },
      });
    }

    const moodleToken = authContext.ead?.token;
    if (!moodleToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Token do Moodle não encontrado na sessão",
        data: { error: "MOODLE_TOKEN_MISSING" },
      });
    }

    const moodleClient = new MoodleApiClient(
      institutionConfig.moodle.moodleUrl
    );
    const authenticatedClient =
      AuthenticatedMoodleApiClient.fromUnauthenticated(
        moodleClient,
        moodleToken
      );

    const coursesResult =
      await authenticatedClient.fetchEnrolledCoursesByTimelineClassification();

    if (coursesResult.error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch courses",
        data: { error: "FETCH_FAILED" },
      });
    }

    // Filter only visible courses
    const visibleCourses = coursesResult.data.courses.filter(
      (course) => course.visible
    );

    return {
      courses: visibleCourses,
    };
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: { error: "INTERNAL_ERROR" },
    });
  }
});
