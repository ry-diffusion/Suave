import ApiClient from "@/core/APIClient";
import SuapContext from "./SuapContext";
type Aluno = {
    id: number;
    matricula: string;
    nome_usual: string;
    cpf: string;
    rg: string | null;
    filiacao: [string | null, string | null];
    data_nascimento: string;
    naturalidade: string | null;
    tipo_sanguineo: string;
    email: string;
    url_foto_75x100: string;
    url_foto_150x200: string;
    tipo_vinculo: "Aluno";
    vinculo: Vinculo;
};

type Vinculo = {
    matricula: string;
    nome: string;
    curso: string;
    campus: string;
    situacao: "Matriculado";
    cota_sistec: string | null;
    cota_mec: string | null;
    situacao_sistemica: string;
    matricula_regular: boolean;
    linha_pesquisa: string | null;
    curriculo_lattes: string | null;
};


export default class AuthenticatedSuapContext extends ApiClient {
    accessToken: string;

    static fromUnauthorized(parent: SuapContext, access: string) {
        return new AuthenticatedSuapContext(parent.baseURL, access)
    }

    constructor(baseURL: string, accessToken: string) {
        super(baseURL)
        this.accessToken = accessToken
    }

    private async getAuthenticatedJson<T>(path: string): Promise<T> {
        return await this.getJson(path, null, {
            'Authorization': `Bearer ${this.accessToken}`
        })
    }

    async meusDados(): Promise<Aluno> {
        return await this.getAuthenticatedJson('api/v2/minhas-informacoes/meus-dados/')
    }
}