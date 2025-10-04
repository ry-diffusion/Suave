import { institutions } from "~~/server/lib/institutions";
import {
  AuthenticatedMoodleApiClient,
  MoodleApiClient,
} from "~~/shared/moodle";
import type {
  GetCalendarUpcomingViewResponse,
  MoodleCalendarEvent,
} from "~~/shared/moodle.d";

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

    // Chama a API core_calendar_get_calendar_upcoming_view
    const response = await authenticatedClient.fetchUpcomingCalendarEvents();

    if (response.error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch upcoming events",
        data: { error: "FETCH_FAILED" },
      });
    }

    // Filtrar apenas eventos de quiz e assign
    const filteredEvents = (
      response.data.events as MoodleCalendarEvent[]
    ).filter((event) => {
      const modulename = event.modulename?.toLowerCase() || "";
      return modulename === "quiz" || modulename === "assign";
    });

    const result: GetCalendarUpcomingViewResponse = {
      ...response.data,
      events: filteredEvents,
    };

    return result;
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error;
    }

    console.error("Erro ao buscar eventos do calendário:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: { error: "INTERNAL_ERROR" },
    });
  }
});
