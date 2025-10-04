/**
 * Composable para gerenciar feature flags
 *
 * As feature flags são controladas por variáveis de ambiente
 * e permitem habilitar/desabilitar funcionalidades específicas
 */
export const useFeatureFlags = () => {
  const config = useRuntimeConfig();

  /**
   * Verifica se a funcionalidade de Desempenho Acadêmico está habilitada
   */
  const isDesempenhoAcademicoEnabled = computed(() => {
    return config.public.featureDesempenhoAcademico === "true";
  });

  /**
   * Verifica se a funcionalidade de Meus Projetos está habilitada
   */
  const isMeusProjetosEnabled = computed(() => {
    return config.public.featureMeusProjetos === "true";
  });

  return {
    isDesempenhoAcademicoEnabled,
    isMeusProjetosEnabled,
  };
};
