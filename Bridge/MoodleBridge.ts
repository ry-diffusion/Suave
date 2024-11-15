import { ApiModule, GetAvailableModulesResponse, Module } from "@/app/api/moodle/GetAvailableModules/route";
import { Entry, QueryModule } from "@/app/api/moodle/GetCourseCompletionStatus/route";
import { GetEnrolledCoursesResponse } from "@/app/api/moodle/GetEnrolledCourses/route";
import { Course } from "@/Moodle/AuthenticatedMobileApi";
import { Institution } from "@/Support/Institutions";

export class MoodleBridge {
    accessToken: string;
    institution: Institution;

    constructor(accessToken: string, institution: Institution) {
        this.accessToken = accessToken
        this.institution = institution
    }

    async Whoami() {
        const response = await fetch('/api/moodle/Whoami', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Institution': this.institution
            }
        });
        return await response.json();
    }

    async GetEnrolledCourses(): Promise<GetEnrolledCoursesResponse> {
        const response = await fetch('/api/moodle/GetEnrolledCourses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Institution': this.institution
            }
        });

        return await response.json();
    }

    async GetAvailableModules(courses: Course[]): Promise<GetAvailableModulesResponse> {
        const response = await fetch('/api/moodle/GetAvailableModules', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Institution': this.institution,
            },
            body: JSON.stringify({ courses })
        });
        return await response.json();
    }


    async GetCourseCompletionStatus(query: { courseId: number, modules: (ApiModule | Module)[] }[]): Promise<Entry[]> {
        // Reduce the size of the query by removing unnecessary fields
        const optimizedQuery: { courseId: number, modules: QueryModule[] }[] = query.map(({ courseId, modules }) => {
            return {
                courseId,
                modules: modules.map(module => {
                    return {
                        id: module.id,
                        kind: module.kind,
                        url: module.url,
                        instance: module.instance
                    }
                })
            }
        });

        const response = await fetch('/api/moodle/GetCourseCompletionStatus', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Institution': this.institution,
            },
            body: JSON.stringify({ query: optimizedQuery })
        });
        return await response.json();
    }
}