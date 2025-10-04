/**
 * Normalizes Moodle module names to human-readable format
 */
export function normalizeModuleName(moduleName?: string): string {
  if (!moduleName) return "Atividade";

  const normalized = moduleName.toLowerCase().trim();

  const moduleNames: Record<string, string> = {
    quiz: "Quiz",
    assign: "Tarefa",
    assignment: "Tarefa",
    forum: "Fórum",
    resource: "Recurso",
    page: "Página",
    url: "Link",
    folder: "Pasta",
    book: "Livro",
    chat: "Chat",
    choice: "Escolha",
    data: "Base de Dados",
    feedback: "Feedback",
    glossary: "Glossário",
    label: "Rótulo",
    lesson: "Lição",
    lti: "Ferramenta Externa",
    scorm: "SCORM",
    survey: "Pesquisa",
    wiki: "Wiki",
    workshop: "Workshop",
    h5pactivity: "H5P",
    bigbluebuttonbn: "BigBlueButton",
  };

  return moduleNames[normalized] || moduleName;
}
