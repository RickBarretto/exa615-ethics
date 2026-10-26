import type { Deck } from "./content";
export type Card = {
  id: string;
  pairId: string;
  side: "reference" | "dilemma";
};
export type GameState = {
  cards: Card[];
  flipped: string[];
  matched: string[];
  answers: Record<string, number>;
  attempts: number;
  phase: "playing" | "mismatch" | "question" | "finished";
  questionId: string | null;
};
export type GameAction =
  | { type: "flip"; id: string }
  | { type: "hide" }
  | { type: "answer"; option: number; optionCount: number };
export function shuffle<T>(
  items: T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function createGame(deck: Deck): GameState {
  return {
    cards: shuffle(
      deck.pairs.flatMap((p) =>
        (["reference", "dilemma"] as const).map((side) => ({
          id: `${p.id}:${side}`,
          pairId: p.id,
          side,
        })),
      ),
    ),
    flipped: [],
    matched: [],
    answers: {},
    attempts: 0,
    phase: "playing",
    questionId: null,
  };
}
export function reducer(state: GameState, action: GameAction): GameState {
  if (action.type === "hide")
    return state.phase === "mismatch"
      ? { ...state, flipped: [], phase: "playing" }
      : state;
  if (action.type === "answer") {
    if (
      state.phase !== "question" ||
      !state.questionId ||
      !Number.isInteger(action.option) ||
      action.option < 1 ||
      action.option > action.optionCount
    )
      return state;
    return {
      ...state,
      answers: { ...state.answers, [state.questionId]: action.option },
      questionId: null,
      flipped: [],
      phase:
        state.matched.length === state.cards.length / 2
          ? "finished"
          : "playing",
    };
  }
  if (state.phase !== "playing" || state.flipped.includes(action.id))
    return state;
  const card = state.cards.find((c) => c.id === action.id);
  if (!card || state.matched.includes(card.pairId)) return state;
  if (state.flipped.length === 0) return { ...state, flipped: [card.id] };
  const first = state.cards.find((c) => c.id === state.flipped[0]);
  if (!first) return state;
  const match = first.pairId === card.pairId;
  return {
    ...state,
    flipped: [first.id, card.id],
    attempts: state.attempts + 1,
    matched: match ? [...state.matched, card.pairId] : state.matched,
    phase: match ? "question" : "mismatch",
    questionId: match ? card.pairId : null,
  };
}
export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}
