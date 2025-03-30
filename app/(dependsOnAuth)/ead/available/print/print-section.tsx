import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { ModuleExt } from "@/app/(dependsOnAuth)/ead/available/typing";

// Define styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    flexDirection: "column",
    padding: "15mm",
    width: "297mm", // A4 Landscape width
    height: "210mm", // A4 Landscape height
  },
  header: {
    borderBottom: "2px solid black",
    marginBottom: "8mm",
    paddingBottom: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridContainer: {
    height: "100mm",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "3mm", // Increased gap between rows
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "31mm", // Adjusted to fit 100mm with gaps (31mm × 3 + 3mm × 2 ≈ 100mm)
    gap: "3mm", // Increased gap between columns
  },
  moduleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px solid black",
    width: "48%", // Adjusted slightly for gap
    height: "31mm", // Matches row height
    padding: 4,
  },
  inactiveModuleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "48%", // Adjusted slightly for gap
    height: "31mm", // Matches row height
    padding: 4,
  },
  textContainer: {
    flex: 2,
    paddingRight: "5mm", // Increased gap between text and QR code
  },
  footer: {
    borderTop: "1px solid black",
    marginTop: "auto",
    paddingTop: "5mm",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrCode: {
    width: "28mm", // Increased QR code size
    height: "28mm",
  },
});

// Helper to generate QR code as a data URL
async function generateQRCode(value: string): Promise<string> {
  return await QRCode.toDataURL(value, {
    errorCorrectionLevel: "high",
  });
}

function ModuleCard({ module }: { module: ModuleExt }) {
  const qrCodeDataUrl = generateQRCode(module.url);

  return (
    <View style={styles.moduleCard}>
      <View style={styles.textContainer}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "justify",
          }}
        >
          {module.name}
        </Text>
        <Text style={{ fontSize: 10, marginTop: 2 }} wrap>
          {module.course}
        </Text>
        <Text style={{ fontSize: 9, marginTop: 2 }}>
          Fecha:{" "}
          {module.dueDate
            ? formatDate(new Date(module.dueDate))
            : "Não especificado"}
        </Text>
      </View>
      <Image src={qrCodeDataUrl} style={styles.qrCode} />
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

  // Chunk modules into groups of 6 (2×3 grid)
  const pages = [];
  for (let i = 0; i < moduleList.length; i += 6) {
    pages.push(moduleList.slice(i, i + 6));
  }

  return (
    <Document>
      {pages.map((pageModules, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={styles.page}
          orientation="landscape"
        >
          <View style={styles.header} fixed>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Tarefas do Moodle disponíveis
            </Text>
            <Text
              render={({ pageNumber, totalPages }) => (
                <Text style={{ fontSize: 12 }}>
                  {pageNumber} / {totalPages}
                </Text>
              )}
            />
          </View>

          <View style={styles.gridContainer}>
            {[0, 1, 2].map((rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {[0, 1].map((colIndex) => {
                  const moduleIndex = rowIndex * 2 + colIndex;
                  const module = pageModules[moduleIndex];
                  return module ? (
                    <ModuleCard key={moduleIndex} module={module} />
                  ) : (
                    <View key={colIndex} style={styles.inactiveModuleCard} />
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.footer} fixed>
            <View style={{ flex: 1, padding: 5, gap: 4 }}>
              <Text style={{ fontSize: 12 }}>
                Gerado pelo Suave em{"  "}
                {formatDate(new Date())}
              </Text>
              <Text style={{ fontSize: 12 }}>
                Uma ferramenta por Moizes de Jesus Sousa
              </Text>
              <Text style={{ fontSize: 12 }}>
                Acesse lendo o QRCode ao lado.
              </Text>
            </View>
            <Image
              src={generateQRCode("https://suave-one.vercel.app")}
              style={styles.qrCode}
            />
          </View>
        </Page>
      ))}
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
