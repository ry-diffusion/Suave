'use server'


export async function loginAction(prevState: {
    message: string,
    ok: boolean,
}, formData: FormData) {

    const userName = formData.get('username') // matricula
    const password = formData.get('password')
    const institution = formData.get('institution')

    if (!userName || !password || !institution) {
        return {
            ok: false,
            message: "Você precisa preencher todos os campos."
        }
    }


    return {
        ok: false,
        message: "not implemented :c"
    }
}