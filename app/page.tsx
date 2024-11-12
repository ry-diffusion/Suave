"use client";

import Image from "next/image";
import SuaveTitle from "./components/SuaveTitle";
import SuaveCss from '@/app/styles/Suave.module.css'
import { useEffect, useState } from "react";
import { KnownInfo, Passport, REVISION, usePassport, useProvider } from "./AuthContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "./components/Loading";
import Link from "next/link";
import Content from "./components/Content";
import { Institution, Providers } from "@/Support/Institutions";

function LoginForm({
  onSubmit
}: { onSubmit: (matricula: string, password: string, provider: Institution) => void }) {
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")
  const [provider, setProvider] = useState<Institution>("Presencial IF Goiano")

  return <form className="flex flex-col gap-4 items-center" onSubmit={(e) => e.preventDefault()}>
    <h1 className="text-2xl">Entrar</h1>
    <h2> Selecione sua instituição </h2>
    <select className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2" onChange={
      ev => setProvider(ev.target.value)
    }>
      {Object.keys(Providers).map((provider) => <option key={provider} value={provider}>{provider}</option>)}
    </select>

    <input type="text" required minLength={2} placeholder="Insira sua matricula do SUAP" className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2" onChange={ev => setMatricula(ev.target.value)} />
    <input type="password" required minLength={2} placeholder="Insira sua senha do SUAP" className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2" onChange={ev => setSenha(ev.target.value)} />

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

function Whoami({ passport }: { passport: Passport }) {
  const { updateKnownInfo } = usePassport();
  const provider = useProvider();
  const moodle = provider.moodle!.useBridge(passport.moodleToken);


  const { isPending, error, data } = useQuery({
    queryKey: ['whoami'],
    queryFn: () => moodle.Whoami()
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
      <Link href="/Inicio"
        className={`hover:scale-110 rounded-full text-black transition-transform flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 bg-green-300`}
      >
        <Image

          src="/door.svg"
          alt="Door Icon"
          width={20}
          height={20}
        />

        Continuar
      </Link>

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
  const { passport, authenticate, updateKnownInfo } = usePassport()!;
  const [state, setLoginState] = useState('welcome')

  const submitLogin = async (username: string, password: string, institution: Institution) => {
    setLoginState('spin')

    const response = await fetch("/api/moodle/ResolveLogin", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Institution': institution
      },
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
      knownInfo: null,
      institution: institution
    })

    setLoginState('whoami')
  }

  if (passport != null && passport.knownInfo != null && passport.knownInfo.revision != REVISION) {
    console.log('^reseting known info')
    updateKnownInfo(null)
  }

  useEffect(() => {
    if (passport != null)
      setLoginState('whoami')
    else
      setLoginState('form')
  }, [passport])

  return (
    <Content>
      <SuaveTitle />

      {
        state == 'welcome' ? <></> : null
      }

      {
        state == 'form' ? <LoginForm onSubmit={submitLogin} /> : null
      }

      {
        state == 'spin' ? <Loading message="Iniciando sessão..." /> : null
      }

      {
        state == 'whoami' ? <Whoami passport={passport!} /> : null
      }
    </Content>
  )
}
