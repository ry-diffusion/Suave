export function unavaliableServiceError(message: string): Response {
    return Response.json({ error: message }, { status: 502 })
}

export function badAuthorizationError(): Response {
    return Response.json({ error: "Missing Authorization header" }, { status: 401 })
}