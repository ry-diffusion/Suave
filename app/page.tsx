"use client";

import Image from "next/image";
import SuaveTitle from "./components/SuaveTitle";
import SuaveCss from '@/app/styles/Suave.module.css'
import { useContext, useEffect, useState } from "react";
import { AuthContext, KnownInfo, Passport, REVISION } from "./AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "./components/Loading";

function LoginForm({
  onSubmit
}: { onSubmit: (matricula: string, password: string) => void }) {
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")

  return <form className="flex flex-col gap-4 items-center" onSubmit={(e) => e.preventDefault()}>
    <input type="text" required minLength={2} placeholder="Insira sua matricula do SUAP" className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2" onChange={ev => setMatricula(ev.target.value)} />
    <input type="password" required minLength={2} placeholder="Insira sua senha do SUAP" className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2" onChange={ev => setSenha(ev.target.value)} />

    <div className="flex gap-4 items-center flex-col sm:flex-row">
      <button
        onClick={() => onSubmit(matricula, senha)}
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


function KnowninfoShow({ knownInfo }: { knownInfo: KnownInfo }) {
  return <div className="flex flex-col gap-4 items-center">
    <Image src={knownInfo.pictureUrl ?? '/user.svg'} alt="User Picture" width={100} height={100} className="rounded-full border-solid border-2 border-red-200" />

    <div className="flex text-xl">
      <p className="flex text-xl gap-1">
        Olá,
        <span className={`${SuaveCss.blueGradientText} text-xl`}> {knownInfo.firstName} </span>
      </p>
      !
    </div>
  </div>
}

export function Whoami({ passport }: { passport: Passport }) {
  const { updateKnownInfo, logout } = useContext(AuthContext)!;

  const { isPending, error, data } = useQuery({
    queryKey: ['whoami'],
    queryFn: () => fetch('/api/moodle/Whoami', {
      headers: {
        'Authorization': `Bearer ${passport.moodleToken}`
      }
    }).then(r => r.json())
  })

  useEffect(() => {
    if (data && passport.knownInfo == null) {
      updateKnownInfo({
        fullName: data.fullName,
        firstName: data.firstName,
        pictureUrl: data.pictureUrl,
        revision: REVISION
      });
    }
  }, [data, updateKnownInfo, passport.knownInfo]);

  if (passport.knownInfo == null) {
    if (isPending) {
      return <Loading message="Baixando perfil do Moodle..." />
    }

    if (error || (data && data.error)) {
      return <div className="flex flex-col gap-4">
        {error ? <p> Erro: {error.message} </p> : null}
        {data && data.error ? <p> Erro: {data.error} </p> : null}

      </div>
    }
  }

  return <div className="flex flex-col gap-4">
    {passport.knownInfo ? <KnowninfoShow knownInfo={passport.knownInfo!} /> : <></>}


    <div className="flex gap-4">
      <button
        className={`hover:scale-110 rounded-full text-black transition-transform flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 bg-green-300`}
      >
        <Image

          src="/door.svg"
          alt="Door Icon"
          width={20}
          height={20}
        />

        Continuar
      </button>

      <a
        href="/logout"
        target="_self"
        className={`hover:scale-110 rounded-full text-black transition-transform flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 bg-neutral-700`}
      >
        <Image
          className="invert"
          src="/log-out.svg"
          alt="Door Icon"
          width={20}
          height={20}
        />

      </a>
    </div>
  </div>
}

export default function Home() {
  const { passport, authenticate, updateKnownInfo } = useContext(AuthContext)!;
  const [state, setLoginState] = useState(passport != null ? 'whoami' : 'form')

  const submitLogin = async (username: string, password: string) => {
    setLoginState('spin')

    const response = await fetch("/api/moodle/ResolveLogin", {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    }).then(r => r.json())

    if (response.error != null) {
      alert(response.error)
      setLoginState('form')
      return
    }

    const moodleToken = response.token as string;

    authenticate({
      username,
      password,
      moodleToken,
      suapToken: null,
      knownInfo: null
    })

    setLoginState('whoami')
  }

  if (passport != null && passport.knownInfo != null && passport.knownInfo.revision != REVISION) {
    console.log('^reseting known info')
    updateKnownInfo(null)
  }

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <SuaveTitle />

        {
          state == 'form' ? <LoginForm onSubmit={submitLogin} /> : <></>
        }

        {
          state == 'spin' ? <Loading message="Iniciando sessão..." /> : <></>
        }

        {
          state == 'whoami' ? <Whoami passport={passport!} /> : <></>
        }

      </main >
    </div >
  );
}
