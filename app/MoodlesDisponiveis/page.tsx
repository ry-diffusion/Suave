"use client";

import { useQuery } from "@tanstack/react-query";
import Content from "../components/Content";
import Loading from "../components/Loading";
import { usePassport, useProvider } from "../AuthContext";
import TimedLoading from "../components/TimedLoading";
import Image from "next/image";
import { MoodleBridge } from "@/bridge/MoodleBridge";
import { GetAvailableModulesResponse, Module } from "../api/moodle/GetAvailableModules/route";
import Link from "next/link";
import SuaveTitle from "../components/SuaveTitle";

import GCSS from "@/app/styles/Suave.module.css";
import { Course } from "@/moodle/AuthenticatedMobileApi";
import { useEffect, useState } from "react";
import ErrorDialog from "../components/ErrorDialog";

function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // %d
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // %m
    const hours = date.getHours().toString().padStart(2, '0'); // %H
    const minutes = date.getMinutes().toString().padStart(2, '0'); // %M

    const dateYear = date.getFullYear()

    if (dateYear !== new Date().getFullYear()) {
        return `${day}/${month}/${dateYear} ás ${hours}:${minutes
            }`;
    }

    return `${day}/${month} ${hours}:${minutes}`;
}

function Acessar({ url }: { url: string }) {
    return <Link href={url} className="rounded-full bg-blue-500 text-black p-4 max-w-24 hover:scale-110 transition-all hover:bg-green-200 mt-auto self-start" target="_blank">
        Acessar
    </Link>
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`${className} flex text-center self-end px-2 shadow-sm rounded-xl absolute items-center gap-1 m-[-8px]`}> {children} </div>
}

function Concluido() {
    return <Badge className="text-black bg-green-400 shadow-green-200">
        <Image className="black" src="/check.svg" alt="Check Icon" width={20} height={20} />
        Concluído
    </Badge>
}

function Pendente() {
    return <Badge className="text-black bg-yellow-200 shadow-yellow-200">
        <Image className="black" src="/sand-clock.svg" alt="Clock Icon" width={20} height={20} />
        Pendente
    </Badge>
}

function NãoFeito() {
    return <Badge className="text-black bg-red-200">
        <Image className="black" src="/sad-sit.svg" alt="Sad Icon" width={20} height={20} />
        Não Feito
    </Badge>
}

function ModuleCard({ module, course, showOpenDate }: { module: Module, course: string, showOpenDate?: boolean }) {
    const parent = course.split(' - ')[1]

    return <div className="relative flex flex-col min-h-full">
        {module.hasCompleted ? <Concluido /> :
            module.dueDate && new Date(module.dueDate) > new Date() ? <Pendente /> : <NãoFeito />}

        <div className={`flex flex-col gap-4 p-8 rounded-sm bg-zinc-900 min-h-full`}>

            <h2 className="uppercase text-blue-200"> {module.name} </h2>
            <div className="flex flex-col">
                <h3 className="text-balance"> {parent} </h3>
            </div>

            <div className="flex flex-col gap-1 mt-auto">
                {showOpenDate ? <div className="flex gap-1">
                    <h3 className="text-green-200"> Abre </h3>
                    {module.allowSubmissionsFrom ?
                        <h3 className="text-end"> em {formatDate(new Date(module.allowSubmissionsFrom!))} </h3>
                        : <h3 className="text-end italic"> data desconhecida </h3>}
                </div> : null}

                <div className="flex gap-1">
                    <h3 className="text-red-200"> Fecha </h3>
                    {module.dueDate ?
                        <h3 className="text-left"> em {formatDate(new Date(module.dueDate!))} </h3>
                        : <h3 className="text-left italic"> data desconhecida </h3>}
                </div>
            </div>

            <div className="flex flex-row place-content-between items-center">
                <Acessar url={module.url} />

            </div>
        </div >
    </div>
}


function generatePrettyMessage(course: string, modules: Module[]) {
    const parent = course.split(' - ')[1]

    const emojis = {
        "assign": "📝",
        "forum": "💬",
        "quiz": "🧠",
        "url": "🔗",
        "page": "📄",
        "book": "📚",
        "folder": "📁",
        "resource": "📦",
        "label": "🏷️",
        "lesson": "📖",
        "choice": "🤔",
        "feedback": "📣",
        "workshop": "🔨",
        "glossary": "📖",
        "wiki": "📖",
        "survey": "📊",
        "data": "📊",
        "attendance": "📋",
        "scorm": "📦",
        "h5pactivity": "🎮",
    }

    if (modules.length === 0) return ""

    let moodleContent = `📚 ${parent}\n`

    for (const moodleModule of modules) {
        let de = ""
        const from = new Date(moodleModule.allowSubmissionsFrom!)
        // verify if its is bigger than epoch
        if (from > new Date(0)) {
            de = `De: ${formatDate(from)}, `
        }

        moodleContent += ` ➤ ${emojis[moodleModule.kind as keyof typeof emojis]} ${moodleModule.name} (${de}até ${formatDate(new Date(moodleModule.dueDate!))})\n`
        moodleContent += `Acesse em ${moodleModule.url}\n`
    }

    return moodleContent
}

function generateFullMessage(title: string, all: Record<string, Module[]>) {
    const messages = Object.entries(all).map(([course, modules]) => {
        return generatePrettyMessage(course, modules)
    }).filter(x => x.trim().length > 0)

    let total = 0
    for (const modules of Object.values(all)) {
        total += modules.length
    }

    const verbTem = total > 1 ? "temos" : "tem"
    const verbDisponiveis = total > 1 ? "atividades disponíveis" : "atividade disponível"

    let output = `📅✨ ${title} 🚀\n`
    output += `🎉 Eae, galera, suave na nave? ${verbTem} ${total} ${verbDisponiveis}! 🚀\n\n`
    output += messages.join("\n\n")
    output += "\n😃 Criado usando o Suave (https://suave-one.vercel.app/)."

    return output
}


function TimeCategory({ name: time, modules, showOpenDate }: { name: string, modules: Record<string, Module[]>, showOpenDate?: boolean }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const avaliableModules = Object.entries(modules).filter(([_, modules]) => modules.length > 0)

    if (avaliableModules.length === 0) return

    const shareWhatsapp = () => {
        const message = generateFullMessage(time, modules)

        if (message.trim().length === 0) {
            return
        }

        // detect if android or ios, if so, use the whatsapp:// protocol

        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            window.location.href = `whatsapp://send?text=${encodeURIComponent(message)}`
            return
        }

        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`


        window.open(url, '_blank')
    }

    return <div className={`flex flex-col gap-4 items-center min-w-full`}>
        <div className="flex gap-2 justify-items-center items-center">
            <button className="bg-green-200 rounded-full p-2 hover:scale-110 transition-all text-black" onClick={shareWhatsapp}>
                <Image src="/zap.svg" alt="Zap Icon" width={20} height={20} />
            </button>

            <h2 className={`uppercase ${GCSS.blueGradientText} shadow-sm text-2xl`}> {time} </h2>
        </div>

        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-between">
            {avaliableModules.map(([name, modules]) =>
                modules.map(module => {
                    return <ModuleCard module={module} course={name} key={module.url} showOpenDate={showOpenDate} />
                })
            )}
        </ul>
    </div>
}

function Stats({ available }: { available: GetAvailableModulesResponse }) {
    let didMoodles = 0
    let total = 0

    for (const [, cats] of Object.entries(available.modules)) {
        for (const [, mods] of Object.entries(cats)) {
            for (const mod of mods) {
                if (mod.hasCompleted) {
                    didMoodles++
                }

                total++
            }
        }
    }

    const percentage = ((didMoodles / total) * 100).toFixed(2)

    return <div className="flex flex-col gap-4 items-center">
        <h1> Eai? Estes são os moodles do momento. </h1>
        <h2> Você fez {didMoodles} de {total} atividades, ou seja, {percentage}%! </h2>
    </div>
}

function Dash({ available, isReady }: { available: GetAvailableModulesResponse, isReady: boolean }) {
    return <div className="flex flex-col gap-4 items-center">
        {isReady ? <Stats available={available} /> : <h1> Carregando... </h1>}

        <TimeCategory name="Moodles Abertos" modules={available.modules.current} />
        <TimeCategory name="Moodles Futuros" modules={available.modules.future} showOpenDate />
        <TimeCategory name="Moodles Passados" modules={available.modules.past} />
    </div>
}


function LoadCourses({ courses, bridge }: { courses: Course[], bridge: MoodleBridge }) {
    const [isLoading, setIsLoading] = useState(true)
    const [text, setText] = useState("Preparando-se...")

    const [available, setAvailable] = useState<{ modules: Record<string, Module[]> }>({
        modules: {
            current: [],
            future: [],
            past: []
        }
    })

    useEffect(() => {
        const fetchCourse = async (course: Course) => {
            const pieces = course.fullname.split(' - ')
            let name = course.fullname

            if (pieces.length > 1) {
                name = course.fullname.split(' - ')[1]
            }

            const { modules } = await bridge.GetAvailableModules([course])

            // merge available modules
            setAvailable(a => {
                const available = { ...a }
                for (const [key, value] of Object.entries(modules)) {
                    if (!available.modules[key]) {
                        available.modules[key] = []
                    }

                    available.modules[key] = {
                        ...available.modules[key],
                        ...value
                    }
                }

                return available
            });

            setText(`Analisado: ${name}`)
        }

        const fetchModules = async () => {
            const tasks = courses.map(fetchCourse)

            /** 
             * Uma coisa que nunca vou entender
             * É de porque ser mais rápido buscar curso por curso em várias requisições
             * Do que buscar tudo de uma vez KKKKKKKKKKKKKKK?
             * Foda.
             * ~Moizes
            */
            await Promise.all(tasks)

            setIsLoading(false)
        }

        fetchModules()
    }, [courses, bridge])

    return <div className="flex flex-col gap-4 items-center">
        {
            isLoading ? <TimedLoading message={`${text}`} /> : null
        }

        {
            available ? <Dash available={available as unknown as GetAvailableModulesResponse} isReady={!isLoading} /> : null
        }
    </div>
}

function Container() {
    const { passport } = usePassport();
    const provider = useProvider();
    const bridge = provider.moodle!.useBridge(passport!.moodleToken);

    const { isLoading, error, data } = useQuery({
        queryKey: ['courses'],
        queryFn: () => bridge.GetEnrolledCourses()
    })

    return <Content>
        <SuaveTitle />

        {isLoading ? <TimedLoading message="Analisando as matérias que você tem..." /> : null}
        {error ? <ErrorDialog error={error.message} /> : null}

        {data ? <LoadCourses courses={data.courses} bridge={bridge} /> : null}
    </Content>

}

export default function MoodlesDisponiveis() {
    const { passport } = usePassport();

    if (!passport) {
        return <Content>
            <Loading message="Sessão inválida! Redirecionando a página inicial" />
            <meta httpEquiv="refresh" content="0;url=/" />
        </Content>
    }

    return <Container />
}