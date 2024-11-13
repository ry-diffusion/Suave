import AuthenticatedMobileApi, { Course } from "@/moodle/AuthenticatedMobileApi";
import { moodleByName } from "@/Support/Institutions";

export interface GetEnrolledCoursesResponse {
    courses: Course[]
}

export async function GET(request: Request) {
    const rawToken = request.headers.get('Authorization')
    const institution = request.headers.get('X-Institution')
    if (!rawToken) {
        return Response.json({
            'error': 'UNAUTHORIZED'
        })
    }

    if (!institution) {
        return Response.json({
            'error': 'INSTITUTION_NOT_SPECIFIED'
        })
    }

    const moodleProvider = moodleByName(institution)

    if (!moodleProvider) {
        return Response.json({
            'error': 'INSTITUTION_NOT_SUPPORTED'
        })
    }

    const token = rawToken.replace('Bearer', '').trim()
    const moodle = AuthenticatedMobileApi.fromUnauthenticated(moodleProvider.api, token);

    const siteInfo = await moodle.fetchSiteInfo()

    const courses = await moodle.fetchEnrolledCourses(siteInfo.userid)
    return Response.json({ courses })
}