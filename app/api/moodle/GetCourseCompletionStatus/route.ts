import AuthenticatedMobileApi from "@/Moodle/AuthenticatedMobileApi";
import { moodleByName } from "@/Support/Institutions";

export interface QueryModule {
    id: number;
    kind: string;
    url: string;
    instance: number;
}

export interface CourseStatusInput {
    query: {
        courseId: number;
        modules: QueryModule[]
    }[]
}

export interface Entry {
    hasCompleted: boolean;
    activityId: number;
    courseId: number;
}

/**
 * Verifica se o usuário já completou a atividade.
 * Cara, é sério KKKK fiquei muito tempo debugando para ver pq krlhs o coiso não verifica as tentativas
 * do Moodle de Biologia, e por algum motivo só funciona assim.
 * Foda.
 */
export async function POST(request: Request) {
    const rawToken = request.headers.get('Authorization');
    const institution = request.headers.get('X-Institution');
    const accessToken = rawToken?.replace('Bearer ', '').trim();

    if (!accessToken) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (!institution) {
        return new Response('Institution header is required', { status: 400 });
    }

    const provider = moodleByName(institution);
    if (!provider) {
        return new Response('Institution not found', { status: 404 });
    }

    const moodle = AuthenticatedMobileApi.fromUnauthenticated(provider.api, accessToken);
    const siteInfo = await moodle.fetchSiteInfo();
    const userId = siteInfo.userid;

    const { query }: CourseStatusInput = await request.json();

    const status = query.map(async ({ courseId, modules }) => {
        const course = await moodle.fetchCourseCompletionStatus(courseId, userId);
        return {
            id: courseId,
            statuses: course.statuses,
            modules
        };
    })

    const completionStatus = await Promise.all(status);
    const result: Entry[] = [];

    for (const { id, statuses, modules } of completionStatus) {
        for (const pModule of modules) {
            const found = statuses.find(status => pModule.url.includes(status.cmid.toString()));

            if (null != found) {
                result.push({
                    courseId: id,
                    activityId: found.cmid,
                    hasCompleted: found.state != 0
                })
            } else if (pModule.kind == 'quiz') {
                const userAttempts = await moodle.fetchUserAttempts(pModule.instance, userId);
                result.push({
                    courseId: id,
                    activityId: pModule.id,
                    hasCompleted: userAttempts.attempts.length > 0
                })
            }
        }
    }


    return Response.json(result);
}