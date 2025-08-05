import { getProviderById } from "~~/server/lib/providers";
import { AppException } from "~~/shared/errors";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: "Usuário não autenticado",
    });
  }

  const query = getQuery(event);
  const ano = query.ano as string;
  const periodo = query.periodo as string;

  if (!ano || !periodo) {
    throw createError({
      statusCode: 400,
      message: "Parâmetros 'ano' e 'periodo' são obrigatórios",
    });
  }

  const provider = getProviderById(
    session.user.institution as "ifgoiano-presencial"
  );

  // Restore auth context from session
  if (session.secure?.authContext) {
    await provider.restoreAuth(session.secure.authContext);
  } else {
    throw createError({
      statusCode: 401,
      message: "Contexto de autenticação não encontrado",
    });
  }

  const boletimResult = await provider.getBoletim(ano, periodo);

  if (boletimResult.error) {
    if (boletimResult.data instanceof AppException) {
      if (boletimResult.data.code === "SESSION_EXPIRED") {
        throw createError({
          statusCode: 401,
          message: "Sessão expirada",
        });
      }
      if (boletimResult.data.code === "NOT_FOUND") {
        throw createError({
          statusCode: 404,
          message: "Boletim não encontrado",
        });
      }
      if (boletimResult.data.code === "EXTERNAL_SERVICE_ERROR") {
        throw createError({
          statusCode: 502,

          message: `O SUAP está com problemas. Tente novamente mais tarde.`,
        });
      }

      throw createError({
        statusCode: 400,
        message: `[SUAP] ${boletimResult.data.message}`,
      });
    }

    throw createError({
      statusCode: 503,
      message: `[SERVIÇO INDISPONÍVEL] ${boletimResult.data.message}`,
    });
  }

  return boletimResult.unwrap();
});
