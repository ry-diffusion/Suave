import AuthenticatedMobileApi, { Assignment, ContentData, ModuleData, Quiz } from "@/Moodle/AuthenticatedMobileApi";
import { moodleByName } from "@/Support/Institutions";

export interface Module {
    name: string,
    parent: string,
    kind: string,
    url: string,
    allowSubmissionsFrom?: Date,
    dueDate?: Date,
    hasCompleted: boolean,
    id: number,
    instance: number
}

export interface ApiModule {
    name: string,
    parent: string,
    kind: string,
    url: string,
    allowSubmissionsFrom?: Date,
    dueDate?: number, // Timestamp
    hasCompleted: boolean,
    id: number,
    instance: number
}

interface ModuleExtDate {
    name?: string,
    allowSubmissionsFrom: Date,
    dueDate: Date
}

function parseByDate(moodleModule: ModuleData): ModuleExtDate | null {
    if (moodleModule.dates && moodleModule.dates.length > 1) {
        const allowSubmissionsFrom = new Date(moodleModule.dates[0].timestamp * 1000)
        const dueDate = new Date(moodleModule.dates[1].timestamp * 1000)

        return {
            allowSubmissionsFrom,
            dueDate
        }
    }

    return null
}

function parseByCustomData(moodleModule: ModuleData): ModuleExtDate | null {
    if (null != moodleModule.customdata) {
        const payload = JSON.parse(moodleModule.customdata)
        if (payload.customdata) {
            const dueDate = new Date(payload.customdata.duedate * 1000)
            const allowSubmissionsFrom = new Date(payload.customdata.allowsubmissionsfromdate * 1000)
            return {
                allowSubmissionsFrom,
                dueDate
            }
        }
    }

    return null
}

function parseByRegex(moodleModule: ModuleData): ModuleExtDate | null {
    const regex = /(?<qNome>\w* \d{1,2}) \((?<abre>\d{2}\/\d{2})\s*-\s*(?<fecha>\d{2}\/\d{2})\)/;
    const match = moodleModule.name.match(regex);

    const parse = (currentYear: number, abre: string) => {
        const [day, month] = abre.split("/");
        return new Date(`${currentYear}-${month}-${day}`);
    };

    if (match) {
        const currentYear = new Date().getFullYear();
        const dueDate = parse(currentYear, match.groups?.fecha as string);
        const allowSubmissionsFrom = parse(currentYear, match.groups?.abre as string);

        return {
            name: match.groups?.qNome as string,
            allowSubmissionsFrom,
            dueDate
        };
    }

    return null;
}

function parseModules(contents: ContentData[]): Module[] {
    const found: Module[] = []

    for (const content of contents) {
        for (const moodleModule of content.modules) {
            if (moodleModule.modname == "label" || !moodleModule.uservisible)
                continue

            const queries = [parseByCustomData, parseByDate, parseByRegex]

            for (const doQuery of queries) {
                const result = doQuery(moodleModule)

                if (result) {
                    let hasCompleted = moodleModule.completion == 1

                    if (moodleModule.completiondata) {
                        hasCompleted = moodleModule.completiondata.state == 1
                    }

                    found.push({
                        id: moodleModule.id,
                        instance: moodleModule.instance,
                        name: moodleModule.name,
                        parent: content.name,
                        kind: moodleModule.modname,
                        url: moodleModule.url,
                        hasCompleted,
                        ...result
                    })

                    break
                }
            }
        }
    }

    return found
}

function organizeModules(modules: Module[]) {
    const past = modules.filter(module => module.dueDate && module.dueDate < new Date() || !module.dueDate || (!module.allowSubmissionsFrom && !module.dueDate))
    const current = modules.filter(module => module.dueDate && module.dueDate > new Date() && module.allowSubmissionsFrom && module.allowSubmissionsFrom < new Date())
    const future = modules.filter(module => module.allowSubmissionsFrom && module.allowSubmissionsFrom > new Date())

    return {
        past,
        current,
        future
    }
}

function organizeEverything(allModules: Map<number, Module[]>): { past: Map<number, Module[]>, current: Map<number, Module[]>, future: Map<number, Module[]> } {
    const organized = {
        past: new Map<number, Module[]>(),
        current: new Map<number, Module[]>(),
        future: new Map<number, Module[]>()
    }

    for (const [course, modules] of allModules) {
        const organizedModules = organizeModules(modules)

        if (!organized.past.has(course))
            organized.past.set(course, [])
        if (!organized.current.has(course))
            organized.current.set(course, [])
        if (!organized.future.has(course))
            organized.future.set(course, [])

        organized.past.get(course)?.push(...organizedModules.past)
        organized.current.get(course)?.push(...organizedModules.current)
        organized.future.get(course)?.push(...organizedModules.future)
    }

    return organized
}


function intoJson(organized: { past: Map<number, Module[]>, current: Map<number, Module[]>, future: Map<number, Module[]> }) {
    const json: {
        past: { [key: number]: Module[] },
        current: { [key: number]: Module[] },
        future: { [key: number]: Module[] }
    } = {
        past: {},
        current: {},
        future: {}
    }

    for (const [course, modules] of organized.past) {
        json.past[course] = modules
    }

    for (const [course, modules] of organized.current) {
        json.current[course] = modules
    }

    for (const [course, modules] of organized.future) {
        json.future[course] = modules
    }

    return json
}

export interface GetAvailableModulesResponse {
    modules: {
        past: { [key: number]: Module[] },
        current: { [key: number]: Module[] },
        future: { [key: number]: Module[] }
    }
}

export interface GetAvailableModulesInput {
    courses: { id: number, fullname: string }[]
}


function convertQuizToModule(quiz: Quiz, parent: string, baseUrl: string): Module {
    return {
        id: quiz.id,
        instance: quiz.id,
        name: quiz.name,
        parent,
        kind: 'quiz',
        hasCompleted: quiz.attempts > 0,
        url: `${baseUrl}/mod/quiz/view.php?id=${quiz.coursemodule}`,
        allowSubmissionsFrom: quiz.timeopen != 0 ? new Date(quiz.timeopen * 1000) : undefined,
        dueDate: quiz.timeopen != 0 ? new Date(quiz.timeclose * 1000) : undefined
    }
}

function convertAssignmentToModule(assign: Assignment, parent: string, baseUrl: string): Module {
    return {
        id: assign.id,
        instance: assign.cmid,
        name: assign.name,
        parent,
        hasCompleted: assign.completionsubmit > 0,
        kind: 'assign',
        url: `${baseUrl}/mod/assign/view.php?id=${assign.cmid}`,
        allowSubmissionsFrom: assign.timemodified != 0 ? new Date(assign.timemodified * 1000) : undefined,
        dueDate: assign.timemodified != 0 ? new Date(assign.duedate * 1000) : undefined
    }
}

async function fetchModernModules(courses: { id: number, fullname: string }[], moodle: AuthenticatedMobileApi): Promise<Map<number, Module[]>> {
    const allModules = new Map<number, Module[]>();

    for (const course of courses) {
        const contents = await moodle.fetchCourseContents(course.id);

        const modules = parseModules(contents)
        allModules.set(course.id, modules)
    }

    return allModules
}

async function fetchLegacyModules(courses: { id: number, fullname: string }[], moodle: AuthenticatedMobileApi): Promise<Map<number, Module[]>> {
    const allModules = new Map<number, Module[]>();

    for (const course of courses) {
        const quizzes = (await moodle.fetchQuizzes(course.id)).quizzes
        const assignmentsCourse = (await moodle.fetchAssignments(course.id)).courses

        const modules = quizzes.map(quiz => convertQuizToModule(quiz, course.fullname, moodle.baseURL))

        for (const assignCourse of assignmentsCourse) {
            for (const assign of assignCourse.assignments)
                modules.push(convertAssignmentToModule(assign, course.fullname, moodle.baseURL))
        }

        allModules.set(course.id, modules)
    }

    return allModules

}

function getAllModulesCount(allModules: Map<number, Module[]>) {
    let count = 0

    for (const [, modules] of allModules) {
        count += modules.length
    }

    return count
}

export async function POST(
    request: Request
) {
    const rawToken = request.headers.get('Authorization')
    const institution = request.headers.get('X-Institution')
    if (!rawToken) {
        return Response.json({
            'error': 'UNAUTHORIZED'
        })
    }

    if (!institution) {
        return Response.json({
            'error': 'INSTITUTION_NOT_PROVIDED'
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

    const input: GetAvailableModulesInput = await request.json();

    let allModules = await fetchModernModules(input.courses, moodle)

    if (getAllModulesCount(allModules) == 0) {
        allModules = await fetchLegacyModules(input.courses, moodle)
    }

    const organized = organizeEverything(allModules)

    const modules = intoJson(organized)

    return Response.json({ modules })
}