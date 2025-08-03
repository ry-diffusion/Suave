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

  const userDataResult = await provider.getMyData();

  if (userDataResult.error) {
    if (userDataResult.data instanceof AppException) {
      if (userDataResult.data.code === "SESSION_EXPIRED") {
        throw createError({
          statusCode: 401,
          message: "Sessão expirada",
        });
      }
      throw createError({
        statusCode: 417,
        message: `[SUAP] ${userDataResult.data.message}`,
      });
    }
    throw createError({
      statusCode: 503,
      message: `[SERVIÇO INDISPONÍVEL] ${userDataResult.data.message}`,
    });
  }

  return userDataResult.unwrap();
});
