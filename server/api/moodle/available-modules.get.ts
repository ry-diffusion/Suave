import { institutions } from "~~/server/lib/institutions";
import {
  AuthenticatedMoodleApiClient,
  MoodleApiClient,
} from "~~/shared/moodle";
import type {
  MoodleContentData,
  MoodleModule,
  MoodleModuleData,
} from "~~/shared/moodle.d";

interface ModuleExtDate {
  name?: string;
  allowSubmissionsFrom: Date;
  dueDate: Date;
}

function parseByDate(moodleModule: MoodleModuleData): ModuleExtDate | null {
  if (moodleModule.dates && moodleModule.dates.length > 1) {
    const allowSubmissionsFrom = new Date(
      moodleModule.dates[0].timestamp * 1000
    );
    const dueDate = new Date(moodleModule.dates[1].timestamp * 1000);

    return {
      allowSubmissionsFrom,
      dueDate,
    };
  }

  return null;
}

function parseByCustomData(
  moodleModule: MoodleModuleData
): ModuleExtDate | null {
  if (moodleModule.customdata) {
    try {
      const payload = JSON.parse(moodleModule.customdata);
      if (payload.customdata) {
        const dueDate = new Date(payload.customdata.duedate * 1000);
        const allowSubmissionsFrom = new Date(
          payload.customdata.allowsubmissionsfromdate * 1000
        );
        return {
          allowSubmissionsFrom,
          dueDate,
        };
      }
    } catch {
      // Ignore JSON parsing errors
    }
  }

  return null;
}

function parseByRegex(moodleModule: MoodleModuleData): ModuleExtDate | null {
  const regex =
    /(?<qNome>\w* \d{1,2}) \((?<abre>\d{2}\/\d{2})\s*-\s*(?<fecha>\d{2}\/\d{2})\)/;
  const match = moodleModule.name.match(regex);

  const parse = (currentYear: number, abre: string) => {
    const [day, month] = abre.split("/");
    return new Date(`${currentYear}-${month}-${day}`);
  };

  if (match) {
    const currentYear = new Date().getFullYear();
    const dueDate = parse(currentYear, match.groups?.fecha as string);
    const allowSubmissionsFrom = parse(
      currentYear,
      match.groups?.abre as string
    );

    return {
      name: match.groups?.qNome as string,
      allowSubmissionsFrom,
      dueDate,
    };
  }

  return null;
}

function parseModules(contents: MoodleContentData[]): MoodleModule[] {
  const found: MoodleModule[] = [];

  for (const content of contents) {
    for (const moodleModule of content.modules) {
      if (moodleModule.modname === "label" || !moodleModule.uservisible) {
        continue;
      }

      const queries = [parseByCustomData, parseByDate, parseByRegex];
      let result: ModuleExtDate | null = null;

      for (const doQuery of queries) {
        result = doQuery(moodleModule);
        if (result) {
          break;
        }
      }

      const module: MoodleModule = {
        name: result?.name || moodleModule.name,
        parent: content.name,
        kind: moodleModule.modname,
        url: moodleModule.url,
        allowSubmissionsFrom: result?.allowSubmissionsFrom,
        dueDate: result?.dueDate,
        createdAt: moodleModule.contentsinfo
          ? new Date(moodleModule.contentsinfo.lastmodified * 1000)
          : undefined,
        hasCompleted: moodleModule.completiondata?.state === 1,
        id: moodleModule.id,
        instance: moodleModule.instance,
      };

      found.push(module);
    }
  }

  return found;
}

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const institution = session?.user?.institution;
    const authContext = session?.secure?.authContext;
    const query = getQuery(event);
    const courseId = query.courseId ? Number(query.courseId) : null;

    if (!institution || !authContext) {
      throw createError({
        statusCode: 401,
        statusMessage: "Sessão expirada ou inválida. Faça login novamente.",
        data: { error: "UNAUTHORIZED" },
      });
    }

    if (!courseId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Course ID is required",
        data: { error: "COURSE_ID_REQUIRED" },
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
    const contentsResult = await authenticatedClient.fetchCourseContents(
      courseId
    );

    if (contentsResult.error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch course contents",
        data: { error: "FETCH_FAILED" },
      });
    }

    const modules = parseModules(contentsResult.data);

    return {
      modules,
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
