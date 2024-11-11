import ApiClient from "@/core/ApiClient";
import { LoginInput, SuapLoginOutput } from "@/core/typings";

export default class SuapContext extends ApiClient {
    async login(creds: LoginInput): Promise<SuapLoginOutput> {
        return await this.post(`${this.baseURL}/api/v2/autenticacao/token/`, creds);
    }
}