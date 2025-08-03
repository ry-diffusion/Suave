import type { Projetos, UserData } from "~~/shared/datatypes";
import type { Disciplina, Etapa, PeriodoLetivo } from "~~/shared/boletim";
import { Err, Ok, type Result } from "~~/shared/result";
import { suapFetchJson } from "~~/shared/suap";
import type { ClassicAuthSchema, SuapAuthContext } from "~~/types/moodle";
import type { IInstitutionApiProvider } from "./IInstituitionApiProvider";

export class SuapApiProvider
  implements IInstitutionApiProvider<ClassicAuthSchema, SuapAuthContext>
{
  constructor(private readonly baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async authenticate(
    authSchema: ClassicAuthSchema
  ): Promise<Result<SuapAuthContext, Error>> {
    console.log(`[SUAP] Autenticando usuário ${authSchema.username}...`);

    const result = await suapFetchJson<SuapAuthContext>(
      `${this.baseUrl}/api/v2/autenticacao/token/`,
      {
        method: "POST",
        body: JSON.stringify({
          username: authSchema.username,
          password: authSchema.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!result.error) {
      console.log(
        `[SUAP] O usuário ${authSchema.username} foi autenticado com sucesso`
      );
    }
    return result.let((data) => ({
      access: data.access,
      refresh: data.refresh,
    }));
  }

  async verifyToken(
    authContext: SuapAuthContext
  ): Promise<Result<boolean, Error>> {
    console.log(`[SUAP] Verificando token...`);

    const result = await suapFetchJson<boolean>(
      `${this.baseUrl}/api/v2/autenticacao/token/verify/`,
      {
        method: "POST",
        body: JSON.stringify({
          token: authContext.access,
        }),
      }
    );
    return result.let(() => true);
  }

  async refreshToken(
    authContext: SuapAuthContext
  ): Promise<Result<SuapAuthContext, Error>> {
    console.log(`[SUAP] Atualizando token...`);

    const result = await suapFetchJson<SuapAuthContext>(
      `${this.baseUrl}/api/v2/autenticacao/token/refresh/`,
      {
        method: "POST",
        body: JSON.stringify({
          refresh: authContext.refresh,
        }),
      }
    );
    return result.let((data) => ({
      access: data.access,
      refresh: data.refresh,
    }));
  }

  async getProjetos(
    authContext: SuapAuthContext
  ): Promise<Result<Projetos, Error>> {
    console.log(`[SUAP] Buscando projetos...`);
    console.log(authContext.access);
    const result = await suapFetchJson<Projetos>(
      `${this.baseUrl}/api/v2/meus-projetos/`,
      {
        headers: {
          Authorization: `Bearer ${authContext.access}`,
        },
      }
    );
    return result.let((data) => {
      (data as any).Extensao = (data as any)["Extensão"];
      (data as any).Pesquisa = (data as any)["Pesquisa"];
      (data as any).Ensino = (data as any)["Ensino"];
      delete (data as any)["Extensão"];

      return data;
    });
  }

  async getMyData(
    authContext: SuapAuthContext
  ): Promise<Result<UserData, Error>> {
    console.log(`[SUAP] Buscando dados do usuário...`);

    const result = await suapFetchJson<UserData>(
      `${this.baseUrl}/api/v2/minhas-informacoes/meus-dados/`,
      {
        headers: {
          Authorization: `Bearer ${authContext.access}`,
        },
      }
    );

    return result.let((data) => {
      return {
        ...data,
        url_foto_150x200: `${this.baseUrl}/${data.url_foto_150x200}`,
        url_foto_75x100: `${this.baseUrl}/${data.url_foto_75x100}`,
      };
    });
  }

  async getPeriodosLetivos(
    authContext: SuapAuthContext
  ): Promise<Result<PeriodoLetivo[], Error>> {
    console.log(`[SUAP] Buscando períodos letivos...`);

    const result = await suapFetchJson<PeriodoLetivo[]>(
      `${this.baseUrl}/api/v2/minhas-informacoes/meus-periodos-letivos/`,
      {
        headers: {
          Authorization: `Bearer ${authContext.access}`,
        },
      }
    );

    return result;
  }

  async getBoletim(
    authContext: SuapAuthContext,
    ano: string,
    periodo: string
  ): Promise<Result<Disciplina[], Error>> {
    console.log(`[SUAP] Buscando boletim para ${ano}/${periodo}...`);

    const result = await suapFetchJson<Disciplina[]>(
      `${this.baseUrl}/api/v2/minhas-informacoes/boletim/${ano}/${periodo}/`,
      {
        headers: {
          Authorization: `Bearer ${authContext.access}`,
        },
      }
    );

    return result;
  }
}
