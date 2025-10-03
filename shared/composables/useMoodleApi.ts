import type {
  CourseCompletionStatusResponse,
  GetAvailableModulesResponse,
  GetEnrolledCoursesResponse,
  MoodleLoginInput,
  MoodleLoginOutput,
  WhoamiResponse,
} from "../moodle.d";
import { Err, Ok, type Result } from "../result";
import { useClientFetch } from "./useClientFetch";

export interface AvailableInstitution {
  id: string;
  name: string;
  moodleUrl?: string;
}

export interface GetAvailableInstitutionsResponse {
  institutions: AvailableInstitution[];
}

export function useMoodleApi() {
  const { clientFetch } = useClientFetch();

  /**
   * Get all available Moodle institutions
   */
  const getAvailableInstitutions = async (): Promise<
    Result<GetAvailableInstitutionsResponse, Error>
  > => {
    try {
      const result = await clientFetch<GetAvailableInstitutionsResponse>(
        "/api/moodle/available-institutions"
      );
      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Login to a Moodle institution
   * Note: This endpoint still uses manual authentication for login purposes
   */
  const login = async (
    credentials: MoodleLoginInput,
    institutionId: string
  ): Promise<Result<MoodleLoginOutput, Error>> => {
    try {
      const result = await clientFetch<MoodleLoginOutput>("/api/moodle/login", {
        method: "POST",
        body: credentials,
        headers: {
          "X-Institution": institutionId,
        },
      });
      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Get current user information
   * Uses session authentication - no parameters needed
   */
  const whoami = async (): Promise<Result<WhoamiResponse, Error>> => {
    try {
      const result = await clientFetch<WhoamiResponse>("/api/moodle/whoami");
      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Get enrolled courses
   * Uses session authentication - no parameters needed
   */
  const getEnrolledCourses = async (): Promise<
    Result<GetEnrolledCoursesResponse, Error>
  > => {
    try {
      const result = await clientFetch<GetEnrolledCoursesResponse>(
        "/api/moodle/enrolled-courses"
      );
      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Get available modules for a course
   * Uses session authentication - only courseId needed as parameter
   */
  const getAvailableModules = async (
    courseId: number
  ): Promise<Result<GetAvailableModulesResponse, Error>> => {
    try {
      const result = await clientFetch<GetAvailableModulesResponse>(
        `/api/moodle/available-modules?courseId=${courseId}`
      );
      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * Get course completion status
   * Uses session authentication - only courseId and optional userId needed
   */
  const getCourseCompletionStatus = async (
    courseId: number,
    userId?: number
  ): Promise<Result<CourseCompletionStatusResponse, Error>> => {
    try {
      const url = userId
        ? `/api/moodle/course-completion-status?courseId=${courseId}&userId=${userId}`
        : `/api/moodle/course-completion-status?courseId=${courseId}`;

      const result = await clientFetch<CourseCompletionStatusResponse>(url);
      return Ok(result);
    } catch (error) {
      return Err(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return {
    getAvailableInstitutions,
    login,
    whoami,
    getEnrolledCourses,
    getAvailableModules,
    getCourseCompletionStatus,
  };
}
