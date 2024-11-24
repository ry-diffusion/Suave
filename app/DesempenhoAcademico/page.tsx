"use client";

import { useQuery } from "@tanstack/react-query";
import { usePassport, useProvider } from "../AuthContext";
import Content from "../components/Content";
import Loading from "../components/Loading";
import SuaveTitle from "../components/SuaveTitle";
import ErrorDialog from "../components/ErrorDialog";
import { useEffect, useState } from "react";
import TimedLoading from "../components/TimedLoading";
import { LetivosOut } from "../api/suap/Periodos/route";
import { ApiDisciplina } from "../api/suap/Boletim/[ano]/[periodo]/route";
import Image from "next/image";

interface CurrentState {
    // Ano -> Periodo -> Disciplinas
    disciplinas: Record<number, Record<string, ApiDisciplina>>,
    periodos: LetivosOut
}

function DownloadData({ setState }: { setState: (state: CurrentState) => void }) {
    const provider = useProvider();
    const { passport } = usePassport();

    if (!passport) {
        throw new Error('Passport is not defined');
    }

    const { data, error } = useQuery({
        queryKey: ['suap-ongoing-periodos', passport.username, passport.password],
        queryFn: async () => {
            const token = await fetch('/api/suap/ResolveLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: passport.username,
                    password: passport.password
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

            return { periodoLetivos, disciplinas }
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (error) {
        return <Content>
            <SuaveTitle />
            <ErrorDialog error={error.message} />
        </Content>
    }

    return <Content>
        <SuaveTitle />
        <TimedLoading message="Baixando dados do SUAP..." />
    </Content>

}
const gatherGrades = (disciplina: ApiDisciplina) =>
    [disciplina.etapas["1"].nota, disciplina.etapas["2"].nota, disciplina.etapas["3"].nota, disciplina.etapas["4"].nota, disciplina.etapas["final"].nota].filter(n => n !== null)


function Disciplinas({ disciplinas }: { disciplinas: Record<string, ApiDisciplina> }) {
    const [setSort, setSortState] = useState<'cargaHoraria' | 'nota'>('cargaHoraria')
    let entries = Object.entries(disciplinas)


    switch (setSort) {
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
        <div className="flex-row flex items-center gap-2 justify-evenly">
            <h2 className="text-2xl font-bold">Disciplinas</h2>

            <select className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2"
                onChange={e => setSortState(e.target.value as 'nota' | 'cargaHoraria')}>
                <option value="cargaHoraria">Carga horária</option>
                <option value="nota">Nota</option>
            </select>
        </div>

        <div className="flex flex-col">
            {
                entries.map(([nomeDisciplina, disciplina]) => {
                    let progressColor = 'bg-green-500'
                    let percentage = 0

                    switch (setSort) {
                        case 'cargaHoraria':
                            progressColor = disciplina.cargaHorariaCumprida >= disciplina.cargaHoraria ? 'bg-green-800'
                                : disciplina.cargaHorariaCumprida / disciplina.cargaHoraria > 0.8 ? 'bg-blue-900'
                                    : disciplina.cargaHorariaCumprida / disciplina.cargaHoraria > 0.7 ? 'bg-orange-700' : 'bg-red-800';
                            percentage = (100 * (disciplina.cargaHorariaCumprida / disciplina.cargaHoraria));
                            break;
                        case 'nota':
                            const media = gatherGrades(disciplina).reduce((a, b) => a + b, 0) / gatherGrades(disciplina).length
                            progressColor = media >= 8 ? 'bg-green-800'
                                : media >= 6 ? 'bg-blue-900'
                                    : media >= 3 ? 'bg-orange-700' : 'bg-red-800';
                            percentage = media * 10;
                            break;
                    }

                    const nome = nomeDisciplina.split(' - ')[1] ?? nomeDisciplina;

                    return <div key={nomeDisciplina} className="flex relative min-h-full w-full items-center bg-zinc-900 rounded-md z-100">
                        <div className="z-30 relative min-w-full h-full">
                            <div className="relative flex flex-col m-4">
                                <h3 className="text-lg font-bold">{nome}</h3>


                                {setSort == 'cargaHoraria' ? <p className="text-lg">Aulas: {disciplina.cargaHorariaCumprida}/{disciplina.cargaHoraria}</p> : null}

                                <p className="text-lg mt-auto">Média: {(gatherGrades(disciplina).reduce((a, b) => a + b, 0) / gatherGrades(disciplina).length).toFixed(2)}</p>
                            </div>
                        </div>

                        {/* background */}
                        <div className="absolute rounded-lg bg-zinc-800 ml-2 my-2 min-h-[90%] w-[95%] z-10"></div>

                        {/* progress */}
                        <div className={`absolute rounded-lg shadow-xl ${progressColor} ml-2 my-2 min-h-[90%] max-w-[95%] z-20`} style={{
                            width: `${percentage}%`
                        }}></div>

                    </div>
                })
            }
        </div>
    </div>
}

function Card({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
    return <div className={`flex flex-col gap-4 ${className} shadow-inner shadow-neutral-800 p-4 rounded-xl`}>
        <h3 className="text-lg font-bold">{title}</h3>
        {children}
    </div>
}


function InfoCards({ disciplinas }: { disciplinas: Record<string, ApiDisciplina> }) {
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

    const melhorDisciplinaNome = melhorDisciplina[0].split(' - ')[1] ?? melhorDisciplina[0]
    const piorDisciplinaNome = piorDisciplina[0].split(' - ')[1] ?? piorDisciplina[0]

    const disciplinasFreq = Object.entries(disciplinas).sort((a, b) => b[1].frequencia - a[1].frequencia)
    const disciplinaQueMaisFaltou = disciplinasFreq[disciplinasFreq.length - 1]



    return <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Informações Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Sua melhor Disciplina" className="bg-blue-900 min-h-full">
                <h2> {melhorDisciplinaNome}</h2>
                <p className="mt-auto">Média: {sum(gatherGrades(melhorDisciplina[1])) / gatherGrades(melhorDisciplina[1]).length}</p>
            </Card>

            <Card title="Sua pior Disciplina" className="bg-orange-800">
                <h2> {piorDisciplinaNome}</h2>
                <p className="mt-auto">Média: {sum(gatherGrades(piorDisciplina[1])) / gatherGrades(piorDisciplina[1]).length}</p>
            </Card>

            <Card title="Frequência Média" className="bg-emerald-800">
                <p className="mt-auto">Frequência: {allTimeFrequency.toFixed(2)}%</p>
            </Card>

            <Card title="Disciplina que mais faltou" className="bg-red-800">
                <h2> {disciplinaQueMaisFaltou[0].split(' - ')[1] ?? disciplinaQueMaisFaltou[0]}</h2>
                <p className="mt-auto">Frequência: {disciplinaQueMaisFaltou[1].frequencia.toFixed(2)}%</p>
            </Card>
        </div>

    </div >
}

function ShowEmAll({ state }: { state: CurrentState }) {
    const [periodo, setPeriodo] = useState<string>(Object.keys(state.periodos)[0])

    const discPeriodo = state.disciplinas[parseInt(periodo)]
    return <div className="flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-bold">Desempenho Acadêmico</h1>

        <div className="flex flex-row gap-4 items-center">
            <p> Selecione o período letivo: </p>
            <select value={periodo} onChange={e => setPeriodo(e.target.value)} className="rounded-lg p-2 bg-neutral-900 border-neutral-800 border-solid border-2">
                {
                    Object.keys(state.periodos).map(ano => {
                        return <option key={ano} value={ano}>{ano}</option>
                    })
                }
            </select>

        </div>

        <div className="flex flex-col-reverse gap-4 md:flex-row">
            <div className="">
                <Disciplinas disciplinas={discPeriodo} />
            </div>

            <InfoCards disciplinas={discPeriodo} />
        </div>
    </div>
}

export default function DesempenhoAcademico() {
    const { passport } = usePassport();

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

    if (!passport) {
        return <Content>
            <Loading message="Sessão inválida! Redirecionando a página inicial" />
            <meta httpEquiv="refresh" content="0;url=/" />
        </Content>
    }

    if (uiState === 'downloadContent') {
        return <DownloadData setState={setState} />
    }

    return <Content>
        <SuaveTitle />

        <Card title="Bem-vindo! Antes de começar..." className="bg-neutral-900">
            <div className="flex-row flex gap-4">
                <Image className='invert rounded-full' src="/error.svg" alt="Error" width={48} height={48} />

                <p> O Suave tenta ser o mais preciso possível, porém, nesta aba ele assume algumas coisas. Por exemplo, aqui ele faz uma média simples com as notas atuais. Então se o processor ainda não lançou a nota do segundo semestre ele só realizara a media simples com as notas do primeiro semestre. </p>
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
            state ? <ShowEmAll state={state} /> : null
        }
    </Content>
}