import MobileApi from "./MobileApi";

export type SiteInfo = {
    fullname: string,
    sitename: string,
    firstname: string,
    lang: string,
    userpictureurl: string,
    release: string,
    version: string,
    userid: string,
}

export type Course = {
    id: number;
    shortname: string;
    fullname: string;
    displayname: string;
    enrolledusercount: number;
    idnumber: string;
    visible: number;
    summary: string;
    summaryformat: number;
    format: 'topics';
    showgrades: boolean;
    lang: string;
    enablecompletion: boolean;
    completionhascriteria: boolean;
    completionusertracked: boolean;
    category: number;
    progress: number;
    completed: boolean;
    startdate: number;
    enddate: number;
    marker: number;
    lastaccess: number;
    isfavourite: boolean;
    hidden: boolean;
    overviewfiles: string[]; // Empty array implies a list of strings, could be URLs or file names
    showactivitydates: boolean;
    showcompletionconditions: boolean;
}

export interface ModuleData {
    name: string;
    modname: string;
    url: string;
    uservisible: boolean;
    dates?: { timestamp: number }[];
    customdata?: string;
}

export interface ContentData {
    name: string;
    modules: ModuleData[];
}


interface ApiErrorResponse {
    error: string;              // Description of the error
    errorcode: string;          // Error code (e.g., 'missingparam')
    stacktrace: string | null;   // Stack trace (if any), can be null
    debuginfo: string | null;    // Debugging information (if any), can be null
    reproductionlink: string | null; // Reproduction link (if any), can be null
}


class MoodleApiError extends Error {
    error: string;
    errorcode: string;
    stacktrace: string | null;
    debuginfo: string | null;
    reproductionlink: string | null;

    constructor(errorResponse: ApiErrorResponse) {
        super(errorResponse.error); // Set the error message
        this.name = "MoodleApiError";      // Set the name of the error
        this.error = errorResponse.error;
        this.errorcode = errorResponse.errorcode;
        this.stacktrace = errorResponse.stacktrace;
        this.debuginfo = errorResponse.debuginfo;
        this.reproductionlink = errorResponse.reproductionlink;

        // Set up the prototype chain correctly
        Object.setPrototypeOf(this, MoodleApiError.prototype);
    }
}


export default class AuthenticatedMobileApi extends MobileApi {
    private token: string

    constructor(baseURL: string, token: string) {
        super(baseURL)
        this.token = token
    }

    static fromUnauthenticated(parent: MobileApi, token: string) {
        return new AuthenticatedMobileApi(parent.baseURL, token)
    }

    override async call(task: string, params?: Record<string, any>): Promise<any> {
        const response = await super.call(task, params ?? {}, this.token)

        if (Object.keys(response).includes('error')) {
            throw new MoodleApiError(response)
        }

        return response
    }

    async fetchSiteInfo(): Promise<SiteInfo> {
        return await this.call('core_webservice_get_site_info')
    }

    async fetchEnrolledCourses(userId: string): Promise<Course[]> {
        return await this.call('core_enrol_get_users_courses', {
            userid: userId
        })
    }

    async fetchCourseContents(courseId: number): Promise<ContentData[]> {
        return await this.call('core_course_get_contents', {
            courseid: courseId
        })
    }
}