import { AppException } from "~~/shared/errors";
import { type Result, wrapPromise } from "~~/shared/result";
import type {
  ClassicAuthSchema,
  MoodleAssignment,
  MoodleAuthContext,
} from "~~/types/moodle";
import type { IEadProvider, IEadSiteInfo } from "./IEadProvider";

// Native Moodle Mobile API implementation
class NativeMoodleClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  private async makeRequest(
    wsfunction: string,
    params: Record<string, any> = {},
    token?: string
  ): Promise<any> {
    const url = `${this.baseUrl}/webservice/rest/server.php`;
    const formData = new FormData();

    formData.append("wstoken", token || "");
    formData.append("wsfunction", wsfunction);
    formData.append("moodlewsrestformat", "json");

    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Flatten arrays to K[IDX] format like the Python example
          value.forEach((val, index) => {
            formData.append(`${key}[${index}]`, String(val));
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "MoodleMobile/4.0.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Check for Moodle-specific errors
    if (data.exception) {
      throw new Error(data.message || data.exception);
    }

    if (data.errorcode) {
      throw new Error(data.message || `Error: ${data.errorcode}`);
    }

    return data;
  }

  async authenticate(credentials: {
    username: string;
    password: string;
  }): Promise<{ token: string; userId: number; username: string }> {
    // Use mobile app authentication endpoint
    const url = `${this.baseUrl}/login/token.php`;
    const formData = new FormData();

    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("service", "moodle_mobile_app");

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "MoodleMobile/4.0.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error("Authentication failed: No token received");
    }

    return {
      token: data.token,
      userId: data.userid || 0,
      username: credentials.username,
    };
  }

  async getSiteInfo(token: string): Promise<{
    userpictureurl?: string;
    fullname?: string;
    [key: string]: any;
  }> {
    // Use mobile-specific site info endpoint
    return await this.makeRequest(
      "core_webservice_get_site_info",
      {
        serviceshortnames: ["moodle_mobile_app"],
      },
      token
    );
  }

  async getAssignments(token: string): Promise<{
    courses: Array<{
      id: number;
      assignments: Array<{
        id: number;
        name: string;
        duedate: number;
      }>;
    }>;
  }> {
    // Use mobile-specific assignments endpoint
    return await this.makeRequest(
      "mod_assign_get_assignments",
      {
        includenotenrolledcourses: 1,
        limitfrom: 0,
        limitnum: 50,
      },
      token
    );
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.makeRequest("core_webservice_get_site_info", {}, token);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export class MoodleEadProvider
  implements
    IEadProvider<ClassicAuthSchema, MoodleAuthContext, MoodleAssignment>
{
  private baseUrl: string;
  private client: NativeMoodleClient;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.client = new NativeMoodleClient(baseUrl);
  }

  async authenticate(
    authSchema: ClassicAuthSchema
  ): Promise<Result<MoodleAuthContext, Error>> {
    const result = await wrapPromise(
      this.client.authenticate({
        username: authSchema.username,
        password: authSchema.password,
      })
    );

    if (!result.error) {
      console.log(
        `[Log] Alguém está tentando logar no moodle (${authSchema.username})`
      );
    }

    return result
      .letError(Error, (e) => {
        return new AppException(`[MOODLE] ${e.message}`, "MOODLE_LOGIN_FAILED");
      })
      .assert(
        (data) => !!data.token,
        new Error("[SERVIDOR] O moodle não retornou um token de acesso")
      )
      .let((data) => {
        console.log(`[Log] Alguém logou no moodle (${authSchema.username})`);
        return {
          token: data.token,
          userId: data.userId,
          username: data.username,
        };
      });
  }

  async getSiteInfo(
    authContext: MoodleAuthContext
  ): Promise<Result<IEadSiteInfo, Error>> {
    const result = await wrapPromise(
      this.client.getSiteInfo(authContext.token)
    );

    return result.let((data) => {
      if (!data.userpictureurl || !data.fullname) {
        throw new Error("Invalid site info response");
      }
      return {
        profilePictureUrl: data.userpictureurl,
        name: data.fullname,
      };
    });
  }

  async getAssignments(
    authContext: MoodleAuthContext
  ): Promise<Result<MoodleAssignment[], Error>> {
    const result = await wrapPromise(
      this.client.getAssignments(authContext.token)
    );

    return result.let((data) => {
      if (!Array.isArray(data.courses))
        throw new Error("Invalid assignments response");
      return data.courses.flatMap((course) =>
        course.assignments.map((a) => ({
          id: a.id,
          name: a.name,
          dueDate: new Date(a.duedate * 1000),
          courseId: course.id,
        }))
      );
    });
  }
}
