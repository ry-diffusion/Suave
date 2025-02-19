import { ApiDisciplina } from "@/app/(api)/api/suap/Boletim/[ano]/[periodo]/route";
import { LetivosOut } from "@/app/(api)/api/suap/Periodos/route";
import { LoginInput, SuapLoginOutput } from "@/types/typings";
import ApiClient from "@/lib/api/url-api-client";


export default class SuapBridge extends ApiClient {
    provider: string;
    token: string;

    constructor(token: string, provider: string) {
        super('');

        this.token = token;
        this.provider = provider;
    }

    async authenticatedGet<T>(path: string): Promise<T> {
        return await this.getJson(path, {
            'Authorization': `Bearer ${this.token}`
        });
    }

    async GetPeriodoLetivos(): Promise<LetivosOut> {
        return await this.authenticatedGet('api/suap/Periodos');
    }

    async GetBoletim(ano: string, periodo: string): Promise<Record<string, ApiDisciplina>> {
        return await this.authenticatedGet(`api/suap/Boletim/${ano}/${periodo}`);
    }

    async Login(creds: LoginInput): Promise<SuapLoginOutput> {
        return await this.post(`api/suap/ResolveLogin`, creds);
    }
}