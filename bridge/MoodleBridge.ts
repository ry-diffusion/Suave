import { GetAvailableModulesResponse } from "@/app/api/moodle/GetAvailableModules/route";
import { GetEnrolledCoursesResponse } from "@/app/api/moodle/GetEnrolledCourses/route";
import { Course } from "@/moodle/AuthenticatedMobileApi";
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

}