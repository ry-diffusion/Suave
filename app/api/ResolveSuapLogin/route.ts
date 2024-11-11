import { IFGoiano } from "@/SUAP/campus"
import { LoginInput } from "@/SUAP/SuapContext"

export async function POST(request: Request) {
  /* TODO: Adicionar uma validação maneira aqui */
  const inputData: LoginInput = await request.json()
  const info = await IFGoiano.login(inputData)

  return Response.json({
    'suap': info
  })
}