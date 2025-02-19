"use client";

import {useQuery} from "@tanstack/react-query";
import Content from "@/components/Content";
import SuaveTitle from "@/components/SuaveTitle";
import ErrorDialog from "@/components/ErrorDialog";
import {useEffect, useState} from "react";
import TimedLoading from "@/components/TimedLoading";
import {LetivosOut} from "@/app/(api)/api/suap/Periodos/route";
import {ApiDisciplina} from "@/app/(api)/api/suap/Boletim/[ano]/[periodo]/route";
import Image from "next/image";
import {useAuth} from "@/lib/auth/context";
import {useProvider} from "@/lib/auth/client";

interface CurrentState {
    // Ano -> Periodo -> Disciplinas
    disciplinas: Record<number, Record<string, ApiDisciplina>>,
    periodos: LetivosOut
}

function DownloadData({setState, setUiState}: {
    setState: (state: CurrentState) => void,
    setUiState: (state: 'downloadContent' | 'readyToShow') => void
}) {
    const provider = useProvider();
    const {passport} = useAuth();


    const {data, error} = useQuery({
        queryKey: [],
        queryFn: async () => {
            const token = await fetch('/api/suap/ResolveLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: passport!.username,
                    password: passport!.password
                })
            }).then(r => r.json()).then(r => r.access);

            console.log(`[SUAP] Token: ${token}`)

            const bridge = provider.suap!.makeBridge(token);

            const periodoLetivos = await bridge.GetPeriodoLetivos()

            console.log(`[SUAP] Periodos: ${Object.keys(periodoLetivos).join(", ")}`)

            const disciplinas: Record<number, Record<string, ApiDisciplina>> = {}

            for (const ano in periodoLetivos) {
                const boletimDisciplinas = await bridge.GetBoletim(ano, '1');
                console.log(`[SUAP] Disciplinas: ${Object.keys(boletimDisciplinas).join(", ")}`)
                disciplinas[parseInt(ano)] = boletimDisciplinas;
            }

            return {periodoLetivos, disciplinas}
        }
    });


    useEffect(() => {
        if (data) {
            const L = window.localStorage;
            L.setItem("OnGoingCache.Disciplinas", JSON.stringify(data.disciplinas));
            L.setItem("OnGoingCache.PeriodoLetivo", JSON.stringify(data.periodoLetivos));
            setState({
                disciplinas: data.disciplinas,
                periodos: data.periodoLetivos
            })
            setUiState('readyToShow')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (error) {
        return <Content>
            <SuaveTitle/>
            <ErrorDialog error={error.message}/>
        </Content>
    }

    return <Content>
        <SuaveTitle/>
        <TimedLoading message="Baixando dados do SUAP..."/>
    </Content>

}

const gatherGrades = (disciplina: ApiDisciplina) =>
    [disciplina.etapas["1"].nota, disciplina.etapas["2"].nota, disciplina.etapas["3"].nota, disciplina.etapas["4"].nota, disciplina.etapas["final"].nota].filter(n => n !== null)


function Disciplinas({disciplinas}: { disciplinas: Record<string, ApiDisciplina> }) {
    const [method, setSortState] = useState<'cargaHoraria' | 'nota'>('cargaHoraria')
    let entries = Object.entries(disciplinas)

    switch (method) {
        case 'cargaHoraria':
            entries = entries.sort((a, b) => (100 * (b[1].cargaHorariaCumprida / b[1].cargaHoraria)) - (100 * (a[1].cargaHorariaCumprida / a[1].cargaHoraria)))
            break;
        case 'nota':
            entries = entries.sort((a, b) => {
                const sumGradesB = [b[1].etapas["1"].nota, b[1].etapas["2"].nota, b[1].etapas["3"].nota, b[1].etapas["4"].nota, b[1].etapas["final"].nota].filter(n => n !== null)
                const sumGradesA = [a[1].etapas["1"].nota, a[1].etapas["2"].nota, a[1].etapas["3"].nota, a[1].etapas["4"].nota, a[1].etapas["final"].nota].filter(n => n !== null)

                const mediaB = sumGradesB.reduce((a, b) => a + b, 0) / sumGradesB.length
                const mediaA = sumGradesA.reduce((a, b) => a + b, 0) / sumGradesA.length

                return mediaB - mediaA
            })
            break;
    }


    return <div className="flex flex-col gap-4">
        <div className="flex-row flex items-center gap-4 justify-evenly">
            <h2 className="text-2xl font-bold">Disciplinas</h2>

            <select className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2"
                    onChange={e => setSortState(e.target.value as 'nota' | 'cargaHoraria')}>
                <option value="cargaHoraria">Carga horária</option>
                <option value="nota">Nota</option>
            </select>
        </div>

        <div className="flex flex-col gap-2 ">
            {
                entries.map(([nomeDisciplina, disciplina]) =>
                    <Disciplina key={nomeDisciplina} method={method} disciplina={disciplina}
                                nomeDisciplina={nomeDisciplina}/>
                )
            }
        </div>
    </div>
}

function sanitizeDisciplinaName(nomeDisciplina: string): string {
    // get only the name (ONLY CHARACTERS!) May include unicode characters (like accents) and spaces

    let name = nomeDisciplina.split(' - ')[1] ?? nomeDisciplina;
    if (nomeDisciplina.startsWith("Atividade")) {
        name = nomeDisciplina.split(' - ')[2] ?? nomeDisciplina;
    }

    return name.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}

function Disciplina({disciplina, nomeDisciplina, method}: {
    disciplina: ApiDisciplina,
    nomeDisciplina: string,
    method: 'cargaHoraria' | 'nota'
}) {
    let progressColor = 'bg-green-500';
    let percentage = 0;

    switch (method) {
        case 'cargaHoraria':
            progressColor = disciplina.cargaHorariaCumprida >= disciplina.cargaHoraria ? 'bg-green-500'
                : disciplina.cargaHorariaCumprida / disciplina.cargaHoraria > 0.8 ? 'bg-blue-500'
                    : disciplina.cargaHorariaCumprida / disciplina.cargaHoraria > 0.7 ? 'bg-orange-500' : 'bg-red-500';
            percentage = (100 * (disciplina.cargaHorariaCumprida / disciplina.cargaHoraria));
            break;
        case 'nota':
            const media = gatherGrades(disciplina).reduce((a, b) => a + b, 0) / gatherGrades(disciplina).length;
            progressColor = media >= 8 ? 'bg-green-500'
                : media >= 6 ? 'bg-blue-500'
                    : media >= 3 ? 'bg-orange-500' : 'bg-red-500';
            percentage = media * 10;
            break;
    }

    const nome = sanitizeDisciplinaName(nomeDisciplina)

    return <div key={nomeDisciplina}
                className="flex flex-col relative min-h-full w-full items-center bg-zinc-900 rounded-sm z-100 shadow-inner shadow-neutral-800">
        <div className="flex flex-col w-full h-full">
            {/* background */}
            <div className="absolute top-0 bg-zinc-800 min-h-[24px] w-full z-10 shadow-inner shadow-zinc-900"></div>

            {/* progress */}
            <div
                className={`absolute top-0 shadow-inner  shadow-zinc-900 ${progressColor} min-h-[24px] max-w-full z-20`}
                style={{
                    width: `${percentage}%`
                }}></div>
        </div>

        <div className="z-30 self-start mt-4 h-full">
            <div className="flex flex-col m-4 h-full">
                <h3 className="text-lg font-bold drop-shadow-xl shadow-red">{nome}</h3>

                {method == 'cargaHoraria' ?
                    <p className="text-lg">Aulas: {disciplina.cargaHorariaCumprida}/{disciplina.cargaHoraria}</p> : null}

                <p className="text-lg mt-auto">Média: {(gatherGrades(disciplina).reduce((a, b) => a + b, 0) / gatherGrades(disciplina).length).toFixed(2)}</p>
            </div>
        </div>
    </div>;
}

function Card({title, children, className}: { title: string, children: React.ReactNode, className?: string }) {
    return <div className={`flex flex-col gap-4 ${className} shadow-inner shadow-neutral-800 p-4 rounded-xl`}>
        <h3 className="text-lg font-bold">{title}</h3>
        {children}
    </div>
}

function InfoCards({disciplinas}: { disciplinas: Record<string, ApiDisciplina> }) {
    const sum = (values: number[]) => values.reduce((a, b) => a + b, 0)
    const allTimeFrequency = Object.values(disciplinas).reduce((a, b) => a + b.frequencia, 0) / Object.values(disciplinas).length

    const sortNota = Object.entries(disciplinas).sort((a, b) => {
        const sumGradesB = sum(gatherGrades(b[1]))
        const sumGradesA = sum(gatherGrades(a[1]))

        const mediaB = sumGradesB / gatherGrades(b[1]).length
        const mediaA = sumGradesA / gatherGrades(a[1]).length

        return mediaB - mediaA
    });

    const [melhorDisciplina, piorDisciplina] = [sortNota[0], sortNota[sortNota.length - 1]]

    const melhorDisciplinaNome = sanitizeDisciplinaName(melhorDisciplina[0])
    const piorDisciplinaNome = sanitizeDisciplinaName(piorDisciplina[0])

    const disciplinasFreq = Object.entries(disciplinas).sort((a, b) => b[1].frequencia - a[1].frequencia)
    const disciplinaQueMaisFaltou = disciplinasFreq[disciplinasFreq.length - 1]

    const geraTextoFrequencia = (frequencia: number) => {
        if (frequencia > 98) return "Você é onipresente! Como faz isso? 😱"
        if (frequencia > 90) return "Incrível! Você está sempre presente! 🌟"
        if (frequencia > 80) return "Ótimo trabalho! Continue assim! 👍"
        if (frequencia > 75) return "Bem no limite! 😐"
        if (frequencia > 60) return "Você um turista? 🤔"
        if (frequencia > 50) return "Eai, turista, por onde andou? 😅"
        return "Você não é um turista mano.. É um fantasma 😱"
    }

    return <div className="flex flex-col gap-4 md:max-w-[70%]">
        <h2 className="text-2xl font-bold">Informações Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Card title="😃 Sua melhor Disciplina" className="bg-blue-800 min-h-full">
                <h2> Wow, você parece ser bom em <span className="font-extrabold">{melhorDisciplinaNome}</span>!
                    Parabéns 😉</h2>
                <p className="mt-auto">Média: {sum(gatherGrades(melhorDisciplina[1])) / gatherGrades(melhorDisciplina[1]).length}</p>
            </Card>

            <Card title="😔 Sua pior Disciplina" className="bg-orange-800">
                <h2> Ops, parece que você não foi muito bem em <span
                    className="font-extrabold">{piorDisciplinaNome}</span>... </h2>
                <p className="mt-auto">Média: {sum(gatherGrades(piorDisciplina[1])) / gatherGrades(piorDisciplina[1]).length}</p>
            </Card>

            <Card title="⏰ Frequência Média" className="bg-emerald-800">
                <h2> {geraTextoFrequencia(allTimeFrequency)} </h2>
                <p className="mt-auto">Frequência: {allTimeFrequency.toFixed(2)}%</p>
            </Card>

            <Card title="😅 Disciplina que mais faltou" className="bg-red-800">
                {
                    disciplinaQueMaisFaltou[1].frequencia > 75 ?
                        <h2> As vezes deu preguiça de ir na aula de <span
                            className="font-extrabold">{sanitizeDisciplinaName(disciplinaQueMaisFaltou[0])}</span>, né?
                        </h2>
                        : disciplinaQueMaisFaltou[1].frequencia > 60 ?
                            <h2> Pelo menos, você foi em alguma aula de <span
                                className="font-extrabold">{sanitizeDisciplinaName(disciplinaQueMaisFaltou[0])}</span>...
                            </h2>
                            : <h2> Você odeia <span
                                className="font-extrabold">{sanitizeDisciplinaName(disciplinaQueMaisFaltou[0])}</span>?</h2>
                }
                <p className="mt-auto">Frequência da disciplina: {disciplinaQueMaisFaltou[1].frequencia.toFixed(2)}%</p>
            </Card>
        </div>

    </div>
}

function ShowEmAll({state}: { state: CurrentState }) {
    const [periodo, setPeriodo] = useState<string>(Object.keys(state.periodos)[0])

    const discPeriodo = state.disciplinas[parseInt(periodo)]
    return <div className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">Desempenho Acadêmico</h1>

        <div className="flex flex-row gap-4 items-center">
            <p> Selecione o período letivo: </p>
            <select value={periodo} onChange={e => setPeriodo(e.target.value)}
                    className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2">
                {
                    Object.keys(state.periodos).map(ano => {
                        return <option key={ano} value={ano}>{ano}</option>
                    })
                }
            </select>
        </div>

        <div className="flex flex-col-reverse gap-4 md:flex-row">
            <div className="">
                <Disciplinas disciplinas={discPeriodo}/>
            </div>

            <InfoCards disciplinas={discPeriodo}/>
        </div>
    </div>
}

export default function AcademicPerformance() {
    const [state, setState] = useState<CurrentState | null>(null)
    const [uiState, setUiState] = useState('welcome')

    useEffect(() => {
        if (!state) {
            const L = window.localStorage;
            if (!L.getItem("OnGoingCache.Disciplinas") || !L.getItem("OnGoingCache.PeriodoLetivo")) {
                setUiState('downloadContent')
                return;
            }

            const disciplinas = JSON.parse(L.getItem("OnGoingCache.Disciplinas")!);
            const periodos = JSON.parse(L.getItem("OnGoingCache.PeriodoLetivo")!);
            setState({
                periodos,
                disciplinas
            })
            setUiState('readyToShow')
            return
        }

    }, [state])


    if (uiState === 'downloadContent') {
        return <DownloadData setState={setState} setUiState={setUiState}/>
    }

    return <Content>
        <SuaveTitle/>

        <Card title="Bem-vindo! Antes de começar..." className="bg-neutral-900">
            <div className="flex-row flex gap-4">
                <Image className='invert rounded-full' src="/error.svg" alt="Error" width={48} height={48}/>

                <p> O Suave tenta ser o mais preciso possível, porém, nesta aba ele assume algumas coisas. Por exemplo,
                    aqui ele faz uma média simples com as notas atuais. Então se o processor ainda não lançou a nota do
                    segundo semestre ele só realizara a media simples com as notas do primeiro semestre. </p>
            </div>
        </Card>

        {state ? <button onClick={() => {
            const L = window.localStorage;
            L.removeItem("OnGoingCache.Disciplinas")
            L.removeItem("OnGoingCache.PeriodoLetivo")

            setUiState('downloadContent')
            setState(null)
        }} className="bg-zinc-800 p-2 rounded-lg">Recarregar dados</button> : null}

        {
            state ? <ShowEmAll state={state}/> : null
        }
    </Content>
}