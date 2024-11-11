import ApiClient from "@/core/APIClient";

export type LoginInput = {
    username: string,
    password: string
}

export type LoginOutput = {
    refresh: string,
    access: string
}


export default class SuapContext extends ApiClient {
    async login(creds: LoginInput): Promise<LoginOutput> {
        return await this.post(`${this.baseURL}/api/v2/autenticacao/token/`, creds);
    }
}