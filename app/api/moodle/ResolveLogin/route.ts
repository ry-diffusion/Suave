import { LoginInput } from "@/Core/typings"
import { moodleByName } from "@/Support/Institutions"

export async function POST(request: Request) {
    /* TODO: Adicionar uma validação maneira aqui */

    const institution = request.headers.get('X-Institution')

    if (!institution) {
        return Response.json({
            'error': 'INSTITUTION_NOT_SPECIFIED'
        })
    }

    const moodleProvider = moodleByName(institution)

    if (!moodleProvider) {
        return Response.json({
            'error': 'INSTITUTION_NOT_SUPPORTED'
        })
    }


    const inputData: LoginInput = await request.json()
    const passport = await moodleProvider.api.login(inputData)

    return Response.json(passport)
}