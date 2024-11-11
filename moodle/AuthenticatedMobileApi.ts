import MobileApi from "./MobileApi";

export type SiteInfo = {
    fullname: string,
    sitename: string,
    firstname: string,
    lang: string,
    userpictureurl: string,
    release: string,
    version: string,
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
}