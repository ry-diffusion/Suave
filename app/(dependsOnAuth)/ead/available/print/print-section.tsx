import { ModuleExt } from "@/app/(dependsOnAuth)/ead/available/typing";
import css from "./styles.module.css";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { Flex, Text } from "@radix-ui/themes";
import { forwardRef } from "react";

function formatDate(date: Date): string {
  const dtf = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });

  return dtf.format(date);
}

function ModuleCard({ module }: { module: ModuleExt }) {
  return (
    <div
      className="grid grid-cols-[1fr_auto] gap-2 items-start max-w-[150mm] max-h-[150mm]"
      style={{
        border: "1px solid black",
        marginBottom: "0.5cm",
        padding: "0.2cm",
        boxSizing: "border-box",
        breakInside: "avoid", // Avoid breaking cards in the middle
      }}
    >
      <Flex gap="2" direction="column">
        <Text size="7" weight="bold" wrap={"wrap"}>
          {module.name}
        </Text>

        <Text size="5" wrap={"wrap"}>
          {module.course}
        </Text>

        <Text size="4" wrap={"wrap"}>
          Fecha:{" "}
          {module.dueDate
            ? formatDate(new Date(module.dueDate))
            : "Não especificado"}
        </Text>
      </Flex>

      <QRCode value={module.url} size={92} level="L" />
    </div>
  );
}

export default forwardRef<
  HTMLDivElement,
  {
    modules: Record<number, ModuleExt[]>;
  }
>(function PrintSection({ modules }, ref) {
  const moduleList = Object.values(modules)
    .flat()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div
        className={cn(
          css.printSection,
          "flex flex-col justify-start items-stretch gap-2"
        )}
        style={{
          width: "297mm",
          minWidth: "297mm",
          height: "210mm",
          minHeight: "210mm",
          boxSizing: "border-box",
          padding: "1cm",
        }}
        ref={ref}
      >
        <Flex className="mb-auto" gap="2" direction="column">
          <Text size="9" className="font-bold border-b-2 border-b-black">
            Tarefas do Moodle disponíveis
          </Text>
        </Flex>

        <div className="grid grid-cols-2 grid-rows-subgrid gap-2 m-auto">
          {moduleList.map((module) => (
            <ModuleCard key={module.url} module={module} />
          ))}
        </div>

        <Flex
          gap="2"
          direction="row"
          justify="between"
          className="border-t border-black py-auto self-end w-full"
          style={{ marginTop: "1cm" }}
        >
          <Flex gap="2" direction="column" className="p-2">
            <Text size="6">Gerado pelo Suave em {formatDate(new Date())}</Text>
            <Text size="4">Uma ferramenta por Moizes de Jesus Sousa</Text>
            <Text size="4">Acesse lendo o QRCode ao lado.</Text>
          </Flex>

          <QRCode
            value="https://suave-one.vercel.app"
            size={92}
            level="H"
            className="m-2"
          />
        </Flex>
      </div>
      <style type="text/css" media="print">
        {`
          @page { size: A4 landscape; margin: 0; }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

        `}
      </style>
    </>
  );
});
