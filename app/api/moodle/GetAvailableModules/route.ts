import AuthenticatedMobileApi, { ContentData, ModuleData } from "@/moodle/AuthenticatedMobileApi";
import { moodleByName } from "@/Support/Institutions";

// TODO: Split parseModules into smaller functions

export interface Module {
    name: string,
    parent: string,
    kind: string,
    url: string,
    allowSubmissionsFrom?: Date,
    dueDate?: Date,
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
                    found.push({
                        name: moodleModule.name,
                        parent: content.name,
                        kind: moodleModule.modname,
                        url: moodleModule.url,
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
    const past = modules.filter(module => module.dueDate && module.dueDate < new Date())
    const current = modules.filter(module => module.dueDate && module.dueDate > new Date() && module.allowSubmissionsFrom && module.allowSubmissionsFrom < new Date())
    const future = modules.filter(module => module.allowSubmissionsFrom && module.allowSubmissionsFrom > new Date())

    return {
        past,
        current,
        future
    }
}

function organizeEverything(allModules: Map<string, Module[]>): { past: Map<string, Module[]>, current: Map<string, Module[]>, future: Map<string, Module[]> } {
    const organized = {
        past: new Map<string, Module[]>(),
        current: new Map<string, Module[]>(),
        future: new Map<string, Module[]>()
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


function intoJson(organized: { past: Map<string, Module[]>, current: Map<string, Module[]>, future: Map<string, Module[]> }) {
    const json: {
        past: { [key: string]: Module[] },
        current: { [key: string]: Module[] },
        future: { [key: string]: Module[] }
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
        past: { [key: string]: Module[] },
        current: { [key: string]: Module[] },
        future: { [key: string]: Module[] }
    }
}

export interface GetAvailableModulesInput {
    courses: { id: number, fullname: string }[]
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

    const allModules = new Map<string, Module[]>();

    for (const course of input.courses) {
        const contents = await moodle.fetchCourseContents(course.id);

        const modules = parseModules(contents)
        allModules.set(course.fullname, modules)
    }

    const organized = organizeEverything(allModules)

    const modules = intoJson(organized)

    return Response.json({ modules })
}