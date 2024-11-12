"use client";

import { useQuery } from "@tanstack/react-query";
import Content from "../components/Content";
import Loading from "../components/Loading";
import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import TimedLoading from "../components/TimedLoading";
import { MoodleBridge } from "@/bridge/MoodleBridge";
import { GetAvailableModulesResponse, Module } from "../api/moodle/GetAvailableModules/route";
import Link from "next/link";
import SuaveTitle from "../components/SuaveTitle";

import GCSS from "@/app/styles/Suave.module.css";

function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // %d
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // %m
    const hours = date.getHours().toString().padStart(2, '0'); // %H
    const minutes = date.getMinutes().toString().padStart(2, '0'); // %M

    return `${day}/${month} ${hours}:${minutes}`;
}

function Acessar({ url }: { url: string }) {
    return <Link href={url} className="rounded-full bg-blue-500 text-black p-4 max-w-24 hover:scale-110 transition-all hover:bg-green-200">
        Acessar
    </Link>
}

function ModuleCard({ module, course }: { module: Module, course: string }) {
    const parent = course.split(' - ')[1]

    return <div className={`flex flex-col gap-4 p-8 rounded-sm bg-zinc-900`}>

        <h2> {module.name} • {parent} </h2>
        <h3> Fecha em {formatDate(new Date(module.dueDate!))} </h3>
        <Acessar url={module.url} />
    </div>
}

function TimeCategory({ name: time, modules }: { name: string, modules: Record<string, Module[]> }) {
    const avaliableModules = Object.entries(modules).filter(([_, modules]) => modules.length > 0)

    if (avaliableModules.length === 0) return

    return <div className={`flex flex-col gap-4 items-center`}>
        <h2 className={`uppercase ${GCSS.blueGradientText} shadow-sm text-xl`}> {time} </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-between">
            {avaliableModules.map(([name, modules]) =>
                modules.map(module => {
                    return <ModuleCard module={module} course={name} key={module.name} />
                })
            )}
        </ul>
    </div>
}

function Dash({ available }: { available: GetAvailableModulesResponse }) {
    return <div className="flex flex-col gap-4 items-center">
        <h1> Eai? Estes são os moodles do momento </h1>

        <TimeCategory name="Moodles Abertos" modules={available.modules.current} />
        <TimeCategory name="Moodles Futuros" modules={available.modules.future} />
    </div>
}

export default function MoodlesDisponiveis() {
    const { passport } = useContext(AuthContext)!;

    if (!passport) {
        return <Content>
            <Loading message="Você não está logado! Redirecionando a página inicial" />
            <meta httpEquiv="refresh" content="1;url=/" />
        </Content>
    }

    const bridge = new MoodleBridge(passport.moodleToken);

    const { isLoading, error, data } = useQuery({
        queryKey: ['moodlesDisponiveis'],
        queryFn: () => bridge.GetAvailableModules()
    })

    return <Content>
        <SuaveTitle />

        {isLoading ? <TimedLoading message="Carregando moodles disponíveis..." /> : null}
        {error ? <p> Erro: {error.message} </p> : null}

        {data ? Dash({ available: data }) : null}
    </Content>
}