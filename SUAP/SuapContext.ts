export type LoginInput = {
    username: string,
    password: string
}

export type LoginOutput = {
    refresh: string,
    access: string
}

const POSTBuilder = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
}

export default class SuapContext {
    baseURL: string;
    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    async login(creds: LoginInput): Promise<LoginOutput> {
        const response = await fetch(`${this.baseURL}/api/v2/autenticacao/token/`, {
            ...POSTBuilder,
            body: JSON.stringify(creds),
        });
        return await response.json();
    }
}

