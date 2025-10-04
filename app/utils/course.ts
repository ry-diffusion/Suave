/**
 * Simplifica o nome completo de um curso do Moodle
 * Remove prefixos numéricos e informações redundantes
 *
 * @param fullName - Nome completo do curso
 * @returns Nome simplificado do curso
 *
 * @example
 * simplifyCourseName("123 - Matemática - Turma A") // "Matemática"
 * simplifyCourseName("SUAP2024 - Programação") // "Programação"
 * simplifyCourseName("(2025) - Desenvolvimento WEB I") // "Desenvolvimento WEB I"
 */
export function simplifyCourseName(fullName: string): string {
  let name = fullName;

  // Remove prefixos como "123 - " ou "(2025) - "
  name = name.replace(/^\d+ - /, "");
  name = name.replace(/^\(\d+\)\s*-\s*/, "");

  // Pega apenas a primeira parte antes do " - "
  const parts = name.split(" - ");
  if (parts.length > 0 && parts[0]) {
    name = parts[0];
  }

  // Remove prefixos SUAP seguidos de números
  name = name.replace(/^SUAP\d+\s*-\s*/, "");

  return name.trim();
}
