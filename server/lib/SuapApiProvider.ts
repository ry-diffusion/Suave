import { PromiseResult } from "~~/shared/result";
import { IInstitutionApiProvider } from "./IInstituitionApiProvider";
import { ClassicAuthSchema, SuapAuthContext } from "~~/types/moodle";
import { suapFetchJson } from "~~/shared/suap";

export class SuapApiProvider implements IInstitutionApiProvider<ClassicAuthSchema, SuapAuthContext> {
    constructor(private readonly baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    authenticate(authSchema: ClassicAuthSchema): PromiseResult<SuapAuthContext> {
        console.log(`[SUAP] Autenticando usuário ${authSchema.username}...`);

        return suapFetchJson<SuapAuthContext>(`${this.baseUrl}/api/v2/autenticacao/token/`, {
            method: "POST",
            body: JSON.stringify({
                username: authSchema.username,
                password: authSchema.password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .tap(() => console.log(`[SUAP] O usuário ${authSchema.username} foi autenticado com sucesso`))
            .map(data => {
                return {
                    access: data.access,
                    refresh: data.refresh,
                };
            });
    }


    // /api/v2/autenticacao/token/verify/
    verifyToken(authContext: SuapAuthContext): PromiseResult<boolean> {
        console.log(`[SUAP] Verificando token...`);

        return suapFetchJson<boolean>(`${this.baseUrl}/api/v2/autenticacao/token/verify/`, {
            method: "POST",
            body: JSON.stringify({
                token: authContext.access,
            }),
        }).map(() => true);
    }

    // /api/v2/autenticacao/token/refresh
    refreshToken(authContext: SuapAuthContext): PromiseResult<SuapAuthContext> {
        console.log(`[SUAP] Atualizando token...`);

        return suapFetchJson<SuapAuthContext>(`${this.baseUrl}/api/v2/autenticacao/token/refresh/`, {
            method: "POST",
            body: JSON.stringify({
                refresh: authContext.refresh,
            }),
        }).map(data => {
            return {
                access: data.access,
                refresh: data.refresh,
            };
        });
    }
}