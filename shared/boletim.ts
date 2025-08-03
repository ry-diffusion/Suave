// Interfaces para boletim e período acadêmico
export interface PeriodoLetivo {
  ano_letivo: number;
  periodo_letivo: number;
}

export interface Etapa {
  nota: number;
  faltas: number;
}

export interface Disciplina {
  codigo_diario: string;
  disciplina: string;
  segundo_semestre: boolean;
  carga_horaria: number;
  carga_horaria_cumprida: number;
  numero_faltas: number;
  percentual_carga_horaria_frequentada: number;
  situacao:
    | "Prova Final"
    | "Aprovado"
    | "Reprovado"
    | "Dispensado"
    | "Cursando";
  quantidade_avaliacoes: number;
  nota_etapa_1: Etapa;
  nota_etapa_2: Etapa;
  nota_etapa_3: Etapa;
  nota_etapa_4: Etapa;
  nota_avaliacao_final: Etapa;
  media_disciplina?: number;
  media_final_disciplina?: string;
}
