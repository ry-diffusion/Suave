import ApiClient from "@/Core/ApiClient";
import { LoginInput, SuapLoginOutput } from "@/Core/typings";

export interface PeriodoLetivo {
    ano_letivo: number,
    periodo_letivo: number,
}


export interface Etapa {
    nota: number,
    faltas: number
}

export interface Disciplina {
    codigo_diario: string,
    disciplina: string,
    segundo_semestre: boolean,
    carga_horaria: number,
    carga_horaria_cumprida: number,
    numero_faltas: number,
    percentual_carga_horaria_frequentada: number,
    situacao: 'Prova Final' | 'Aprovado' | 'Reprovado' | 'Dispensado' | 'Cursando',
    quantidade_avaliacoes: number,
    /* Cara, por quê isso não é um Array? :sob: */
    nota_etapa_1: Etapa,
    nota_etapa_2: Etapa,
    nota_etapa_3: Etapa,
    nota_etapa_4: Etapa,
    nota_avaliacao_final: Etapa,
    media_disciplina?: number,

    // Por quê diabos isso é uma string? Espero não ter que ver o código interno do SUAP.
    media_final_disciplina?: string
}

export default class SuapContext extends ApiClient {
    async periodoLetivos(token: string): Promise<PeriodoLetivo[]> {
        return await this.getJson('api/v2/minhas-informacoes/meus-periodos-letivos/', {
            'Authorization': `Bearer ${token}`
        });
    }


    async boletim(token: string, ano: string, periodo: string): Promise<Disciplina[]> {
        return await this.getJson(`api/v2/minhas-informacoes/boletim/${ano}/${periodo}/`, {
            'Authorization': `Bearer ${token}`
        });
    }


    async login(creds: LoginInput): Promise<SuapLoginOutput> {
        return await this.post(`api/v2/autenticacao/token/`, creds);
    }
}