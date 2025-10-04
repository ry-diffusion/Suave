export default defineEventHandler(async () => {
  try {
    const url = "https://www.ifgoiano.edu.br/home/index.php/cristalina";

    // Fetch HTML da página
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extrair notícias recentes
    const news: Array<{
      title: string;
      url: string;
      date: string;
      timestamp: Date | null;
      image: string | null;
    }> = [];

    const newsPattern =
      /<div class="tileItem">[\s\S]*?<h6>[\s\S]*?<a href="([^"]+)">[\s\S]*?([^<]+)[\s\S]*?<\/a>[\s\S]*?<\/h6>[\s\S]*?<p>([^<]+)<\/p>/g;

    let newsMatch: RegExpExecArray | null;
    // biome-ignore lint: assignment in expression is intentional for regex matching
    while ((newsMatch = newsPattern.exec(html)) !== null) {
      const newsUrl = newsMatch[1];
      const title = newsMatch[2].trim();
      const date = newsMatch[3].trim();

      news.push({
        title,
        url: `https://www.ifgoiano.edu.br${newsUrl}`,
        date,
        timestamp: parseDateString(date),
        image: null,
      });
    }

    // Extrair manchetes principais
    const headlines: Array<{
      type: "main" | "secondary";
      title: string;
      url: string;
      description: string;
      image: string | null;
    }> = [];

    // Manchete principal
    const mainSectionPattern =
      /<div class="manchete-texto-lateral">[\s\S]*?<div class="row-fluid">([\s\S]*?)<\/div>[\s\S]*?<\/div>/;
    const mainSection = html.match(mainSectionPattern);

    if (mainSection) {
      const content = mainSection[1];

      const imgPattern = /<img src="([^"]+)"/;
      const imgMatch = content.match(imgPattern);
      const mainImage = imgMatch
        ? `https://www.ifgoiano.edu.br${imgMatch[1]}`
        : null;

      const titlePattern =
        /<h1\s*>[\s\S]*?<a href="([^"]+)"\s*>[\s\S]*?([^<]+)[\s\S]*?<\/a>[\s\S]*?<\/h1>[\s\S]*?<p class="description">([^<]+)<\/p>/;
      const titleMatch = content.match(titlePattern);

      if (titleMatch) {
        headlines.push({
          type: "main",
          title: titleMatch[2].trim(),
          url: `https://www.ifgoiano.edu.br${titleMatch[1]}`,
          description: titleMatch[3].trim(),
          image: mainImage,
        });
      }
    }

    // Manchetes secundárias
    const secondaryPattern =
      /<div class="span4[^"]*">[\s\S]*?<a href="([^"]+)"[^>]*class="img-rounded">[\s\S]*?<img src="([^"]+)"[\s\S]*?<\/a>[\s\S]*?<h2[^>]*>[\s\S]*?<a href="[^"]+"\s*>[\s\S]*?([^<]+)[\s\S]*?<\/a>[\s\S]*?<\/h2>[\s\S]*?<p class="description">([^<]+)<\/p>/g;

    let secondaryMatch: RegExpExecArray | null;
    // biome-ignore lint: assignment in expression is intentional for regex matching
    while ((secondaryMatch = secondaryPattern.exec(html)) !== null) {
      headlines.push({
        type: "secondary",
        title: secondaryMatch[3].trim(),
        url: `https://www.ifgoiano.edu.br${secondaryMatch[1]}`,
        description: secondaryMatch[4].trim(),
        image: `https://www.ifgoiano.edu.br${secondaryMatch[2]}`,
      });
    }

    return {
      news,
      headlines,
    };
  } catch (error) {
    console.error("Erro ao buscar notícias do IF:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao buscar notícias do IF Goiano",
    });
  }
});

function parseDateString(dateStr: string): Date | null {
  // Formato: "05/09/2025 19h16"
  const regex = /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2})h(\d{2})/;
  const match = dateStr.match(regex);

  if (match) {
    const [, day, month, year, hour, minute] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    );
  }

  return null;
}
