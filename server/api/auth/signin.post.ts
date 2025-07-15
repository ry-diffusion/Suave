import { z } from "zod";
import { getProviderById } from "~~/server/lib/providers";
import { institutionKind } from "~~/server/lib/institutions";
import { AppException } from "~~/shared/errors";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Campo obrigatório" }),
  password: z.string().min(1, { message: "Campo obrigatório" }),
  institution: institutionKind,
});

export default defineEventHandler(async (event) => {
  const { username, password, institution } = await readValidatedBody(
    event,
    loginSchema.parse,
  );

  const provider = getProviderById(institution);
  const loginResult = provider.login({
    username,
    password,
  });

  const response = await loginResult
    .handle(AppException, async (e) => {
      throw createError({
        statusCode: 417,
        message: e.message,
      });
    })
    .handle(Error, async (e) => {
      throw createError({
        statusCode: 503,
        message: `[SERVIÇO INDISPONÍVEL] ${e.message}`,
      });
    })
    .map(
      async (authContext) => {
        await provider.restoreAuth(authContext, {
          username,
          password,
        });

        const identity = await provider.getIdentity();
        await setUserSession(event, {
          user: {
            institution: institution,
            fullName: identity.name,
            avatarUrl: identity.avatarUrl,
            hasAlternativeIdentity: identity.hasAlternativeIdentity,
          },
          secure: {
            provider: {
              authContext,
            },
          },
        });

        return {
          ok: true,
        };
      },
    );

  return response;
});
