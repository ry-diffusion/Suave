import { LoginInput } from "@/core/typings";
import UrlApiClient from "@/core/UrlApiClient";

type MoodleLoginOutput = {
    token: string,
    privatetoken: string
}

export default class MobileApi extends UrlApiClient {
    async login(creds: LoginInput) {
        return await this.post<MoodleLoginOutput>('login/token.php', {
            ...creds,
            "service": "moodle_mobile_app"
        })
    }

    async call(task: string, params: Record<string, any>, token?: string): Promise<any> {
        const url = `${this.baseURL}/webservice/rest/server.php`;
        const data: Record<string, any> = {
            ...(token ? { wstoken: token } : {}),
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

