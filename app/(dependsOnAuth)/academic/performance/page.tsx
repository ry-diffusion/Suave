"use client";

import { useQuery } from "@tanstack/react-query";
import Content from "@/components/Content";
import ErrorDialog from "@/components/ErrorDialog";
import { useEffect, useState } from "react";
import { LetivosOut } from "@/app/(api)/api/suap/Periodos/route";
import { ApiDisciplina } from "@/app/(api)/api/suap/Boletim/[ano]/[periodo]/route";
import { useAuth } from "@/lib/auth/context";
import { useProvider } from "@/lib/auth/client";
import {
  Button,
  Callout,
  DataList,
  Flex,
  Progress,
  Select,
  Spinner,
  Text,
  Card,
} from "@radix-ui/themes";
import { CheckCheckIcon } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface CurrentState {
  // Ano -> Periodo -> Disciplinas
  disciplinas: Record<number, Record<string, ApiDisciplina>>;
  periodos: LetivosOut;
}

function formatNumber(number: number, fallback?: string) {
  if (!number || isNaN(number)) {
    return fallback ?? "N/A";
  }
  return number.toFixed(2);
}

function DownloadData({
  setState,
  setUiState,
}: {
  setState: (state: CurrentState) => void;
  setUiState: (state: "downloadContent" | "readyToShow") => void;
}) {
  const provider = useProvider();
  const { passport } = useAuth();

  const { data, error } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const token = await fetch("/api/suap/ResolveLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: passport!.username,
          password: passport!.password,
        }),
      })
        .then((r) => r.json())
        .then((r) => r.access);

      console.log(`[SUAP] Token: ${token}`);

      const bridge = provider.suap!.makeBridge(token);

      const periodoLetivos = await bridge.GetPeriodoLetivos();

      console.log(`[SUAP] Periodos: ${Object.keys(periodoLetivos).join(", ")}`);

      const disciplinas: Record<number, Record<string, ApiDisciplina>> = {};

      for (const ano in periodoLetivos) {
        const boletimDisciplinas = await bridge.GetBoletim(ano, "1");
        console.log(
          `[SUAP] Disciplinas: ${Object.keys(boletimDisciplinas).join(", ")}`
        );
        disciplinas[parseInt(ano)] = boletimDisciplinas;
      }

      return { periodoLetivos, disciplinas };
    },
  });

  useEffect(() => {
    if (data) {
      const L = window.localStorage;
      L.setItem("OnGoingCache.Disciplinas", JSON.stringify(data.disciplinas));
      L.setItem(
        "OnGoingCache.PeriodoLetivo",
        JSON.stringify(data.periodoLetivos)
      );
      setState({
        disciplinas: data.disciplinas,
        periodos: data.periodoLetivos,
      });
      setUiState("readyToShow");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    return (
      <Content>
        <ErrorDialog error={error.message} />
      </Content>
    );
  }

  return (
    <Flex direction={"column"} align="center" gap="4">
      <Spinner size="3" />
      <Text size="3" className="text-neutral-400">
        Baixando dados do SUAP...
      </Text>
      <p className="text-sm text-neutral-400">
        Isso pode demorar um pouco, dependendo da sua conexão.
      </p>
    </Flex>
  );
}

const gatherGrades = (disciplina: ApiDisciplina) =>
  [
    disciplina.etapas["1"].nota,
    disciplina.etapas["2"].nota,
    disciplina.etapas["3"].nota,
    disciplina.etapas["4"].nota,
    disciplina.etapas["final"].nota,
  ].filter((n) => n !== null);

function Disciplinas({
  disciplinas,
}: {
  disciplinas: Record<string, ApiDisciplina>;
}) {
  const [method, setSortState] = useState<"cargaHoraria" | "nota">(
    "cargaHoraria"
  );
  let entries = Object.entries(disciplinas);

  switch (method) {
    case "cargaHoraria":
      entries = entries.sort(
        (a, b) =>
          100 * (b[1].cargaHorariaCumprida / b[1].cargaHoraria) -
          100 * (a[1].cargaHorariaCumprida / a[1].cargaHoraria)
      );
      break;
    case "nota":
      entries = entries.sort((a, b) => {
        const sumGradesB = [
          b[1].etapas["1"].nota,
          b[1].etapas["2"].nota,
          b[1].etapas["3"].nota,
          b[1].etapas["4"].nota,
          b[1].etapas["final"].nota,
        ].filter((n) => n !== null);
        const sumGradesA = [
          a[1].etapas["1"].nota,
          a[1].etapas["2"].nota,
          a[1].etapas["3"].nota,
          a[1].etapas["4"].nota,
          a[1].etapas["final"].nota,
        ].filter((n) => n !== null);

        const mediaB =
          sumGradesB.reduce((a, b) => a + b, 0) / sumGradesB.length;
        const mediaA =
          sumGradesA.reduce((a, b) => a + b, 0) / sumGradesA.length;

        return mediaB - mediaA;
      });
      break;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-row flex items-center gap-4 justify-evenly">
        <h2 className="text-2xl font-bold">Disciplinas</h2>

        <Select.Root
          defaultValue="cargaHoraria"
          onValueChange={(value) =>
            setSortState(value as "cargaHoraria" | "nota")
          }
        >
          <Select.Trigger />

          <Select.Content>
            <Select.Item value="cargaHoraria">Carga Horária</Select.Item>

            <Select.Item value="nota">Nota</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <div className="flex flex-col gap-4">
        {entries.map(([nomeDisciplina, disciplina]) => (
          <Disciplina
            key={nomeDisciplina}
            method={method}
            disciplina={disciplina}
            nomeDisciplina={nomeDisciplina}
          />
        ))}
      </div>
    </div>
  );
}

function sanitizeDisciplinaName(nomeDisciplina: string): string {
  // get only the name (ONLY CHARACTERS!) May include unicode characters (like accents) and spaces

  let name = nomeDisciplina.split(" - ")[1] ?? nomeDisciplina;
  if (nomeDisciplina.startsWith("Atividade")) {
    name = nomeDisciplina.split(" - ")[2] ?? nomeDisciplina;
  }

  return name.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}

function Disciplina({
  disciplina,
  nomeDisciplina,
  method,
}: {
  disciplina: ApiDisciplina;
  nomeDisciplina: string;
  method: "cargaHoraria" | "nota";
}) {
  let progressColor = "green";
  let percentage = 0;

  switch (method) {
    case "cargaHoraria":
      progressColor =
        disciplina.cargaHorariaCumprida >= disciplina.cargaHoraria
          ? "green"
          : disciplina.cargaHorariaCumprida / disciplina.cargaHoraria > 0.8
          ? "blue"
          : disciplina.cargaHorariaCumprida / disciplina.cargaHoraria > 0.7
          ? "orange"
          : "red";
      percentage =
        100 * (disciplina.cargaHorariaCumprida / disciplina.cargaHoraria);
      break;
    case "nota":
      const media =
        gatherGrades(disciplina).reduce((a, b) => a + b, 0) /
        gatherGrades(disciplina).length;
      progressColor =
        media >= 8
          ? "green"
          : media >= 6
          ? "blue"
          : media >= 3
          ? "orange"
          : "red";
      percentage = media * 10;
      break;
  }

  const nome = sanitizeDisciplinaName(nomeDisciplina);

  return (
    <Card className="w-full bg-zinc-900">
      <Flex direction="column" gap="3">
        <Progress
          value={isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage))}
          className="w-full h-2"
          size={"3"}
          color={progressColor as "blue" | "green" | "red" | "orange"}
        />
        <Text size="4" weight="bold">
          {nome}
        </Text>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Frequência</DataList.Label>
            <DataList.Value>
              {formatNumber(disciplina.frequencia)}%
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Média</DataList.Label>
            <DataList.Value>
              {formatNumber(
                gatherGrades(disciplina).reduce((a, b) => a + b, 0) /
                  gatherGrades(disciplina).length
              )}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Aulas</DataList.Label>
            <DataList.Value>
              {disciplina.cargaHorariaCumprida}/{disciplina.cargaHoraria}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Flex>
    </Card>
  );
}

function InfoCards({
  disciplinas,
}: {
  disciplinas: Record<string, ApiDisciplina>;
}) {
  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const allTimeFrequency =
    Object.values(disciplinas).reduce((a, b) => a + b.frequencia, 0) /
    Object.values(disciplinas).length;

  const gradesData = Object.entries(disciplinas).map(([nome, disciplina]) => {
    const obj = {
      name: sanitizeDisciplinaName(nome),
      media:
        gatherGrades(disciplina).reduce((a, b) => a + b, 0) /
        gatherGrades(disciplina).length,
    };

    if (isNaN(obj.media)) {
      obj.media = 0;
    }

    return obj;
  });

  const frequencyData = Object.entries(disciplinas).map(
    ([nome, disciplina]) => ({
      name: sanitizeDisciplinaName(nome),
      frequencia: disciplina.frequencia,
    })
  );

  const sortNota = Object.entries(disciplinas).sort((a, b) => {
    const sumGradesB = sum(gatherGrades(b[1]));
    const sumGradesA = sum(gatherGrades(a[1]));

    const mediaB = sumGradesB / gatherGrades(b[1]).length;
    const mediaA = sumGradesA / gatherGrades(a[1]).length;

    return mediaB - mediaA;
  });

  const [melhorDisciplina, piorDisciplina] = [
    sortNota[0],
    sortNota[sortNota.length - 1],
  ];

  const melhorDisciplinaNome = sanitizeDisciplinaName(melhorDisciplina[0]);
  const piorDisciplinaNome = sanitizeDisciplinaName(piorDisciplina[0]);

  const disciplinasFreq = Object.entries(disciplinas).sort(
    (a, b) => b[1].frequencia - a[1].frequencia
  );
  const disciplinaQueMaisFaltou = disciplinasFreq[disciplinasFreq.length - 1];

  const geraTextoFrequencia = (frequencia: number) => {
    if (frequencia > 98) return "Você é onipresente! Como faz isso? 😱";
    if (frequencia > 90) return "Incrível! Você está sempre presente! 🌟";
    if (frequencia > 80) return "Ótimo trabalho! Continue assim! 👍";
    if (frequencia > 75) return "Bem no limite! 😐";
    if (frequencia > 60) return "Você um turista? 🤔";
    if (frequencia > 50) return "Eai, turista, por onde andou? 😅";
    return "Você não é um turista mano.. É um fantasma 😱";
  };

  return (
    <div className="flex flex-col gap-4 md:max-w-[70%]">
      <h2 className="text-2xl font-bold">Informações Gerais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <Card variant="classic" className="bg-blue-800 min-h-full p-4">
          <Flex direction="column" gap="3">
            <Text size="5" weight="bold" className="mb-2">
              😃 Sua melhor Disciplina
            </Text>
            <Text>
              Wow, você parece ser bom em{" "}
              <span className="font-extrabold">{melhorDisciplinaNome}</span>!
              Parabéns 😉
            </Text>
            <Text className="mt-auto">
              Média:{" "}
              {formatNumber(
                sum(gatherGrades(melhorDisciplina[1])) /
                  gatherGrades(melhorDisciplina[1]).length
              )}
            </Text>
          </Flex>
        </Card>

        <Card variant="classic" className="bg-orange-800 p-4">
          <Flex direction="column" gap="3">
            <Text size="5" weight="bold" className="mb-2">
              😔 Sua pior Disciplina
            </Text>

            <Text>
              Ops, parece que você não foi muito bem em{" "}
              <span className="font-extrabold">{piorDisciplinaNome}</span>...
            </Text>
            <Text className="mt-auto">
              Média:{" "}
              {formatNumber(
                sum(gatherGrades(piorDisciplina[1])) /
                  gatherGrades(piorDisciplina[1]).length
              )}
            </Text>
          </Flex>
        </Card>

        <Card variant="classic" className="bg-emerald-800 p-4">
          <Flex direction="column" gap="3">
            <Text size="5" weight="bold" className="mb-2">
              ⏰ Frequência Média
            </Text>
            <Text>{geraTextoFrequencia(allTimeFrequency)}</Text>
            <Text className="mt-auto">
              Frequência: {formatNumber(allTimeFrequency)}%
            </Text>
          </Flex>
        </Card>

        <Card variant="classic" className="bg-red-800 p-4">
          <Flex direction="column" gap="3">
            <Text size="5" weight="bold" className="mb-2">
              😅 Disciplina que mais faltou
            </Text>
            {disciplinaQueMaisFaltou[1].frequencia > 75 ? (
              <Text>
                As vezes deu preguiça de ir na aula de{" "}
                <span className="font-extrabold">
                  {sanitizeDisciplinaName(disciplinaQueMaisFaltou[0])}
                </span>
                , né?
              </Text>
            ) : disciplinaQueMaisFaltou[1].frequencia > 60 ? (
              <Text>
                Pelo menos, você foi em alguma aula de{" "}
                <span className="font-extrabold">
                  {sanitizeDisciplinaName(disciplinaQueMaisFaltou[0])}
                </span>
                ...
              </Text>
            ) : (
              <Text>
                Você odeia{" "}
                <span className="font-extrabold">
                  {sanitizeDisciplinaName(disciplinaQueMaisFaltou[0])}
                </span>
                ?
              </Text>
            )}
            <Text className="mt-auto">
              Frequência da disciplina:{" "}
              {formatNumber(disciplinaQueMaisFaltou[1].frequencia)}%
            </Text>
          </Flex>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card variant="classic" className="p-4">
          <Text size="5" weight="bold" className="mb-2">
            📈 Notas por Disciplina
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  borderColor: "#444",
                  color: "#fff",
                }}
              />
              <Bar dataKey="media" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card variant="classic" className="p-4">
          <Text size="5" weight="bold" className="mb-2">
            📊 Frequência por Disciplina
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  borderColor: "#444",
                  color: "#fff",
                }}
              />
              <Bar dataKey="frequencia" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function ShowEmAll({
  state,
  setUiState,
  setState,
}: {
  state: CurrentState;
  setUiState: (state: "downloadContent" | "readyToShow") => void;
  setState: (state: CurrentState | null) => void;
}) {
  const [periodo, setPeriodo] = useState<string>(
    Object.keys(state.periodos)[0]
  );

  const discPeriodo = state.disciplinas[parseInt(periodo)];
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-4">
        <h1 className="text-3xl font-bold">Desempenho Acadêmico</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <p>Selecione o período letivo:</p>
            <Select.Root
              defaultValue={periodo}
              onValueChange={(value) => setPeriodo(value)}
            >
              <Select.Trigger />
              <Select.Content>
                {Object.keys(state.periodos).map((ano) => (
                  <Select.Item key={ano} value={ano}>
                    {ano}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <Button
            onClick={() => {
              const L = window.localStorage;
              L.removeItem("OnGoingCache.Disciplinas");
              L.removeItem("OnGoingCache.PeriodoLetivo");

              setUiState("downloadContent");
              setState(null);
            }}
          >
            Recarregar dados
          </Button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <div>
          <Disciplinas disciplinas={discPeriodo} />
        </div>

        <InfoCards disciplinas={discPeriodo} />
      </div>
    </div>
  );
}

export default function AcademicPerformance() {
  const [state, setState] = useState<CurrentState | null>(null);
  const [uiState, setUiState] = useState("welcome");

  useEffect(() => {
    if (!state) {
      const L = window.localStorage;
      if (
        !L.getItem("OnGoingCache.Disciplinas") ||
        !L.getItem("OnGoingCache.PeriodoLetivo")
      ) {
        setUiState("downloadContent");
        return;
      }

      const disciplinas = JSON.parse(L.getItem("OnGoingCache.Disciplinas")!);
      const periodos = JSON.parse(L.getItem("OnGoingCache.PeriodoLetivo")!);
      setState({
        periodos,
        disciplinas,
      });
      setUiState("readyToShow");
      return;
    }
  }, [state]);

  if (uiState === "downloadContent") {
    return <DownloadData setState={setState} setUiState={setUiState} />;
  }

  return (
    <>
      <Callout.Root>
        <Callout.Icon>
          <CheckCheckIcon />
        </Callout.Icon>
        <Callout.Text>
          Bem vindo.. Antes de começar... O Suave tenta ser o mais preciso
          possível, porém, nesta aba ele assume algumas coisas. Por exemplo,
          aqui ele faz uma média simples com as notas atuais. Então se o
          professor ainda não lançou a nota do segundo semestre ele só realizara
          a media simples com as notas do primeiro semestre.
        </Callout.Text>
      </Callout.Root>

      {state && (
        <ShowEmAll state={state} setState={setState} setUiState={setUiState} />
      )}
    </>
  );
}
