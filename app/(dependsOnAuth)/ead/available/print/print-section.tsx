import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { ModuleExt } from "@/app/(dependsOnAuth)/ead/available/typing";

// Define styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    flexDirection: "column",
    padding: 20,
    width: "210mm", // Updated for A4 Landscape
    height: "297mm", // Updated for A4 Landscape
  },
  header: {
    borderBottom: "2px solid black",
    marginBottom: 10,
    paddingBottom: 5,
  },
  moduleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px solid black",
    marginBottom: 10,
    padding: 5,
    maxWidth: "150mm",
    maxHeight: "150mm",
    flexGrow: 1,
    flexShrink: 0,
    minWidth: "30%",
  },
  footer: {
    borderTop: "1px solid black",
    marginTop: "auto",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrCode: {
    width: 92,
    height: 92,
  },
});
// Helper to generate QR code as a data URL
async function generateQRCode(value: string): Promise<string> {
  return await QRCode.toDataURL(value);
}

function ModuleCard({ module }: { module: ModuleExt }) {
  const qrCodeDataUrl = generateQRCode(module.url);

  return (
    <View style={styles.moduleCard}>
      <View style={{ flex: 2, padding: 5 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            flex: 1,
            textAlign: "justify",
          }}
        >
          {module.name}
        </Text>
        <Text style={{ fontSize: 12 }} wrap>
          {module.course}
        </Text>
        <Text style={{ fontSize: 10 }}>
          Fecha:{" "}
          {module.dueDate
            ? formatDate(new Date(module.dueDate))
            : "Não especificado"}
        </Text>
      </View>

      <Image
        src={qrCodeDataUrl}
        style={{ ...styles.qrCode, flex: 1, maxWidth: "20%", height: "auto" }}
      />
    </View>
  );
}

export default function PrintSection({
  modules,
}: {
  modules: Record<number, ModuleExt[]>;
}) {
  const moduleList = Object.values(modules)
    .flat()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Tarefas do Moodle disponíveis
          </Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {moduleList.map((module) => (
            <ModuleCard key={module.url} module={module} />
          ))}
        </View>

        <View style={styles.footer}>
          <View style={{ flex: 1, padding: 5, gap: 4 }}>
            <Text style={{ fontSize: 12 }}>
              Gerado pelo Suave em{"  "}
              {formatDate(new Date())}
            </Text>
            <Text style={{ fontSize: 10 }}>
              Uma ferramenta por Moizes de Jesus Sousa
            </Text>
            <Text style={{ fontSize: 10 }}>Acesse lendo o QRCode ao lado.</Text>
          </View>
          <Image
            src={generateQRCode("https://suave-one.vercel.app")}
            style={styles.qrCode}
          />
        </View>
      </Page>
    </Document>
  );
}

function formatDate(date: Date): string {
  const dtf = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  });

  return dtf.format(date);
}
