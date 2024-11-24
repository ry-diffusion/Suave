import { IFGoiano } from "@/SUAP/campus"
import { Etapa } from "@/SUAP/SuapContext"


export interface ApiDisciplina {
    cargaHoraria: number,
    cargaHorariaCumprida: number,
    codigo: string,
    frequencia: number,
    situacao: 'Prova Final' | 'Aprovado' | 'Reprovado' | 'Dispensado' | 'Cursando',
    quantidadeAvaliacoes: number,
    etapas: {
        1: Etapa,
        2: Etapa,
        3: Etapa,
        4: Etapa,
        final: Etapa,
    },
    medias: {
        disciplina?: number,
        final?: number,
    }
}

export async function GET(request: Request, { params }: {
    params: Promise<{
        ano: string, periodo: string
    }>,
}) {
    const rawToken = request.headers.get("Authorization")
    if (rawToken == null) {
        return new Response("Missing Authorization header", { status: 401 })
    }

    const token = rawToken.replace("Bearer ", "")

    const politeParams = await params

    const boletim = await IFGoiano.boletim(token, politeParams.ano, politeParams.periodo)
    const saida: Record<string, ApiDisciplina> = {}

    for (const disciplina of boletim) {
        if (!saida[disciplina.disciplina]) {
            saida[disciplina.disciplina] = {
                cargaHoraria: disciplina.carga_horaria,
                cargaHorariaCumprida: disciplina.carga_horaria_cumprida,
                codigo: disciplina.codigo_diario,
                frequencia: disciplina.percentual_carga_horaria_frequentada,
                situacao: disciplina.situacao,
                quantidadeAvaliacoes: disciplina.quantidade_avaliacoes,
                etapas: {
                    1: disciplina.nota_etapa_1,
                    2: disciplina.nota_etapa_2,
                    3: disciplina.nota_etapa_3,
                    4: disciplina.nota_etapa_4,
                    final: disciplina.nota_avaliacao_final,
                },
                medias: {
                    disciplina: disciplina.media_disciplina,
                    final: disciplina.media_final_disciplina ? parseFloat(disciplina.media_final_disciplina) : undefined,
                }
            }
        }
    }

    return Response.json(saida)
}