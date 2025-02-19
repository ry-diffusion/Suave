import { unavaliableServiceError } from "@/lib/api/api-errors"
import { LoginInput } from "@/types/typings"
import { IFGoiano } from "@/lib/suap/campus"

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