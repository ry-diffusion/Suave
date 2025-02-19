import { badAuthorizationError, unavaliableServiceError } from "@/lib/api/api-errors"
import { IFGoiano } from "@/lib/suap/campus"

export type LetivosOut = Record<number, number[]>

export async function GET(request: Request) {
    try {
        const rawToken = request.headers.get("Authorization")
        if (rawToken == null) {
            return badAuthorizationError()
        }

        const token = rawToken.replace("Bearer ", "")

        const periodos = await IFGoiano.periodoLetivos(token)

        const saida: Record<number, number[]> = {}

        for (const periodo of periodos) {
            if (saida[periodo.ano_letivo] == null)
                saida[periodo.ano_letivo] = []

            saida[periodo.ano_letivo].push(periodo.periodo_letivo)
        }

        return Response.json(saida)
    } catch (e) {
        if (e instanceof Error) {
            return unavaliableServiceError(e.message)
        }
    }
}