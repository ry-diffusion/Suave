import type { institutionKind } from "~~/server/lib/institutions";
import { getProviderById } from "~~/server/lib/providers";
import type { IFGoianoPresencialProvider } from "~~/server/lib/providers/IFGoianoPresencial";
import { Err, Ok } from "~~/shared/result";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const institution = session?.user?.institution;
  const authContext = session?.secure?.authContext;

  if (!institution || !authContext) {
    console.error(`Refresh error: ${authContext}`);
    throw createError({
      statusCode: 401,
      message: "Sessão expirada ou inválida. Faça login novamente.",
    });
  }

  const provider = getProviderById(
    institution as keyof typeof institutionKind.Values
  ) as IFGoianoPresencialProvider;
  await provider.restoreAuth(authContext);

  const refreshResult = await provider.refreshAuth(authContext);

  if (refreshResult.error) {
    console.error(`Refresh error: ${refreshResult.data.message}`);
    throw createError({
      statusCode: 401,
      message: `[REFRESH ERROR] ${refreshResult.data.message}`,
    });
  }

  await provider.restoreAuth(refreshResult.data);
  const identity = await provider.getIdentity();

  await replaceUserSession(event, {
    user: {
      institution: institution,
      fullName: identity.name,
      avatarUrl: identity.avatarUrl,
      hasAlternativeIdentity: identity.hasAlternativeIdentity,
    },
    secure: {
      authContext: refreshResult.data,
    },
  });

  return Ok({
    ok: true,
    authContext: refreshResult.data,
    identity,
  });
});
