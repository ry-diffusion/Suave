import { GetAvailableModulesResponse, Module } from "@/app/api/moodle/GetAvailableModules/route";

export class MoodleBridge {
    accessToken: string;
    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    async GetAvailableModules(): Promise<GetAvailableModulesResponse> {
        const response = await fetch('/api/moodle/GetAvailableModules', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });
        return await response.json();
    }

}