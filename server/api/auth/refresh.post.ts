import { getProviderById } from "~~/server/lib/providers";
import { institutionKind } from "~~/server/lib/institutions";
// getUserSession and replaceUserSession are available as auto-imports in Nuxt 3, so no import is needed

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    const institution = session?.user?.institution;
    const authContext = session?.secure?.authContext;

    if (!institution || !authContext) {
        throw createError({
            statusCode: 401,
            message: "Sessão expirada ou inválida. Faça login novamente.",
        });
    }

    const provider = getProviderById(institution as keyof typeof institutionKind.Values);
    // Always pass two arguments to restoreAuth for consistency
    await provider.restoreAuth(authContext, authContext?.creds || {});

    const refreshResult = await provider.refreshAuth(authContext)
        .handle(Error, async (e) => {
            throw createError({
                statusCode: 401,
                message: `[REFRESH ERROR] ${e.message}`,
            });
        })
        .toPromise();

    if (!refreshResult.isSuccess) {
        throw createError({
            statusCode: 401,
            message: refreshResult.error?.message || "Falha ao atualizar sessão. Faça login novamente.",
        });
    }

    const refreshedAuthContext = refreshResult.value;
    await provider.restoreAuth(refreshedAuthContext, refreshedAuthContext?.creds || {});
    const identity = await provider.getIdentity();

    await replaceUserSession(event, {
        user: {
            institution: institution,
            fullName: identity.name,
            avatarUrl: identity.avatarUrl,
            hasAlternativeIdentity: identity.hasAlternativeIdentity,
        },
        secure: {
            authContext: refreshedAuthContext,
        },
    });

    return {
        ok: true,
        authContext: refreshedAuthContext,
        identity,
    };
}); 