import { AppException } from "./errors";
import { tryFetchJson } from "./http";

export * from "./moodle.d";

import type {
  GetEnrolledCoursesResponse,
  MoodleAssignmentsResponse,
  MoodleContentData,
  MoodleCourse,
  MoodleError,
  MoodleLoginInput,
  MoodleLoginOutput,
  MoodleQuiz,
  MoodleSiteInfo,
} from "./moodle.d";

import { Err, Ok, type Result } from "./result";

export async function moodleFetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<Result<T, Error>> {
  const result = await tryFetchJson<T>(url, init);
  if (
    result.error &&
    result.data &&
    typeof result.data === "object" &&
    "error" in result.data
  ) {
    return Err(
      new AppException(
        `[MOODLE] ${(result.data as MoodleError).error}`,
        "MOODLE_ERROR"
      )
    );
  }
  return result;
}

export class MoodleApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async login(
    creds: MoodleLoginInput
  ): Promise<Result<MoodleLoginOutput, Error>> {
    try {
      const formData = new FormData();
      formData.append("username", creds.username);
      formData.append("password", creds.password);
      formData.append("service", "moodle_mobile_app");

      const response = await fetch(`${this.baseUrl}/login/token.php`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return Err(
          new Error(`HTTP ${response.status}: ${response.statusText}`)
        );
      }

      const data = await response.json();

      if (data.error) {
        return Err(
          new AppException(`[MOODLE] ${data.error}`, "MOODLE_LOGIN_ERROR")
        );
      }

      if (!data.token) {
        return Err(
          new AppException("[MOODLE] No token received", "MOODLE_LOGIN_ERROR")
        );
      }

      return Ok(data as MoodleLoginOutput);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async call<T>(
    wsfunction: string,
    params: Record<string, string | number | object> = {},
    token?: string
  ): Promise<Result<T, Error>> {
    try {
      const url = `${this.baseUrl}/webservice/rest/server.php`;
      const formData = new FormData();

      if (token) {
        formData.append("wstoken", token);
      }
      formData.append("wsfunction", wsfunction);
      formData.append("moodlewsrestformat", "json");

      // Flatten parameters to Moodle format
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val, idx) => {
            formData.append(`${key}[${idx}]`, String(val));
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "User-Agent": "MoodleMobile/4.0.0",
        },
      });

      if (!response.ok) {
        return Err(
          new Error(`HTTP ${response.status}: ${response.statusText}`)
        );
      }

      const data = await response.json();

      if (data.error || data.errorcode) {
        return Err(
          new AppException(
            `[MOODLE] ${data.error || data.message}`,
            "MOODLE_API_ERROR"
          )
        );
      }

      return Ok(data as T);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export class AuthenticatedMoodleApiClient extends MoodleApiClient {
  private token: string;

  constructor(baseUrl: string, token: string) {
    super(baseUrl);
    this.token = token;
  }

  static fromUnauthenticated(
    client: MoodleApiClient,
    token: string
  ): AuthenticatedMoodleApiClient {
    // Access the private baseUrl through bracket notation
    const baseUrl = (client as unknown as { baseUrl: string }).baseUrl;
    return new AuthenticatedMoodleApiClient(baseUrl, token);
  }

  async fetchSiteInfo(): Promise<Result<MoodleSiteInfo, Error>> {
    return this.call<MoodleSiteInfo>(
      "core_webservice_get_site_info",
      {},
      this.token
    );
  }

  async fetchEnrolledCoursesByTimelineClassification(): Promise<
    Result<GetEnrolledCoursesResponse, Error>
  > {
    const result = await this.call<{ courses: MoodleCourse[] }>(
      "core_course_get_enrolled_courses_by_timeline_classification",
      {
        classification: "all",
        limit: 0,
        offset: 0,
      },
      this.token
    );

    if (result.error) {
      return result;
    }

    return Ok({ courses: result.data.courses });
  }

  async fetchCourseContents(
    courseId: number
  ): Promise<Result<MoodleContentData[], Error>> {
    const response = await this.call<MoodleContentData[]>(
      "core_course_get_contents",
      {
        courseid: courseId,
      },
      this.token
    );

    if (response.error) {
      return response;
    }

    const contents = response.data;

    // Sort modules by the most recent `lastmodified` date
    contents.forEach((section) => {
      if (section.modules) {
        section.modules.sort((a, b) => {
          const dateA = b.contentsinfo?.lastmodified || 0;
          const dateB = a.contentsinfo?.lastmodified || 0;
          return dateA - dateB;
        });
      }
    });

    console.log("fetchCourseContents response:", contents[0]?.modules);
    return Ok(contents);
  }

  async fetchAssignments(): Promise<Result<MoodleAssignmentsResponse, Error>> {
    return this.call<MoodleAssignmentsResponse>(
      "mod_assign_get_assignments",
      {},
      this.token
    );
  }

  async fetchQuizzes(
    courseId: number
  ): Promise<Result<{ quizzes: MoodleQuiz[] }, Error>> {
    return this.call<{ quizzes: MoodleQuiz[] }>(
      "mod_quiz_get_quizzes_by_courses",
      {
        courseids: [courseId],
      },
      this.token
    );
  }

  async fetchCourseCompletionStatus(
    courseId: number,
    userId?: number
  ): Promise<Result<{ completions: unknown[] }, Error>> {
    const params: Record<string, string | number> = {
      courseid: courseId,
    };

    if (userId) {
      params.userid = userId;
    }

    return this.call<{ completions: unknown[] }>(
      "core_completion_get_course_completion_status",
      params,
      this.token
    );
  }

  async fetchUpcomingCalendarEvents(): Promise<
    Result<
      {
        events: unknown[];
        defaulteventcontext: number;
        filter_selector: string;
        courseid: number;
        categoryid: number | null;
        isloggedin: boolean;
        date: {
          seconds: number;
          minutes: number;
          hours: number;
          mday: number;
          wday: number;
          mon: number;
          year: number;
          yday: number;
          weekday: string;
          month: string;
          timestamp: number;
        };
      },
      Error
    >
  > {
    return this.call<{
      events: unknown[];
      defaulteventcontext: number;
      filter_selector: string;
      courseid: number;
      categoryid: number | null;
      isloggedin: boolean;
      date: {
        seconds: number;
        minutes: number;
        hours: number;
        mday: number;
        wday: number;
        mon: number;
        year: number;
        yday: number;
        weekday: string;
        month: string;
        timestamp: number;
      };
    }>("core_calendar_get_calendar_upcoming_view", {}, this.token);
  }
}
