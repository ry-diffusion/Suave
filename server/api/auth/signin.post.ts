import { z } from "zod";
import { institutionKind } from "~/server/lib/institutions";
import { getProviderById } from "~/server/lib/providers";

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
  try {
    const response = await provider.login({
      username,
      password,
    });
    const client = provider.getMoodleClient(response.authToken);
    const info = await client.core.webservice.getSiteInfo();
    console.log(info.fullname);

    await setUserSession(event, {
      user: {
        institution: institution,
        fullName: info.fullname,
        avatarUrl: info.userpictureurl,
      },
      secure: {
        moodle: {
          apiKey: response.authToken,
        },
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 401,
      statusMessage:
        error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});
