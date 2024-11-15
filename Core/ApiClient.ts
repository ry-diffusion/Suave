export default abstract class ApiClient {
    public readonly baseURL: string;

    protected POSTBuilder = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0'
        },
    }
    protected GETBuilder = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    }

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    protected async post<T>(path: string, body: any): Promise<Awaited<T>> {
        const response = await fetch(`${this.baseURL}/${path}`, {
            ...this.POSTBuilder,
            body: JSON.stringify(body),
        });

        return await response.json()
    }

    protected async getJson<T>(path: string, body?: any, headers?: Record<string, string>): Promise<Awaited<T>> {
        const response = await fetch(`${this.baseURL}/${path}`, {
            headers: {
                ...headers,
                ...this.GETBuilder.headers
            },
            body: body ? JSON.stringify(body) : null,
        });


        return await response.json()
    }
}