import { unavaliableServiceError } from "@/Core/ApiErrors"
import { LoginInput } from "@/Core/typings"
import { IFGoiano } from "@/SUAP/campus"

export async function POST(request: Request) {
  /* TODO: Adicionar uma validação maneira aqui */
  const inputData: LoginInput = await request.json()
  try {
    const passport = await IFGoiano.login(inputData)
    return Response.json(passport)
  } catch (e) {
    if (e instanceof Error) {
      return unavaliableServiceError(e.message)
    }
  }
}