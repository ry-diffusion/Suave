import type { MoodleAuthSchema, MoodleAuthContext, MoodleAssignment } from "../../types/moodle.d.ts";
import { IEadProvider } from "./IEadProvider";
import { PromiseResult, Result } from "../../shared/result";
import { tryFetchJson } from "~~/shared/http";
import { AppException } from "~~/shared/errors.js";


export class MoodleEadProvider implements IEadProvider<MoodleAuthSchema, MoodleAuthContext, MoodleAssignment> {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    authenticate(authSchema: MoodleAuthSchema): PromiseResult<MoodleAuthContext> {
        const url = `${this.baseUrl}/login/token.php`;
        const body = new URLSearchParams({
            username: authSchema.username,
            password: authSchema.password,
            service: "moodle_mobile_app",
        });

        return tryFetchJson<any>(url, {
            method: "POST",
            body,
        })
            .tap(() => console.log(`[Log] Alguém está tentando logar no moodle (${authSchema.username})`))
            .ensure(
                (data) => !data.error,
                (data) => new AppException(`[MOODLE] ${data.error}`, "MOODLE_LOGIN_FAILED")
            )
            .ensure(
                (data) => data.token,
                new Error("[SERVIDOR] O moodle não retornou um token de acesso")
            )
            .tap(() => console.log(`[Log] Alguém logou no moodle (${authSchema.username})`))
            .map((data) => ({
                token: data.token,
                userId: data.userid,
                username: authSchema.username,
            }));
    }

    getAssignments(authContext: MoodleAuthContext): PromiseResult<MoodleAssignment[]> {
        const url = `${this.baseUrl}/webservice/rest/server.php?wsfunction=mod_assign_get_assignments&moodlewsrestformat=json&wstoken=${authContext.token}`;
        return tryFetchJson<any>(url)
            .ensure(
                (data) => Array.isArray(data.courses),
                new Error("Invalid assignments response")
            )
            .map((data) =>
                data.courses.flatMap((course: any) =>
                    course.assignments.map((a: any) => ({
                        id: a.id,
                        name: a.name,
                        dueDate: new Date(a.duedate * 1000),
                        courseId: course.id,
                    }))
                )
            );
    }
} 