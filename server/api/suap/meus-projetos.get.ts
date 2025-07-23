import { getProviderById } from "~~/server/lib/providers";
import { AppException } from "~~/shared/errors";
import { ShouldReloginError } from "~~/server/lib/provider";

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event);

	if (!session.user) {
		throw createError({
			statusCode: 401,
			message: "Usuário não autenticado",
		});
	}

	const provider = getProviderById(
		session.user.institution as "ifgoiano-presencial",
	);

	// Restore auth context from session
	if (session.secure?.authContext) {
		await (provider as any).restoreAuth(session.secure.authContext);
	} else {
		throw createError({
			statusCode: 401,
			message: "Contexto de autenticação não encontrado",
		});
	}

	const projetosResult = await provider
		.getProjetos()
		.handle(AppException, async (e) => {
			throw createError({
				statusCode: 417,
				message: `[SUAP] ${e.message}`,
			});
		})
		.handle(Error, async (e) => {
			throw createError({
				statusCode: 503,
				message: `[SERVIÇO INDISPONÍVEL] ${e.message}`,
			});
		})
		.toPromise();

	return {
		ok: true,
		data: projetosResult,
	};
});
