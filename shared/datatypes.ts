// Interface para representar uma participação em um projeto
export interface Participacao {
  /** Identificador único da participação */
  id: number;
  /** Nome completo do participante */
  nome: string;
  /** Tipo de vínculo do participante (Voluntário ou Bolsista) */
  vinculo: "Voluntário" | "Bolsista";
  /** Indica se o participante é o responsável pelo projeto */
  responsavel: boolean;
  /** Data de pré-seleção do participante (formato ISO 8601 ou null) */
  pre_selecionado: string | null;
  /** Data de seleção oficial do participante (formato ISO 8601 ou null) */
  selecionado: string | null;
  /** Carga horária semanal do participante em horas */
  carga_horaria: number;
}

// Interface para representar uma etapa de uma meta
export interface Etapa {
  /** Identificador único da etapa */
  id: number;
  /** Descrição detalhada da etapa */
  descricao: string;
  /** Nome do responsável pela execução da etapa */
  responsavel: string;
  /** Data de início da execução da etapa (formato ISO 8601) */
  inicio_execucao: string;
  /** Data de término da execução da etapa (formato ISO 8601) */
  fim_execucao: string;
}

// Interface para representar uma meta de um projeto
export interface Meta {
  /** Identificador único da meta */
  id: number;
  /** Descrição da meta do projeto */
  descricao: string;
  /** Data de início da meta (formato ISO 8601 ou null) */
  inicio: string | null;
  /** Data de término da meta (formato ISO 8601 ou null) */
  fim: string | null;
  /** Lista de etapas associadas à meta */
  etapas: Etapa[];
}

// Interface para representar um projeto de extensão
export interface Extensao {
  /** Identificador único do projeto de extensão */
  id: number;
  /** Título do projeto de extensão */
  titulo: string;
  /** Indica se o projeto possui um coordenador */
  coordenador: boolean;
  /** Lista de participantes do projeto */
  participacao: Participacao[];
  /** Status atual do projeto */
  status:
    | "Não selecionado"
    | "Em execução"
    | "Concluído"
    | "Em Seleção"
    | "Não Enviado";
  /** Data de início da execução do projeto (formato ISO 8601) */
  inicio_execucao: string;
  /** Data de término da execução do projeto (formato ISO 8601) */
  fim_execucao: string;
  /** Área de conhecimento do projeto */
  area_conhecimento: string;
  /** Área temática do projeto */
  area_tematica: string;
  /** Tema específico do projeto */
  tema: string;
  /** Foco tecnológico do projeto */
  focotecnologico: string;
  /** Lista de metas do projeto */
  metas: Meta[];
}

// Interface para representar um projeto de pesquisa
export interface Pesquisa {
  /** Identificador único do projeto de pesquisa */
  id: number;
  /** Título do projeto de pesquisa */
  titulo: string;
  /** Indica se o projeto possui um coordenador */
  coordenador: boolean;
  /** Lista de participantes do projeto */
  participacao: Participacao[];
  /** Status atual do projeto */
  status:
    | "Não selecionado"
    | "Em execução"
    | "Concluído"
    | "Em Seleção"
    | "Não Enviado";
  /** Data de início da execução do projeto (formato ISO 8601) */
  inicio_execucao: string;
  /** Data de término da execução do projeto (formato ISO 8601) */
  fim_execucao: string;
  /** Lista de metas do projeto */
  metas: Meta[];
}

// Interface para representar um projeto de ensino
export interface Ensino {
  /** Identificador único do projeto de ensino */
  id: number;
  /** Título do projeto de ensino */
  titulo: string;
  /** Indica se o projeto possui um coordenador */
  coordenador: boolean;
  /** Lista de participantes do projeto */
  participacao: Participacao[];
  /** Status atual do projeto */
  status:
    | "Não selecionado"
    | "Em execução"
    | "Concluído"
    | "Em Seleção"
    | "Não Enviado";
  /** Data de início da execução do projeto (formato ISO 8601) */
  inicio_execucao: string;
  /** Data de término da execução do projeto (formato ISO 8601) */
  fim_execucao: string;
  /** Lista de metas do projeto */
  metas: Meta[];
}

// Interface principal que agrupa todos os tipos de projetos
export interface Projetos {
  /** Lista de projetos de extensão */
  Extensao: Extensao[];
  /** Lista de projetos de pesquisa */
  Pesquisa: Pesquisa[];
  /** Lista de projetos de ensino */
  Ensino: Ensino[];
}

// Interface para representar os dados do usuário retornados pela API SUAP
export interface UserData {
  /** ID único do usuário */
  id: number;
  /** Número de matrícula do usuário */
  matricula: string;
  /** Nome usual do usuário */
  nome_usual: string;
  /** CPF do usuário */
  cpf: string;
  /** RG do usuário */
  rg: string;
  /** Informações de filiação (pai e mãe) */
  filiacao: (string | null)[];
  /** Data de nascimento no formato YYYY-MM-DD */
  data_nascimento: string;
  /** Naturalidade do usuário */
  naturalidade: string;
  /** Tipo sanguíneo */
  tipo_sanguineo: string;
  /** Email do usuário */
  email: string;
  /** URL da foto 75x100 */
  url_foto_75x100: string;
  /** URL da foto 150x200 */
  url_foto_150x200: string;
  /** Tipo de vínculo (Aluno, Professor, etc.) */
  tipo_vinculo: string;
  /** Informações detalhadas do vínculo */
  vinculo: {
    /** Número de matrícula */
    matricula: string;
    /** Nome completo */
    nome: string;
    /** Nome do curso */
    curso: string;
    /** Código do campus */
    campus: string;
    /** Situação atual */
    situacao: string;
    /** Cota SISTEC */
    cota_sistec: string;
    /** Cota MEC */
    cota_mec: string;
    /** Situação sistêmica */
    situacao_sistemica: string;
    /** Indica se a matrícula é regular */
    matricula_regular: boolean;
    /** Linha de pesquisa (pode ser null) */
    linha_pesquisa: string | null;
    /** URL do currículo Lattes */
    curriculo_lattes: string;
  };
}
