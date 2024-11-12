import AuthenticatedMobileApi, { Course } from "@/moodle/AuthenticatedMobileApi";
import { PresencialIFGoiano } from "@/moodle/campus";

export interface GetEnrolledCoursesResponse {
    courses: Course[]
}

export async function GET(request: Request) {
    const rawToken = request.headers.get('Authorization')
    if (!rawToken) {
        return Response.json({
            'error': 'UNAUTHORIZED'
        })
    }

    const token = rawToken.replace('Bearer', '').trim()
    const moodle = AuthenticatedMobileApi.fromUnauthenticated(PresencialIFGoiano, token);

    const siteInfo = await moodle.fetchSiteInfo();
    const userId = siteInfo.userid;

    const courses = await moodle.fetchEnrolledCourses(userId);

    return Response.json({ courses })
}