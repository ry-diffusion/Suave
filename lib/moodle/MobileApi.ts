import {LoginInput} from "@/types/typings";
import UrlApiClient from "@/lib/api/url-api-client";

type MoodleLoginOutput = {
    token: string,
    privatetoken: string
}

type MoodleError = {
    error?: string
    errorcode?: string
}

export default class MobileApi extends UrlApiClient {
    async login(creds: LoginInput) {
        const response = await this.post<MoodleLoginOutput | MoodleError>('login/token.php', {
            ...creds,
            "service": "moodle_mobile_app"
        })

        if ((response as MoodleError).error) {
            throw new Error((response as MoodleError)?.error ?? "Unknown error.")
        }

        return response as MoodleLoginOutput
    }

    async call<T = void>(task: string, params: Record<string, string>, token?: string): Promise<T> {
        const url = `${this.baseURL}/webservice/rest/server.php`;
        const data: Record<string, string> = {
            ...(token ? {wstoken: token} : {}),
            wsfunction: task,
            moodlewsrestformat: 'json',
            ...params,
        };

        // Flatten lists to K[IDX] format
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (Array.isArray(value)) {
                value.forEach((val, idx) => {
                    data[`${key}[${idx}]`] = val;
                });
                delete data[key];
            }
        });

        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(data as Record<string, string>),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return await response.json();
    }
}

