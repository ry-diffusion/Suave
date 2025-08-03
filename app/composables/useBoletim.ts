import type { Disciplina, PeriodoLetivo } from "~~/shared/boletim";

export const useBoletim = () => {
  const getPeriodosLetivos = async (): Promise<PeriodoLetivo[]> => {
    return await $fetch("/api/suap/periodos-letivos");
  };

  const getBoletim = async (
    ano: string,
    periodo: string
  ): Promise<Disciplina[]> => {
    return await $fetch("/api/suap/boletim", {
      query: {
        ano,
        periodo,
      },
    });
  };

  return {
    getPeriodosLetivos,
    getBoletim,
  };
};
