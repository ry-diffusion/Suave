"use client"

import { Institution, Providers } from "@/Support/Institutions"
import Image from "next/image"
import React from "react"

export default function LoginForm({
    onSubmit
}: { onSubmit: (matricula: string, password: string, provider: Institution) => void }) {
    const [matricula, setMatricula] = React.useState("")
    const [senha, setSenha] = React.useState("")
    const [provider, setProvider] = React.useState<Institution>("Presencial IF Goiano")

    return <form className="flex flex-col gap-4 items-center" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-2xl">Entrar</h1>
        <h2> Selecione sua instituição </h2>
        <select className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2" onChange={
            ev => setProvider(ev.target.value)
        }>
            {Object.keys(Providers).map((provider) => <option key={provider} value={provider}>{provider}</option>)}
        </select>

        <input type="text" required minLength={2} placeholder="Insira sua matricula do SUAP"
            className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2"
            onChange={ev => setMatricula(ev.target.value)} />
        <input type="password" required minLength={2} placeholder="Insira sua senha do SUAP"
            className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2"
            onChange={ev => setSenha(ev.target.value)} />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
                onClick={() => onSubmit(matricula, senha, provider)}
                className={`hover:scale-110 rounded-full text-black transition-transform flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 bg-cyan-300`}
            >
                <Image
                    src="/unlock.svg"
                    alt="Unlock Icon"
                    width={20}
                    height={20}
                />

                Entrar
            </button>

        </div>
    </form>
}

