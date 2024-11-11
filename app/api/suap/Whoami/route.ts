type WhoamiInput = {
    token: string
}

export async function GET(request: Request) {
    const input: WhoamiInput = await request.json()

}