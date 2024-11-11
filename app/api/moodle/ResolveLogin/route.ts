import { LoginInput } from "@/core/typings"
import { PresencialIFGoiano } from "@/moodle/campus"

export async function POST(request: Request) {
    /* TODO: Adicionar uma validação maneira aqui */
    const inputData: LoginInput = await request.json()
    const passport = await PresencialIFGoiano.login(inputData)

    return Response.json(passport)
}