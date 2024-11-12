type WhoamiInput = {
    token: string
}

export async function GET(request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const input: WhoamiInput = await request.json()
}