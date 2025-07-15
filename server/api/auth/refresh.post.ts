import { getProviderById } from "~~/server/lib/providers";
import { institutionKind } from "~~/server/lib/institutions";
import { IFGoianoPresencialProvider } from "~~/server/lib/providers/IFGoianoPresencial";
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

    const provider = getProviderById(institution as keyof typeof institutionKind.Values) as IFGoianoPresencialProvider;
    // Always pass two arguments to restoreAuth for consistency
    await provider.restoreAuth(authContext);

    const refreshResult = await provider.refreshAuth(authContext)
        .handle(Error, async (e) => {
            throw createError({
                statusCode: 401,
                message: `[REFRESH ERROR] ${e.message}`,
            });
        })
        .toPromise();



    const refreshedAuthContext = refreshResult;
    await provider.restoreAuth(refreshedAuthContext);
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