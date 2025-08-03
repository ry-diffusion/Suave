import { z } from "zod";
import { institutionKind } from "~~/server/lib/institutions";
import { getProviderById } from "~~/server/lib/providers";
import { AppException } from "~~/shared/errors";
import { Err, Ok } from "~~/shared/result";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Campo obrigatório" }),
  password: z.string().min(1, { message: "Campo obrigatório" }),
  institution: institutionKind,
});

export default defineEventHandler(async (event) => {
  const { username, password, institution } = await readValidatedBody(
    event,
    loginSchema.parse
  );

  const provider = getProviderById(institution);
  const loginResult = await provider.login({
    username,
    password,
  });

  const result = loginResult.assert(
    (authContext) => !!authContext,
    new AppException("Falha de autenticação", "LOGIN_FAILED")
  );

  if (result.error) {
    if (result.data instanceof AppException) {
      throw createError({
        statusCode: 417,
        message: result.data.message,
      });
    }

    console.error(result.data);
    throw createError({
      statusCode: 503,
      message: `[SERVIÇO INDISPONÍVEL] ${result.data.message}`,
    });
  }

  await provider.restoreAuth(result.data);

  const identity = await provider.getIdentity();

  await replaceUserSession(event, {
    user: {
      institution: institution,
      fullName: identity.name,
      avatarUrl: identity.avatarUrl,
      hasAlternativeIdentity: identity.hasAlternativeIdentity,
    },
    secure: {
      authContext: result.data,
    },
  });

  return Ok({
    ok: true,
    identity,
    authContext: result.data,
  });
});
