"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorDialog from "@/components/ErrorDialog";
import { Course } from "@/lib/moodle/AuthenticatedMobileApi";
import { MoodleBridge } from "@/Bridge/MoodleBridge";
import { chunkedByToArray } from "@/lib/Iterators";
import { useAsyncOnMount } from "@/types/reactExtensions";
import { useMoodleBridge } from "@/lib/auth/client";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import { BlobProvider, pdf } from "@react-pdf/renderer";
import {
  Badge,
  Box,
  Button,
  Card,
  DataList,
  Flex,
  Progress,
  Spinner,
  Text,
  Link as RadixLink,
  HoverCard,
  Select,
  Skeleton,
} from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  AvailableModulesExt,
  ModuleExt,
} from "@/app/(dependsOnAuth)/ead/available/typing";
import PrintSection from "@/app/(dependsOnAuth)/ead/available/print/print-section";
import { useInView } from "react-intersection-observer";
import "./loadingImages.css";

// Create motion versions of Radix UI components
const MotionFlex = motion.create(Flex);
const MotionText = motion.create(Text);

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0"); // %d
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // %m
  const hours = date.getHours().toString().padStart(2, "0"); // %H
  const minutes = date.getMinutes().toString().padStart(2, "0"); // %M

  const dateYear = date.getFullYear();

  if (dateYear !== new Date().getFullYear()) {
    return `${day}/${month}/${dateYear} ás ${hours}:${minutes}`;
  }

  return `${day}/${month} ${hours}:${minutes}`;
}

function AbsoluteTime({ time }: { time: Date }) {
  const [absoluteTime, setAbsoluteTime] = useState("");
  useEffect(() => {
    const formtter = Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

    setAbsoluteTime(formtter.format(time));
  }, [time]);

  return (
    <Text size="3" color="gray">
      {absoluteTime}
    </Text>
  );
}

function RelativeTime({ time }: { time: Date }) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const diffSec = Math.round((time.getTime() - now.getTime()) / 1000);
      // if bigger than 45 days show absolute time
      if (Math.abs(diffSec) > 3888000) {
        setRelativeTime(formatDate(time));
        return;
      }
      setRelativeTime(formatRelativeTime(diffSec));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Text size="3" color="gray">
          {relativeTime}
        </Text>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <Text size="3" color="gray">
          {formatDate(time)}
        </Text>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

function formatRelativeTime(diffSec: number): string {
  const isFuture = diffSec > 0;
  const absDiff = Math.abs(diffSec);

  const days = Math.floor(absDiff / 86400);
  const hours = Math.floor((absDiff % 86400) / 3600);
  const minutes = Math.floor((absDiff % 3600) / 60);
  const seconds = Math.floor(absDiff % 60);

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "dia" : "dias"}`);
  }
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hora" : "horas"}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "minuto" : "minutos"}`);
  }
  // Se não houver dias, horas ou minutos, mostra os segundos.
  if (parts.length === 0) {
    parts.push(`${seconds} ${seconds === 1 ? "segundo" : "segundos"}`);
  }

  if (parts.length === 1) {
    return isFuture ? `Em ${parts[0]}` : `${parts[0]} atrás`;
  } else {
    const last = parts.pop();
    const formatted = parts.join(", ") + " e " + last;
    return isFuture ? `Em ${formatted}` : `${formatted} atrás`;
  }
}

function ModuleCard({ module }: { module: ModuleExt; showOpenDate?: boolean }) {
  const color = module.hasCompleted
    ? "green"
    : module.dueDate && new Date(module.dueDate) > new Date()
    ? "yellow"
    : "red";

  return (
    <Card className="md:basis-0 md:flex-1 min-w-full md:min-w-1/4">
      <Flex direction="column" gap="4">
        <Box>
          <Text as="div" size="4" weight="bold">
            {module.name}
          </Text>
          <Text as="div" size="3" color="gray">
            {module.course}
          </Text>
        </Box>
        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Status</DataList.Label>
            <DataList.Value>
              <Badge color={color}>
                {module.hasCompleted
                  ? "Concluído"
                  : module.dueDate && new Date(module.dueDate) > new Date()
                  ? "Pendente"
                  : "Não feito"}
              </Badge>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item align="center">
            <DataList.Label>Abre</DataList.Label>
            <DataList.Value>
              {module.allowSubmissionsFrom && (
                <AbsoluteTime time={new Date(module.allowSubmissionsFrom!)} />
              )}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="center">
            <DataList.Label>Fecha</DataList.Label>
            <DataList.Value>
              {module.dueDate && (
                <RelativeTime time={new Date(module.dueDate!)} />
              )}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <RadixLink href={module.url} target="_blank">
          Acessar
        </RadixLink>
      </Flex>
    </Card>
  );
}

function LazyModuleCard({
  module,
  showOpenDate,
}: {
  module: ModuleExt;
  showOpenDate?: boolean;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full md:w-auto"
    >
      <ModuleCard module={module} showOpenDate={showOpenDate} />
    </motion.div>
  );
}

function generatePrettyMessage(course: string, modules: ModuleExt[]) {
  const emojis = {
    assign: "📝",
    forum: "💬",
    quiz: "🧠",
    url: "🔗",
    page: "📄",
    book: "📚",
    folder: "📁",
    resource: "📦",
    label: "🏷️",
    lesson: "📖",
    choice: "🤔",
    feedback: "📣",
    workshop: "🔨",
    glossary: "📖",
    wiki: "📖",
    survey: "📊",
    data: "📊",
    attendance: "📋",
    scorm: "📦",
    h5pactivity: "🎮",
  };

  let moodleContent = `📚 ${course}\n`;

  for (const moodleModule of modules) {
    let de = "";
    const from = new Date(moodleModule.allowSubmissionsFrom!);
    // verify if its is bigger than epoch
    if (from > new Date(0)) {
      de = `De: ${formatDate(from)}, `;
    }

    moodleContent += ` ➤ ${emojis[moodleModule.kind as keyof typeof emojis]} ${
      moodleModule.name
    } (${de}até ${formatDate(new Date(moodleModule.dueDate!))})\n`;
    moodleContent += `Acesse em ${moodleModule.url}\n`;
  }

  return moodleContent;
}

function generateFullMessage(title: string, all: Record<string, ModuleExt[]>) {
  const messages = Object.entries(all)
    .map(([, modules]) => {
      if (modules.length === 0) return "";
      return generatePrettyMessage(modules[0].course, modules);
    })
    .filter((x) => x.trim().length > 0);

  let total = 0;
  for (const modules of Object.values(all)) {
    total += modules.length;
  }

  const verbTem = total > 1 ? "temos" : "tem";
  const verbDisponiveis =
    total > 1 ? "atividades disponíveis" : "atividade disponível";

  let output = `📅✨ ${title} 🚀\n`;
  output += `🎉 Eae, galera, suave na nave? ${verbTem} ${total} ${verbDisponiveis}! 🚀\n\n`;
  output += messages.join("\n\n");
  output += "\n😃 Criado usando o Suave (https://suave-one.vercel.app/).";

  return output;
}

/// solta o som marcelo
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );
}

function TimeCategory({
  name,
  modules,
  showOpenDate,
}: {
  name: string;
  modules: Record<number, ModuleExt[]>;
  showOpenDate?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const avaliableModules = Object.entries(modules).filter(
    ([, modules]) => modules.length > 0
  );

  if (avaliableModules.length === 0) return;

  const shareWhatsapp = () => {
    const message = generateFullMessage(name, modules);

    if (message.trim().length === 0) {
      return;
    }

    // detect if android or ios, if so, use the whatsapp:// protocol

    if (isMobileDevice()) {
      window.location.href = `whatsapp://send?text=${encodeURIComponent(
        message
      )}`;
      return;
    }

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  function showPrint(url: string) {
    const win = window.open(url, "_blank");
    if (win) {
      win.focus();

      // if not mobile, print
      if (!isMobileDevice()) {
        win.print();
      }
    } else {
      alert(
        "Ei! Parece que você tem um bloqueador de pop-ups ativo. Desative-o para imprimir."
      );
    }
  }

  return (
    <Flex gap="4" direction="column" align="stretch" className="w-full">
      <Flex gap="2" align="center" justify="between">
        <Text className={`shadow-xs`} size="6">
          {name}
        </Text>

        <Flex gap="2" align="center">
          <Button onClick={shareWhatsapp} color="mint">
            <Image src="/zap.svg" alt="Zap Icon" width={20} height={20} />
            <span className="hidden md:block">Compartilhar</span>
          </Button>

          <BlobProvider document={<PrintSection modules={modules} />}>
            {({ url, loading }) => {
              return (
                <Button
                  color="sky"
                  onClick={() => url && showPrint(url)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner loading={loading} size="2" />
                      <span className="hidden md:block">
                        Carregando impressão...
                      </span>
                    </>
                  ) : (
                    <>
                      <Printer />
                      <span className="hidden md:block">Imprimir</span>
                    </>
                  )}
                </Button>
              );
            }}
          </BlobProvider>
        </Flex>
      </Flex>

      <Flex className="w-full" justify="center" gap="4" wrap="wrap">
        {avaliableModules
          .sort((a, b) => {
            // sort by title length
            const aLength = a[1][0].name.length;
            const bLength = b[1][0].name.length;

            return aLength - bLength;
          })
          .map(([, modules]) =>
            modules.map((module) => {
              return (
                <LazyModuleCard
                  module={module}
                  key={module.url}
                  showOpenDate={showOpenDate}
                />
              );
            })
          )}
      </Flex>

      {/* <div id={`print-${name}`} ref={contentRef}> */}
      {/* <PrintSection modules={modules} ref={contentRef} /> */}
      {/* </div> */}
    </Flex>
  );
}

function Stats({ available }: { available: AvailableModulesExt }) {
  let didMoodles = 0;
  let total = 0;

  for (const [, cats] of Object.entries(available.modules)) {
    for (const [, mods] of Object.entries(cats)) {
      for (const mod of mods) {
        if (mod.hasCompleted) {
          didMoodles++;
        }

        total++;
      }
    }
  }

  const percentage = ((didMoodles / total) * 100).toFixed(2);

  return (
    <Flex justify="center" align="center" direction="column" gap="4">
      <Text size="6" align="center">
        E ai? Estes são os moodles do momento.{" "}
      </Text>

      <Text align="center">
        Você fez {didMoodles} de {total} atividades, ou seja,{" "}
        <span className="bg-blue-400 rounded-md p-1">{percentage}%!</span>{" "}
      </Text>
    </Flex>
  );
}

interface FilterState {
  course: string | "all";
  status: string | "all";
}

function Dash({
  available,
  isReady,
  canShowModules,
}: {
  available: AvailableModulesExt;
  isReady: boolean;
  canShowModules?: boolean;
}) {
  // Add state for filters
  const [filters, setFilters] = useState<FilterState>({
    course: "all",
    status: "all",
  });

  // Get unique course names for filter options
  const getUniqueCourses = () => {
    const courses = new Set<string>();
    Object.values(available.modules).forEach((category) => {
      Object.values(category).forEach((modules) => {
        modules.forEach((module) => courses.add(module.course));
      });
    });
    return Array.from(courses);
  };

  // Filter modules based on current filter state
  const filterModules = (modules: Record<number, ModuleExt[]>) => {
    const filtered: Record<number, ModuleExt[]> = {};

    Object.entries(modules).forEach(([courseId, moduleList]) => {
      const filteredModules = moduleList.filter((module) => {
        // Course filter
        const courseMatch =
          filters.course === "all" || module.course === filters.course;

        // Status filter
        let statusMatch = true;
        if (filters.status !== "all") {
          const now = new Date();
          const dueDate = module.dueDate ? new Date(module.dueDate) : null;
          const daysToDue = dueDate
            ? Math.ceil(
                (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              )
            : null;

          switch (filters.status) {
            case "Concluído":
              statusMatch = module.hasCompleted;
              break;
            case "Pendente":
              statusMatch =
                (!module.hasCompleted && dueDate && dueDate > now) ?? false;
              break;
            case "Não feito":
              statusMatch =
                (!module.hasCompleted && dueDate && dueDate < now) ?? false;
              break;
            case "Perto de fechar":
              statusMatch =
                !module.hasCompleted &&
                daysToDue !== null &&
                daysToDue <= 3 &&
                daysToDue >= 0;
              break;
          }
        }

        return courseMatch && statusMatch;
      });

      if (filteredModules.length > 0) {
        filtered[courseId as unknown as number] = filteredModules;
      }
    });

    return filtered;
  };

  // Filter all time categories
  const filteredModules = {
    current: filterModules(available.modules.current),
    future: filterModules(available.modules.future),
    past: filterModules(available.modules.past),
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {isReady && <Stats available={available} />}

      {canShowModules && (
        <>
          {/* Filter Controls */}
          <Flex
            direction={{ initial: "column", md: "row" }}
            gap="4"
            className="w-full max-w-md md:max-w-3xl mx-auto"
            justify={{ initial: "center", md: "between" }}
            align="center"
          >
            <Flex gap="4" align="center">
              <Text size="3" weight="bold">
                Filtrar por disciplina:
              </Text>

              <Select.Root
                defaultValue="all"
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, course: value }));
                }}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">
                    <Text size="3">Todas as disciplinas</Text>
                  </Select.Item>
                  <Select.Separator />

                  {getUniqueCourses().map((course) => (
                    <Select.Item key={course} value={course}>
                      {course}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex gap="4" align="center">
              <Text size="3" weight="bold">
                Filtrar por status:
              </Text>

              <Select.Root
                defaultValue="all"
                onValueChange={(value) => {
                  setFilters((prev) => ({ ...prev, status: value }));
                }}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">
                    <Text size="3">Todos os status</Text>
                  </Select.Item>
                  <Select.Separator />

                  <Select.Item value="Concluído">Concluído</Select.Item>
                  <Select.Item value="Pendente">Pendente</Select.Item>
                  <Select.Item value="Não feito">Não feito</Select.Item>
                  {/* <Select.Item value="Perto de fechar">
                Perto de fechar (≤ 3 dias)
              </Select.Item> */}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
          <TimeCategory
            name="Moodles Abertos"
            modules={filteredModules.current}
          />
          <TimeCategory
            name="Moodles Futuros"
            modules={filteredModules.future}
            showOpenDate
          />
          <TimeCategory
            name="Moodles Passados"
            modules={filteredModules.past}
          />
        </>
      )}
    </div>
  );
}

function simplifyFullName(fullName: string) {
  let name = fullName.replace(/^\d+ - /, "");
  name = name.split(" - ")[0];
  name = name.replace(/^SUAP\d+ - /, "");
  return name.trim();
}

function LoadingImages() {
  const images = Array.from(
    { length: 8 },
    (_, i) => `/loading-image${i + 1}.png`
  );
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 1000); // Change image every second
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Flex justify="center" align="center">
      <img
        key={currentImage}
        src={images[currentImage]}
        loading="eager"
        decoding="sync"
        alt={`Loading image ${currentImage + 1}`}
        width={100}
        height={100}
        className="loading-animation w-32 h-32"
      />
    </Flex>
  );
}

function LoadCourses({
  courses,
  bridge,
}: {
  courses: Course[];
  bridge: MoodleBridge;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("Peraí, tá carregando...");
  const [available, setAvailable] = useState<{
    modules: Record<string, Record<number, ModuleExt[]>>;
  }>({
    modules: {
      current: {},
      future: {},
      past: {},
    },
  });

  const courseNames = Object.fromEntries(
    courses.map((x) => [x.id, simplifyFullName(x.fullname) ?? x.fullname])
  );

  const [totalCourses, setTotalCourses] = useState<number>(courses.length);
  const [loadedCourses, setLoadedCourses] = useState<number>(0);
  const canShowModulesRef = useRef(false); // Ref to track when 75% is loaded

  async function fetchCourses(courses: Course[]) {
    const name = courses.map((x) => simplifyFullName(x.fullname)).join(", ");

    console.time(`fetchCourses(${name})`);

    /**
     * Cara, isso é bizzarro.
     * Talvez eu deveria otimizar isso e fazer de um jeito menos hacky.
     * Mas serve para hoje.
     */
    const { modules: rawModules } = await bridge.GetAvailableModules(courses);
    const modules = rawModules as unknown as Record<
      string,
      Record<number, ModuleExt[]>
    >;

    for (const coursesLoaded of Object.values(modules)) {
      for (const [courseId, mods] of Object.entries(coursesLoaded)) {
        for (const mod of mods) {
          mod.course = courseNames[courseId] ?? "Desconhecido";
        }
      }
    }

    // merge available modules
    setAvailable((oldAvailable) => {
      const available = { ...oldAvailable };
      for (const [key, value] of Object.entries(modules)) {
        available.modules[key] = {
          ...available.modules[key],
          ...value,
        };
      }

      return available;
    });

    setText(`${name}`);

    setLoadedCourses((old) => {
      const newLoaded = old + courses.length;
      if ((newLoaded / totalCourses) * 100 >= 100) {
        canShowModulesRef.current = true;
      }
      return newLoaded;
    });

    console.timeEnd(`fetchCourses(${name})`);
  }

  async function queryMoodleDoneStatus() {
    console.time("queryMoodleDoneStatus()");
    const query = courses.map((course) => {
      return {
        courseId: course.id,
        modules: [
          ...Object.values(available.modules.current[course.id] ?? []),
          ...Object.values(available.modules.future[course.id] ?? []),
          ...Object.values(available.modules.past[course.id] ?? []),
        ],
      };
    });

    const statusBuffer = new Map<number, boolean>();

    for (const chunkedQuery of chunkedByToArray(query, 5)) {
      const batchStatus = await bridge.GetCourseCompletionStatus(chunkedQuery);

      for (const { activityId, hasCompleted } of batchStatus) {
        statusBuffer.set(activityId, hasCompleted);
      }
    }

    setAvailable((oldModules) => {
      const available = { ...oldModules };
      for (const timedModules of Object.values(available.modules)) {
        for (const mods of Object.values(timedModules)) {
          for (const mod of mods) {
            const completed = statusBuffer.get(mod.id);
            if (completed !== undefined) {
              mod.hasCompleted = completed;
            }
          }
        }
      }
      return available;
    });

    console.timeEnd("queryMoodleDoneStatus()");
  }

  useAsyncOnMount(async () => {
    const tasks = chunkedByToArray(courses, 4).map(fetchCourses);
    setTotalCourses(courses.length);

    /**
     * Uma coisa que nunca vou entender
     * É de porque ser mais rápido buscar curso por curso em várias requisições
     * Do que buscar tudo de uma vez HAHA?
     * Foda.
     * ~Moizes
     */
    for (const task of tasks) {
      await task;
    }

    await Promise.allSettled(tasks);

    setText("Analisando o progresso dos cursos...");
    setIsLoading(false);
    queryMoodleDoneStatus();
  });

  // after loading, reset the scroll

  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <MotionFlex
          direction="column"
          gap="4"
          align="center"
          justify="center" // Center vertically
          className="mt-[100%]" // Full height for vertical centering
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          key="loading-courses"
        >
          <LoadingImages />

          <Box width="300px">
            <Progress
              variant="soft"
              size="3"
              value={(loadedCourses / totalCourses) * 100}
              key="progress"
              duration="10s"
            />
          </Box>

          <AnimatePresence mode="wait">
            <MotionText
              size="4"
              className="text-center"
              key={text} // Add key to trigger animations on text change
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                {text}
              </motion.span>
            </MotionText>
          </AnimatePresence>
        </MotionFlex>
      )}

      {available && (
        <Dash
          available={available as unknown as AvailableModulesExt}
          isReady={!isLoading}
          canShowModules={canShowModulesRef.current}
        />
      )}
    </>
  );
}

export default function AvailableEad() {
  const bridge = useMoodleBridge();

  const { isLoading, error, data } = useQuery({
    queryKey: ["courses"],
    queryFn: () => bridge.GetEnrolledCourses(),
  });

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <MotionFlex
            direction="column"
            gap="4"
            align="center"
            justify="center" // Center vertically
            className="flex-1 mt-[100%]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            key="loading-enrolled-courses"
          >
            <Spinner size="3" />
            <MotionText
              size="4"
              className="text-center"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              Carregando cursos disponíveis...
            </MotionText>
          </MotionFlex>
        )}
        {error && <ErrorDialog error={error.message} />}
        {data && <LoadCourses courses={data.courses} bridge={bridge} />}
      </AnimatePresence>
    </>
  );
}
