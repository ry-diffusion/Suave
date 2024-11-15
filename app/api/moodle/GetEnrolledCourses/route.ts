import AuthenticatedMobileApi, { Course } from "@/Moodle/AuthenticatedMobileApi";
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

    const response = await moodle.fetchEnrolledCoursesByTimelineClassification()

    response.courses = response.courses.filter(course => course.visible)

    return Response.json(response)
}