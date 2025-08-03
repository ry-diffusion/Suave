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

  const periodosLetivosResult = await provider.getPeriodosLetivos();

  if (periodosLetivosResult.error) {
    if (periodosLetivosResult.data instanceof AppException) {
      if (periodosLetivosResult.data.code === "SESSION_EXPIRED") {
        throw createError({
          statusCode: 401,
          message: "Sessão expirada",
        });
      }
      throw createError({
        statusCode: 417,
        message: `[SUAP] ${periodosLetivosResult.data.message}`,
      });
    }
    throw createError({
      statusCode: 503,
      message: `[SERVIÇO INDISPONÍVEL] ${periodosLetivosResult.data.message}`,
    });
  }

  return periodosLetivosResult.unwrap();
});
