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

export interface Quiz {
    id: number;
    course: number;
    coursemodule: number;
    name: string;
    intro: string;
    introformat: number;
    introfiles: unknown[]; // Array to store intro file objects if available
    timeopen: number; // UNIX timestamp for opening time
    timeclose: number; // UNIX timestamp for closing time
    timelimit: number; // Time limit in seconds
    preferredbehaviour: string;
    attempts: number;
    grademethod: number;
    decimalpoints: number;
    questiondecimalpoints: number;
    sumgrades: number; // Total possible grades for all questions
    grade: number; // Grade value for this module
    hasfeedback: number; // Feedback availability flag
    section: number;
    visible: number; // Visibility flag
    groupmode: number;
    groupingid: number;
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

export type AssignmentsResponse = {
    courses: AssignmentCourse[];
    warnings: unknown[]; // Adjust this export type based on the structure of warnings, if known
};

export type AssignmentCourse = {
    id: number;
    fullname: string;
    shortname: string;
    timemodified: number;
    assignments: Assignment[];
};

export type Assignment = {
    id: number;
    cmid: number;
    course: number;
    name: string;
    nosubmissions: number;
    submissiondrafts: number;
    sendnotifications: number;
    sendlatenotifications: number;
    sendstudentnotifications: number;
    duedate: number;
    allowsubmissionsfromdate: number;
    grade: number;
    timemodified: number;
    completionsubmit: number;
    cutoffdate: number;
    gradingduedate: number;
    teamsubmission: number;
    requireallteammemberssubmit: number;
    teamsubmissiongroupingid: number;
    blindmarking: number;
    hidegrader: number;
    revealidentities: number;
    attemptreopenmethod: string;
    maxattempts: number;
    markingworkflow: number;
    markingallocation: number;
    requiresubmissionstatement: number;
    preventsubmissionnotingroup: number;
    configs: AssignmentConfig[];
    intro: string;
    introformat: number;
    introfiles: unknown[];
    introattachments: unknown[];
};

type AssignmentConfig = {
    plugin: string;
    subtype: string;
    name: string;
    value: string;
};


export default class AuthenticatedMobileApi extends MobileApi {
    private token: string

    constructor(baseURL: string, token: string) {
        super(baseURL)
        this.token = token
    }

    static fromUnauthenticated(parent: MobileApi, token: string) {
        return new AuthenticatedMobileApi(parent.baseURL, token)
    }

    override async call<T>(task: string, params?: Record<string, unknown>): Promise<T> {
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

    async fetchEnrolledCoursesByTimelineClassification(): Promise<{ courses: Course[] }> {
        return await this.call('core_course_get_enrolled_courses_by_timeline_classification', {
            classification: "all",
            sort: "fullname",
        })
    }

    async fetchQuizzes(courseId: number): Promise<{ quizzes: Quiz[] }> {
        return await this.call('mod_quiz_get_quizzes_by_courses', {
            courseids: [courseId]
        })
    }

    async fetchAssignments(courseId: number): Promise<AssignmentsResponse> {
        return await this.call('mod_assign_get_assignments', {
            courseids: [courseId]
        })
    }

    async fetchCourseContents(courseId: number): Promise<ContentData[]> {
        return await this.call('core_course_get_contents', {
            courseid: courseId
        })
    }
}