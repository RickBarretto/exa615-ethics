import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseContent } from "../src/content";

try {
  const content = parseContent(readFileSync("content/decks.toml", "utf8"));
  for (const deck of content.decks)
    for (const pair of deck.pairs)
      for (const card of [pair.reference, pair.dilemma]) {
        if (card.image && !existsSync(resolve("public", card.image)))
          throw new Error(
            `${deck.id}/${pair.id}: imagem ausente: public/${card.image}`,
          );
      }
  // Fail before publishing assets that the offline cache cannot include.
  const walk = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? walk(`${directory}/${e.name}`)
        : [`${directory}/${e.name}`],
    );
  for (const path of walk("public")) {
    const { statSync } = await import("node:fs");
    if (statSync(path).size > 2 * 1024 * 1024)
      throw new Error(
        `${path}: use arquivos menores que 2 MiB para o cache offline.`,
      );
  }
  console.log(
    `Conteúdo válido: ${content.decks.length} baralho(s), 6 pares por baralho.`,
  );
} catch (error) {
  console.error("Erro em content/decks.toml:", error);
  process.exit(1);
}
