import { parse } from "smol-toml";
import { z } from "zod";

const text = z.string().trim().min(1, "Preencha este texto.");
const safePath = z
  .string()
  .regex(
    /^images\/[a-zA-Z0-9_./-]+\.(png|jpg|jpeg|webp|svg|avif)$/,
    "Use images/arquivo.webp, dentro de public/.",
  )
  .refine((p) => !p.includes(".."), "Não use .. no caminho.");
const card = z
  .object({
    title: text,
    description: text,
    icon: z
      .enum([
        "shield",
        "key",
        "sparkles",
        "eye",
        "message",
        "palette",
        "gamepad",
        "bot",
        "camera",
        "globe",
        "book",
        "heart",
      ])
      .default("sparkles"),
    image: safePath.optional(),
    alt: text.optional(),
    credit: text.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.image && !value.alt)
      ctx.addIssue({
        code: "custom",
        path: ["alt"],
        message: "Imagens precisam de descrição alternativa.",
      });
  });
const pair = z
  .object({
    id: text,
    topic: text,
    reference: card,
    dilemma: card,
    question: z
      .object({
        prompt: text,
        options: z.array(text).min(2).max(5),
        answer: z.number().int().min(1),
        explanation: text,
      })
      .strict(),
    sources: z
      .array(
        z.object({
          title: text,
          url: z.url().refine((u) => u.startsWith("https://"), "Use HTTPS."),
        }),
      )
      .default([]),
  })
  .strict()
  .superRefine((p, ctx) => {
    if (p.question.answer > p.question.options.length)
      ctx.addIssue({
        code: "custom",
        path: ["question", "answer"],
        message: "Resposta fora do número de alternativas.",
      });
    if (new Set(p.question.options).size !== p.question.options.length)
      ctx.addIssue({
        code: "custom",
        path: ["question", "options"],
        message: "Alternativas repetidas.",
      });
  });
export const collectionSchema = z
  .object({
    version: z.literal(1),
    decks: z
      .array(
        z
          .object({
            id: text,
            title: text,
            description: text,
            status: z.enum(["demo", "reviewed"]).default("demo"),
            pairs: z
              .array(pair)
              .length(6, "Cada baralho deve ter exatamente 6 pares.")
              .refine(
                (ps) => new Set(ps.map((p) => p.id)).size === ps.length,
                "IDs de pares repetidos.",
              ),
          })
          .strict(),
      )
      .min(1)
      .refine(
        (ds) => new Set(ds.map((d) => d.id)).size === ds.length,
        "IDs de baralhos repetidos.",
      ),
  })
  .strict();
export function parseContent(source: string) {
  return collectionSchema.parse(parse(source));
}
export type Collection = z.infer<typeof collectionSchema>;
export type Deck = Collection["decks"][number];
export type Pair = Deck["pairs"][number];
export type CardContent = Pair["reference"];
