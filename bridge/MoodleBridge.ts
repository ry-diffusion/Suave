import { GetAvailableModulesResponse } from "@/app/api/moodle/GetAvailableModules/route";
import { GetEnrolledCoursesResponse } from "@/app/api/moodle/GetEnrolledCourses/route";
import { Course } from "@/moodle/AuthenticatedMobileApi";

export class MoodleBridge {
    accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    async GetEnrolledCourses(): Promise<GetEnrolledCoursesResponse> {
        const response = await fetch('/api/moodle/GetEnrolledCourses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });

        return await response.json();
    }

    async GetAvailableModules(courses: Course[]): Promise<GetAvailableModulesResponse> {
        const response = await fetch('/api/moodle/GetAvailableModules', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            },
            body: JSON.stringify({ courses })
        });
        return await response.json();
    }

}