export type LoginInput = {
    username: string,
    password: string
}

export type SuapLoginOutput = {
    refresh: string,
    access: string
}