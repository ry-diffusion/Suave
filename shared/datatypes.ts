// Interface para representar uma participação em um projeto
export interface Participacao {
    /** Identificador único da participação */
    id: number;
    /** Nome completo do participante */
    nome: string;
    /** Tipo de vínculo do participante (Voluntário ou Bolsista) */
    vinculo: 'Voluntário' | 'Bolsista';
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
    status: 'Não selecionado' | 'Em execução' | 'Concluído' | 'Em Seleção' | 'Não Enviado';
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
    status: 'Não selecionado' | 'Em execução' | 'Concluído' | 'Em Seleção' | 'Não Enviado';
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
    status: 'Não selecionado' | 'Em execução' | 'Concluído' | 'Em Seleção' | 'Não Enviado';
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
