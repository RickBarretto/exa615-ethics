import { useRegisterSW } from "virtual:pwa-register/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Camera,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  Eye,
  Gamepad2,
  Github,
  Globe2,
  Heart,
  KeyRound,
  Layers2,
  LockKeyhole,
  MessageCircle,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  WifiOff,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useReducer, useRef, useState } from "react";
import raw from "../content/decks.toml?raw";
import { type Deck, type Pair, parseContent } from "./content";
import { createGame, formatTime, reducer } from "./engine";

const content = parseContent(raw);
const icons = {
  shield: ShieldCheck,
  key: KeyRound,
  sparkles: Sparkles,
  eye: Eye,
  message: MessageCircle,
  palette: Palette,
  gamepad: Gamepad2,
  bot: Bot,
  camera: Camera,
  globe: Globe2,
  book: BookOpen,
  heart: Heart,
};
function getPair(deck: Deck, id: string | null): Pair {
  const pair = deck.pairs.find((candidate) => candidate.id === id);
  if (!pair) throw new Error(`Pair ${id} was not found in deck ${deck.id}.`);
  return pair;
}
function Art({ type, className = "" }: { type: string; className?: string }) {
  const Icon = icons[type as keyof typeof icons] || Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
function Illustration() {
  return (
    <div
      className="illustration select-none h-85 relative isolate max-[651px]:h-[285px] max-[651px]:[transform:scale(.82)] max-[651px]:[transform-origin:center_center] max-[651px]:ml-[-25px] max-[651px]:w-90 max-[651px]:max-w-full max-[651px]:[margin:5px_auto_-5px] min-[651px]:max-[901px]:[transform:scale(.8)] min-[651px]:max-[901px]:[transform-origin:center_center] min-[651px]:max-[901px]:ml-[-25px] min-[1300px]:max-w-110 min-[1300px]:ml-5"
      aria-hidden="true"
    >
      <span className="orbit orbit-one absolute inset-[14px_10px] [border:1px_dashed_#ddd5ea] rounded-full [transform:rotate(-20deg)] max-[651px]:inset-[8px_-8px]" />
      <span className="orbit orbit-two absolute inset-[14px_10px] [border:1px_dashed_#ddd5ea] rounded-full [transform:rotate(-20deg)] max-[651px]:inset-[8px_-8px]" />
      <span className="small-star star-one absolute text-[#b6a4db] text-[2.5rem]">
        ✦
      </span>
      <span className="small-star star-two absolute text-[#b6a4db] text-[2.5rem]">
        ✧
      </span>
      <span className="small-star star-three absolute text-[#b6a4db] text-[2.5rem]">
        +
      </span>
      <div className="float-card art-purple absolute w-39.5 h-53.5 rounded-[20px] [border:6px_solid_white] flex flex-col items-center justify-center gap-6 shadow-[0_13px_28px_#4b356b12] bg-[#ded5f4] text-[#7650bb] left-10 top-[39px] [transform:rotate(-14deg)] z-[1] max-[651px]:left-[15px]">
        <Gamepad2 />
        <span>Uma história</span>
        <i>01</i>
      </div>
      <div className="float-card art-orange absolute w-39.5 h-53.5 rounded-[20px] [border:6px_solid_white] flex flex-col items-center justify-center gap-6 shadow-[0_13px_28px_#4b356b12] bg-[#ffe3bd] text-[#c37831] left-49.5 top-[83px] [transform:rotate(13deg)] z-[2] max-[651px]:left-41">
        <KeyRound />
        <span>Uma escolha</span>
        <i>02</i>
      </div>
      <div className="match-stamp absolute left-28.5 top-66 z-[3] [background:white] rounded-[30px] p-[11px_16px] flex items-center gap-[9px] shadow-[0_5px_22px_#39294812] [transform:rotate(-5deg)] text-[#4e7c6a] text-[1rem] font-[650] max-[651px]:left-[75px] max-[651px]:top-[249px]">
        <CheckCheck />
        <span>Uma conexão!</span>
      </div>
      <div className="dot-cluster absolute bottom-3 right-12 grid grid-cols-[repeat(3,4px)] gap-1.5 [transform:rotate(12deg)]">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
function Modal({
  title,
  children,
  onClose,
  locked = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  locked?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
    return () => {
      dialog.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal [border:1px_solid_#e3dbea] rounded-[22px] p-7 w-[min(560px,calc(100%_-_28px))] max-h-[calc(100dvh_-_40px)] text-[#30283b] bg-paper shadow-[0_20px_100px_#30213c40] max-[651px]:p-[23px_20px]"
      onCancel={(e) => {
        e.preventDefault();
        if (!locked) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="modal-header flex items-center justify-between mb-3.5">
        <span className="eyebrow text-[0.875rem] tracking-[1.7px] font-[750] leading-normal text-[#777180] uppercase">
          ENTRE PARES
        </span>
        {!locked && (
          <button
            type="button"
            className="icon-button border-0 bg-transparent grid place-items-center w-9.5 h-9.5 rounded-[9px] text-[#8b7c9b] min-w-11"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X />
          </button>
        )}
      </div>
      <h2 id="dialog-title">{title}</h2>
      {children}
    </dialog>
  );
}
function Question({
  pair,
  onAnswer,
}: {
  pair: Pair;
  onAnswer: (n: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <Modal title="Encontramos um par. Vamos pensar?" locked onClose={() => {}}>
      <span className="tag inline-flex items-center bg-[#f3eefb] p-[5px_8px] rounded-[5px] text-[0.875rem] font-[650] tracking-[.6px] text-[#7958a8]">
        {pair.topic}
      </span>
      <p className="question-context pl-3 [border-left:3px_solid_#d8c5ef]">
        {pair.reference.description}
      </p>
      <h3 className="question-prompt">{pair.question.prompt}</h3>
      <fieldset className="options border-0 p-[0] [margin:16px_0] grid gap-[9px]">
        <legend className="sr-only absolute w-[1px] h-[1px] overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap">
          Escolha uma resposta
        </legend>
        {pair.question.options.map((option, i) => (
          <label
            className={`option flex items-center gap-3 [border:1.5px_solid_#e5dde9] bg-[#fff] rounded-[10px] p-[13px] cursor-pointer relative text-[1rem] leading-normal max-[651px]:gap-2 max-[651px]:p-[12px_10px] ${selected === i + 1 ? "selected" : ""}`}
            key={option}
          >
            <input
              type="radio"
              name="answer"
              value={i + 1}
              checked={selected === i + 1}
              onChange={() => setSelected(i + 1)}
            />
            <span className="letter select-none bg-[#eee7f5] w-[25px] h-[25px] grid place-items-center rounded-[6px] text-[#80649c] text-[0.875rem] font-bold shrink-0 max-[651px]:hidden">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <p className="small muted text-[1rem] leading-[1.6] text-muted">
        Conversem antes de escolher. As respostas e explicações aparecem no
        final.
      </p>
      <button
        type="button"
        className="button primary full inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
        disabled={selected === null}
        onClick={() => selected !== null && onAnswer(selected)}
      >
        Confirmar resposta <ArrowRight size={18} />
      </button>
    </Modal>
  );
}
function Game({
  deck,
  onExit,
  onRestart,
  onFinish,
}: {
  deck: Deck;
  onExit: () => void;
  onRestart: () => void;
  onFinish: (state: ReturnType<typeof createGame>, elapsed: number) => void;
}) {
  const [state, dispatch] = useReducer(reducer, deck, createGame);
  const [elapsed, setElapsed] = useState(0);
  const [confirm, setConfirm] = useState<"exit" | "restart" | null>(null);
  const started = useRef(Date.now());
  const [announcement, setAnnouncement] = useState(
    "Partida iniciada. Escolha duas cartas.",
  );
  const [help, setHelp] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const gameHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    gameHeading.current?.focus();
  }, []);
  useEffect(() => {
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - started.current) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (state.phase === "mismatch")
      setAnnouncement(
        "As cartas não formam um par. Leia as cartas e selecione Continuar para ocultá-las.",
      );
    if (state.phase === "question")
      setAnnouncement("Par encontrado. Responda à pergunta.");
    if (state.phase === "playing" && state.flipped.length === 1) {
      const c = state.cards.find((c) => c.id === state.flipped[0]);
      if (!c) return;
      const p = getPair(deck, c.pairId);
      setAnnouncement(`${p[c.side].title}. ${p[c.side].description}`);
    }
    if (state.phase === "finished")
      onFinish(state, Math.floor((Date.now() - started.current) / 1000));
  }, [state, deck, onFinish]);
  useEffect(() => {
    if (state.phase === "mismatch") nextRef.current?.focus();
  }, [state.phase]);
  // A deliberate continue action keeps mismatched text available as long as needed.
  return (
    <main id="main" className="game-page pt-[25px] pb-12.5">
      <div className="game-top flex justify-between items-center">
        <button
          type="button"
          className="text-button inline-flex items-center gap-2 border-0 bg-transparent p-[10px_0] text-[1rem] font-semibold text-[#7b7186]"
          onClick={() => setConfirm("exit")}
        >
          <ArrowLeft size={17} /> Sair da partida
        </button>
        <span className="tag inline-flex items-center bg-[#f3eefb] p-[5px_8px] rounded-[5px] text-[0.875rem] font-[650] tracking-[.6px] text-[#7958a8]">
          JOGANDO EM CONJUNTO
        </span>
      </div>
      <div className="game-heading flex justify-between items-center [margin:30px_0_25px] max-[651px]:items-start max-[651px]:[margin:23px_0_20px]">
        <div>
          <p className="eyebrow text-[0.875rem] tracking-[1.7px] font-[750] leading-normal text-[#777180] uppercase">
            {deck.title}
          </p>
          <h1 ref={gameHeading} tabIndex={-1}>
            Qual é a conexão?
          </h1>
          <p className="muted text-muted">
            Encontre a história e a escolha que combinam.
          </p>
        </div>
        <button
          type="button"
          className="text-button inline-flex items-center gap-2 border-0 bg-transparent p-[10px_0] text-[1rem] font-semibold text-[#7b7186]"
          onClick={() => setHelp(true)}
        >
          <CircleHelp size={18} /> Como jogar
        </button>
      </div>
      <div className="scorebar select-none flex gap-6 items-center bg-[#fff] [border:1px_solid_var(--line)] p-[15px_23px] rounded-[14px] flex-wrap max-[651px]:gap-4 max-[651px]:p-[16px_12px]">
        <div>
          <Layers2 />
          <span>
            <strong>
              {state.matched.length}
              <small> / 6</small>
            </strong>
            <span>pares encontrados</span>
          </span>
        </div>
        <div>
          <RotateCcw />
          <span>
            <strong>{state.attempts}</strong>
            <span>tentativas</span>
          </span>
        </div>
        <div>
          <Clock3 />
          <span>
            <strong>{formatTime(elapsed)}</strong>
            <span>tempo de descoberta</span>
          </span>
        </div>
        <button
          type="button"
          className="icon-button border-0 bg-transparent grid place-items-center w-9.5 h-9.5 rounded-[9px] text-[#8b7c9b] min-w-11"
          onClick={() => setConfirm("restart")}
          aria-label="Reiniciar partida"
        >
          <RotateCcw />
        </button>
      </div>
      <div
        className="progress-track h-1 bg-[#e9e1f1] [margin:12px_7px_25px] rounded-[10px] overflow-hidden"
        role="progressbar"
        aria-label="Pares encontrados"
        aria-valuenow={state.matched.length}
        aria-valuemin={0}
        aria-valuemax={6}
      >
        <span style={{ width: `${(state.matched.length / 6) * 100}%` }} />
      </div>
      <p
        className="sr-only absolute w-[1px] h-[1px] overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </p>
      <section
        className="board grid grid-cols-[repeat(4,1fr)] gap-[15px] max-[651px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[651px]:gap-[9px] min-[651px]:max-[901px]:grid-cols-[repeat(3,minmax(0,1fr))] min-[651px]:max-[901px]:gap-[11px]"
        aria-label="Tabuleiro com doze cartas"
      >
        {state.cards.map((card, index) => {
          const pair = getPair(deck, card.pairId);
          const face = pair[card.side];
          const matched = state.matched.includes(card.pairId);
          const open = matched || state.flipped.includes(card.id);
          return (
            <button
              type="button"
              key={card.id}
              ref={(element) => {
                if (element) cardRefs.current.set(card.id, element);
                else cardRefs.current.delete(card.id);
              }}
              className={`memory-card bg-[#e9e0f5] [border:1.5px_solid_#d5c8e6] rounded-[15px] min-h-65 p-[0] relative overflow-hidden [transition:transform_.22s,background_.22s,box-shadow_.22s] max-[651px]:rounded-[11px] max-[651px]:min-h-70 ${open ? "revealed" : ""} ${matched ? "matched" : ""} color-${deck.pairs.indexOf(pair) % 6}`}
              aria-label={
                open
                  ? `Carta ${index + 1}: ${face.title}. ${face.description}${face.image && face.alt ? ` Imagem: ${face.alt}` : ""}${matched ? ". Par encontrado." : ""}`
                  : `Carta ${index + 1}, virada para baixo`
              }
              aria-disabled={state.phase !== "playing" || open}
              onClick={() => dispatch({ type: "flip", id: card.id })}
            >
              <span
                className="card-back absolute inset-[9px] [border:1px_dashed_#c9b7e1] rounded-[9px] flex items-center justify-center flex-col gap-2.5 text-[#b19bcf] [background-image:radial-gradient(#d5c7e6_1px,transparent_1px)] [background-size:14px_14px] max-[651px]:inset-1.5"
                aria-hidden="true"
              >
                <span className="card-mini text-[2rem] font-extrabold tracking-[-3px] [transform:rotate(-10deg)] [border:2px_solid_#bda6d9] rounded-[10px] w-[57px] h-16.5 grid place-items-center bg-[#e9e0f5] relative max-[651px]:text-[1.625rem] max-[651px]:w-[43px] max-[651px]:h-13">
                  ep<span>✦</span>
                </span>
                <span>entre pares</span>
                <i>{String(index + 1).padStart(2, "0")}</i>
              </span>
              {open && (
                <span
                  className="card-face flex flex-col items-center p-[16px_12px] h-[auto] w-full gap-2 [animation:reveal_.25s] min-h-full max-[651px]:p-[12px_10px] max-[651px]:gap-[7px]"
                  aria-hidden="true"
                >
                  <span className="card-kind flex justify-between items-center w-full text-[0.875rem] tracking-[1px] font-bold text-[#9c7846] gap-1.5 flex-wrap max-[651px]:tracking-[.7px]">
                    {card.side === "reference" ? "HISTÓRIA" : "ESCOLHA"}
                    {matched && <Check size={15} />}
                  </span>
                  {face.image ? (
                    <img
                      src={`${import.meta.env.BASE_URL}${face.image}`}
                      alt=""
                    />
                  ) : (
                    <Art type={face.icon} />
                  )}
                  <strong>{face.title}</strong>
                  <span className="card-description text-[1rem] leading-[1.6] text-[#736b74] max-w-none">
                    {face.description}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </section>
      <div className="board-tip flex items-center justify-center gap-5 min-h-20 pt-5 max-[651px]:gap-2.5 max-[651px]:flex-col">
        {state.phase === "mismatch" ? (
          <>
            <p>Quase! Leia as duas cartas antes de tentar outra conexão.</p>
            <button
              type="button"
              ref={nextRef}
              className="button primary inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
              onClick={() => {
                cardRefs.current.get(state.flipped[0])?.focus();
                dispatch({ type: "hide" });
                setAnnouncement("Cartas ocultas. Escolha outras duas cartas.");
              }}
            >
              Continuar <ArrowRight size={17} />
            </button>
          </>
        ) : (
          <p>
            <Users size={18} /> Uma conversa pode ser a melhor pista. Pensem em
            conjunto.
          </p>
        )}
      </div>
      {state.phase === "question" && (
        <Question
          key={state.questionId}
          pair={getPair(deck, state.questionId)}
          onAnswer={(option) =>
            dispatch({
              type: "answer",
              option,
              optionCount: getPair(deck, state.questionId).question.options
                .length,
            })
          }
        />
      )}{" "}
      {confirm && (
        <Modal
          title={
            confirm === "restart" ? "Começar de novo?" : "Sair da partida?"
          }
          onClose={() => setConfirm(null)}
        >
          <p>O progresso desta partida será perdido.</p>
          <div className="modal-actions flex justify-end gap-2.5 mt-6 max-[651px]:flex-wrap">
            <button
              type="button"
              className="button secondary inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
              onClick={() => setConfirm(null)}
            >
              Continuar jogando
            </button>
            <button
              type="button"
              className="button primary inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
              onClick={() => {
                if (confirm === "exit") onExit();
                else {
                  onRestart();
                }
                setConfirm(null);
              }}
            >
              {confirm === "restart" ? "Reiniciar" : "Sair"}
            </button>
          </div>
        </Modal>
      )}
      {help && (
        <Modal
          title="Cada conexão traz uma reflexão"
          onClose={() => setHelp(false)}
        >
          <Instructions />
          <button
            type="button"
            className="button primary full inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
            onClick={() => setHelp(false)}
          >
            Voltar ao jogo
          </button>
        </Modal>
      )}
    </main>
  );
}
function Instructions() {
  return (
    <ol className="instructions list-none [counter-reset:steps] p-[0] [margin:20px_0]">
      <li>
        <strong>Virem duas cartas.</strong>
        <span>Associe uma história à escolha ética correspondente.</span>
      </li>
      <li>
        <strong>Conversem sobre a pergunta.</strong>
        <span>Ao encontrar um par, escolham uma alternativa em conjunto.</span>
      </li>
      <li>
        <strong>Descubram e reflitam.</strong>
        <span>
          Encontrem os seis pares. O gabarito e as explicações ficam para o
          final.
        </span>
      </li>
      <li>
        <strong>No seu ritmo.</strong>
        <span>
          Não há limite de tempo. Cartas diferentes ficam visíveis até vocês
          selecionarem Continuar. Use Tab e Enter ou Espaço para jogar pelo
          teclado.
        </span>
      </li>
    </ol>
  );
}
export default function App() {
  const [screen, setScreen] = useState<"home" | "game" | "results">("home");
  const [deckId, setDeckId] = useState(content.decks[0].id);
  const [modal, setModal] = useState<"help" | "about" | null>(null);
  const [result, setResult] = useState<{
    state: ReturnType<typeof createGame>;
    elapsed: number;
  } | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  const deck = content.decks.find((d) => d.id === deckId) ?? content.decks[0];
  useEffect(() => {
    if (screen !== "game") headingRef.current?.focus();
    window.scrollTo(0, 0);
  }, [screen]);
  function start() {
    setResult(null);
    setGameKey((k) => k + 1);
    setScreen("game");
  }
  const correct = result
    ? deck.pairs.filter((p) => result.state.answers[p.id] === p.question.answer)
        .length
    : 0;
  return (
    <>
      <a
        className="skip-link fixed top-[5px] left-[5px] z-[20] [transform:translateY(-200%)] p-3 [background:white] [border:2px_solid_var(--purple)]"
        href="#main"
      >
        Pular para o conteúdo
      </a>
      <header className="site-header h-[auto] max-w-304 m-auto flex items-center justify-between p-[0_40px] [border-bottom:1px_solid_var(--line)] min-h-25.5 gap-5 pt-5 pb-5 flex-wrap max-[651px]:p-[0_20px] max-[651px]:min-h-19.5 max-[651px]:gap-3 max-[651px]:pt-4 max-[651px]:pb-4 min-[651px]:max-[901px]:p-[0_25px]">
        <button
          type="button"
          className="brand flex items-center gap-[11px] border-0 bg-transparent text-[1.875rem] font-extrabold tracking-[-1.4px] max-[651px]:text-[1.625rem]"
          onClick={() => {
            if (screen !== "game") setScreen("home");
          }}
          aria-label="Entre Pares, início"
          disabled={screen === "game"}
        >
          <img
            className="brand-icon block w-10.5 h-10.5 max-[651px]:w-9 max-[651px]:h-9"
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            alt=""
          />
          <span>
            entre<span className="brand-light">pares</span>
            <span className="brand-dot">.</span>
          </span>
        </button>
        <nav aria-label="Navegação principal">
          <button type="button" onClick={() => setModal("help")}>
            <CircleHelp size={17} />
            <span>Como jogar</span>
          </button>
          <button type="button" onClick={() => setModal("about")}>
            <BookOpen size={17} />
            <span>Sobre o projeto</span>
          </button>
        </nav>
      </header>
      {screen === "home" && (
        <main id="main">
          <section className="hero grid grid-cols-[1.2fr_1fr] min-h-122.5 items-center p-[58px_0_42px] gap-3 max-[651px]:flex max-[651px]:min-h-110 max-[651px]:items-stretch max-[651px]:p-[36px_0_20px] max-[651px]:gap-[0] max-[651px]:flex-col min-[651px]:max-[901px]:min-h-110 min-[1300px]:pt-[65px] min-[1300px]:pb-[55px]">
            <div className="hero-copy">
              <span className="eyebrow pill text-[0.875rem] tracking-[1.3px] font-[750] leading-normal text-[#6641ad] uppercase inline-flex items-center gap-2 bg-[#eeE8f9] p-[8px_11px] rounded-[7px]">
                <span /> MEMÓRIA, CONVERSA E DESCOBERTA
              </span>
              <h1 ref={headingRef} tabIndex={-1}>
                Pequenas conexões.
                <br />
                <span>Grandes reflexões.</span>
              </h1>
              <p>
                Um jogo da memória para descobrir que a ética também faz parte
                do nosso mundo digital.
              </p>
              <div className="hero-details flex gap-[23px] mt-5.5 text-[#5f596a] text-[1rem] max-[651px]:gap-[12px_20px] max-[651px]:text-[0.875rem] min-[651px]:max-[901px]:gap-3">
                <span>
                  <Users size={17} /> Cooperativo
                </span>
                <span>
                  <Clock3 size={17} /> 5–10 min
                </span>
                <span>
                  <Layers2 size={17} /> 6 pares
                </span>
              </div>
              <a
                className="button primary hero-cta inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
                href="#baralhos"
              >
                Vamos jogar <ArrowRight size={19} />
              </a>
              <p className="hero-note">
                <LockKeyhole size={13} /> Sem cadastro. Só curiosidade.
              </p>
            </div>
            <Illustration />
          </section>
          <section
            className="decks-section [border-top:1px_solid_var(--line)] p-[34px_0_36px] [scroll-margin-top:20px]"
            id="baralhos"
            aria-labelledby="deck-title"
          >
            <div className="section-title flex justify-between items-end mb-[23px] max-[651px]:items-start">
              <div>
                <p className="eyebrow text-[0.875rem] tracking-[1.7px] font-[750] leading-normal text-[#777180] uppercase">
                  A DESCOBERTA COMEÇA AQUI
                </p>
                <h2 id="deck-title">Escolham um baralho</h2>
              </div>
              <span className="muted small text-[1rem] leading-[1.6] text-muted">
                Uma partida, muitas ideias.
              </span>
            </div>
            <div className="deck-layout grid grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-6 max-[651px]:grid-cols-[1fr] max-[651px]:gap-4 min-[651px]:max-[901px]:grid-cols-[1fr] min-[651px]:max-[901px]:gap-4">
              <div className="deck-list grid gap-5">
                {content.decks.map((d, index) => (
                  <label
                    key={d.id}
                    className={`deck-card relative grid grid-cols-[145px_minmax(0,1fr)] bg-[#fff] [border:1.5px_solid_var(--line)] rounded-[16px] overflow-hidden cursor-pointer [transition:border-color_.2s] min-h-54.5 max-[651px]:grid-cols-[1fr] max-[651px]:min-h-[205px] ${deckId === d.id ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="deck"
                      value={d.id}
                      checked={deckId === d.id}
                      onChange={() => setDeckId(d.id)}
                    />
                    <div
                      className={`deck-art select-none deck-art-${index % 3} relative bg-[#eee8f7] overflow-hidden flex items-center justify-center min-h-54.5 max-[651px]:min-h-47.5`}
                      aria-hidden="true"
                    >
                      <div className="deck-tile absolute bg-[#fffaf5] w-22.5 h-[121px] flex items-center justify-center flex-col gap-3.5 rounded-[12px] shadow-[0_8px_9px_#765c9d12] [border:4px_solid_#fff] [transform:rotate(-15deg)] left-7 top-9 text-[#7a57b4] max-[360px]:w-17.5 max-[360px]:h-25 max-[360px]:left-[calc(50%_-_70px)] max-[360px]:top-6 min-[360px]:max-[651px]:left-[calc(50%_-_70px)] min-[360px]:max-[651px]:top-6 min-[651px]:max-[901px]:left-[5px]">
                        <Gamepad2 />
                        <span>histórias</span>
                      </div>
                      <div className="deck-tile absolute bg-[#fffaf5] w-22.5 h-[121px] flex items-center justify-center flex-col gap-3.5 rounded-[12px] shadow-[0_8px_9px_#765c9d12] [border:4px_solid_#fff] [transform:rotate(-15deg)] left-7 top-9 text-[#7a57b4] max-[360px]:w-17.5 max-[360px]:h-25 max-[360px]:left-[calc(50%_-_70px)] max-[360px]:top-6 min-[360px]:max-[651px]:left-[calc(50%_-_70px)] min-[360px]:max-[651px]:top-6 min-[651px]:max-[901px]:left-[5px]">
                        <Sparkles />
                        <span>escolhas</span>
                      </div>
                      <span className="deck-art-star absolute top-[19px] right-6.5 text-[#ac8ed5] text-[1.625rem]">
                        ✦
                      </span>
                    </div>
                    <div className="deck-info p-[22px_23px] max-[651px]:p-[18px_16px] min-[651px]:max-[901px]:p-[18px_16px]">
                      <div className="deck-info-top flex items-center justify-between gap-2 flex-wrap">
                        <span className="tag inline-flex items-center bg-[#f3eefb] p-[5px_8px] rounded-[5px] text-[0.875rem] font-[650] tracking-[.6px] text-[#7958a8]">
                          {d.status === "demo"
                            ? "DEMONSTRAÇÃO"
                            : "BARALHO OFICIAL"}
                        </span>
                        <span className="selected-dot w-[21px] h-[21px] grid place-items-center bg-purple rounded-full text-[white] shrink-0">
                          {deckId === d.id && <Check size={14} />}
                        </span>
                      </div>
                      <h3>{d.title}</h3>
                      <p>{d.description}</p>
                      <div className="deck-meta flex gap-3 flex-wrap mt-[21px] text-[#82778c] text-[0.875rem] max-[651px]:gap-[7px] min-[651px]:max-[901px]:gap-[7px]">
                        <span>6 pares</span>
                        <span>12 cartas</span>
                        <span>Linguagem simples</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <aside className="start-panel bg-[#f0ece6] [border:1px_solid_#e9e2d9] rounded-[16px] p-[23px_25px] relative max-[651px]:p-5.5 min-[651px]:max-[901px]:p-[20px_18px]">
                <span className="panel-icon grid place-items-center w-8.5 h-8.5 bg-[#e4ddd2] text-[#958570] rounded-[10px] absolute right-[23px] top-[25px] max-[651px]:hidden min-[651px]:max-[901px]:hidden">
                  <Users />
                </span>
                <h3>
                  Melhor quando
                  <br />
                  pensamos juntos.
                </h3>
                <p>
                  Reúnam a dupla ou o grupo, conversem e descubram cada conexão
                  no próprio ritmo.
                </p>
                <button
                  type="button"
                  className="button primary full inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
                  onClick={start}
                >
                  Começar partida <ArrowRight size={18} />
                </button>
                <span className="small muted text-[1rem] leading-[1.6] text-muted">
                  Cada dispositivo tem sua própria partida.
                </span>
              </aside>
            </div>
            {deck.status === "demo" && (
              <p className="demo-note flex items-center gap-[7px] text-[0.875rem] text-[#857e8b] mt-[15px] max-[651px]:items-start">
                <BookOpen size={15} /> Baralho demonstrativo com histórias
                autorais. O conteúdo definitivo será revisado pela equipe
                acadêmica.
              </p>
            )}
          </section>
          <section className="how-section p-[36px_0_50px] [border-top:1px_solid_var(--line)] max-[651px]:pt-7">
            <div className="how-heading">
              <span className="eyebrow text-[0.875rem] tracking-[1.7px] font-[750] leading-normal text-[#777180] uppercase">
                SIMPLES DE JOGAR. BOM DE CONVERSAR.
              </span>
              <h2>Mais que encontrar pares.</h2>
            </div>
            <div className="how-grid grid grid-cols-[repeat(3,1fr)] gap-14.5 mt-7 max-[651px]:grid-cols-[1fr] max-[651px]:gap-6 max-[651px]:mt-[27px] min-[651px]:max-[901px]:gap-6">
              <article>
                <span className="step-number select-none lavender w-8 h-8 grid place-items-center rounded-[10px] text-[0.875rem] font-[750] [transform:rotate(-5deg)] max-[651px]:absolute max-[651px]:left-0 max-[651px]:top-0">
                  01
                </span>
                <h3>Conectem as cartas</h3>
                <p>
                  Uma história de um lado, uma escolha do outro. Qual é a
                  relação?
                </p>
              </article>
              <article>
                <span className="step-number select-none peach w-8 h-8 grid place-items-center rounded-[10px] text-[0.875rem] font-[750] [transform:rotate(-5deg)] max-[651px]:absolute max-[651px]:left-0 max-[651px]:top-0">
                  02
                </span>
                <h3>Compartilhem ideias</h3>
                <p>
                  Um par encontrado é um convite para responder e refletir em
                  conjunto.
                </p>
              </article>
              <article>
                <span className="step-number select-none mint w-8 h-8 grid place-items-center rounded-[10px] text-[0.875rem] font-[750] [transform:rotate(-5deg)] max-[651px]:absolute max-[651px]:left-0 max-[651px]:top-0">
                  03
                </span>
                <h3>Levem o aprendizado</h3>
                <p>
                  No final, revisitem cada resposta e descubram novas
                  perspectivas.
                </p>
              </article>
            </div>
          </section>
        </main>
      )}
      {screen === "game" && (
        <Game
          key={gameKey}
          deck={deck}
          onExit={() => setScreen("home")}
          onRestart={start}
          onFinish={(state, elapsed) => {
            setResult({ state, elapsed });
            setScreen("results");
          }}
        />
      )}
      {screen === "results" && result && (
        <main
          id="main"
          className="results-page pt-[45px] pb-[35px] max-w-250 max-[651px]:pt-7.5"
        >
          <div className="result-hero text-center">
            <span className="result-icon [display:inline-grid] place-items-center bg-[#e0ecdf] text-[#69916a] w-17 h-17 rounded-[22px] [transform:rotate(-7deg)] mb-5">
              <CheckCheck size={35} />
            </span>
            <p className="eyebrow text-[0.875rem] tracking-[1.7px] font-[750] leading-normal text-[#777180] uppercase">
              SEIS CONEXÕES, NOVAS PERSPECTIVAS
            </p>
            <h1 ref={headingRef} tabIndex={-1}>
              O melhor par é aprender juntos.
            </h1>
            <p>Agora é hora de revisitar as escolhas e continuar a conversa.</p>
            <div className="result-stats grid grid-cols-[repeat(4,1fr)] [border:1px_solid_var(--line)] bg-[#fff] rounded-[15px] p-[23px] mt-7.5 gap-4 max-[651px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[651px]:p-[18px_9px] max-[651px]:gap-[20px_10px]">
              <span>
                <strong>6/6</strong>pares encontrados
              </span>
              <span>
                <strong>{correct}/6</strong>respostas corretas
              </span>
              <span>
                <strong>{result.state.attempts}</strong>tentativas
              </span>
              <span>
                <strong>{formatTime(result.elapsed)}</strong>tempo total
              </span>
            </div>
            <div className="result-buttons flex justify-center gap-3 mt-[23px]">
              <button
                type="button"
                className="button primary inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
                onClick={start}
              >
                <RotateCcw size={17} /> Jogar novamente
              </button>
              <button
                type="button"
                className="button secondary inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
                onClick={() => setScreen("home")}
              >
                Escolher baralho
              </button>
            </div>
          </div>
          <div className="review-title mt-[55px] mb-6 max-[651px]:mt-[35px]">
            <h2>Cada escolha tem uma história</h2>
            <p className="muted text-muted">
              Acertar é bom. Entender o porquê é ainda melhor.
            </p>
          </div>
          <div className="review-list select-text grid gap-[15px]">
            {deck.pairs.map((pair, i) => {
              const answer = result.state.answers[pair.id];
              const ok = answer === pair.question.answer;
              return (
                <details
                  className="review-card [border:1px_solid_var(--line)] rounded-[14px] bg-[#fff] overflow-hidden"
                  key={pair.id}
                  open
                >
                  <summary>
                    <span
                      className={`review-icon grid place-items-center w-[39px] h-[39px] rounded-[12px] shrink-0 max-[651px]:w-7.5 max-[651px]:h-8 ${ok ? "ok text-[#527e60] bg-[#edf4ed]" : "reflect text-[#987134] bg-[#fcf1df]"}`}
                    >
                      {ok ? <CheckCircle2 /> : <BookOpen />}
                    </span>
                    <span>
                      <span className="eyebrow text-[0.875rem] tracking-[1.7px] font-[750] leading-normal text-[#777180] uppercase">
                        {String(i + 1).padStart(2, "0")} · {pair.topic}
                      </span>
                      <strong>
                        {pair.reference.title} + {pair.dilemma.title}
                      </strong>
                    </span>
                    <span
                      className={`review-status text-[0.875rem] p-[6px_9px] rounded-[5px] max-w-full ${ok ? "ok text-[#527e60] bg-[#edf4ed]" : "reflect text-[#987134] bg-[#fcf1df]"}`}
                    >
                      {ok ? "Acertaram" : "Vamos refletir"}
                    </span>
                    <ChevronDown size={18} />
                  </summary>
                  <div className="review-body p-[0_24px_24px_73px] max-[651px]:p-[0_17px_20px]">
                    <h3>{pair.question.prompt}</h3>
                    <p>
                      <span className="muted text-muted">Sua escolha: </span>
                      {pair.question.options[answer - 1]}
                    </p>
                    {!ok && (
                      <p>
                        <strong>Resposta esperada: </strong>
                        {pair.question.options[pair.question.answer - 1]}
                      </p>
                    )}
                    <div className="explanation text-[1rem] leading-[1.8] [border-left:3px_solid_#d9c7ee] bg-[#f8f5fc] p-[13px_16px] text-[#776584] mt-[17px] rounded-[0_8px_8px_0]">
                      {pair.question.explanation}
                    </div>
                    {pair.sources.length > 0 && (
                      <div className="sources flex flex-col gap-1.5 text-[1rem] mt-[15px]">
                        <strong>Para saber mais</strong>
                        {pair.sources.map((s) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {s.title} ↗
                          </a>
                        ))}
                      </div>
                    )}
                    {[pair.reference, pair.dilemma]
                      .filter((c) => c.credit)
                      .map((c) => (
                        <p
                          className="small muted text-[1rem] leading-[1.6] text-muted"
                          key={c.title}
                        >
                          Crédito da imagem: {c.credit}
                        </p>
                      ))}
                  </div>
                </details>
              );
            })}
          </div>
          <div className="closing-note flex justify-center items-center gap-4.5 text-left mt-9.5 p-6 bg-[#eee8f6] rounded-[14px] text-[#7d6698] text-[1rem]">
            <MessageCircle />
            <p>
              <strong>A conversa continua fora do jogo.</strong>
              <br />
              Qual dessas escolhas vocês já encontraram no dia a dia?
            </p>
          </div>
        </main>
      )}
      <footer className="site-footer max-w-284 m-auto [border-top:1px_solid_var(--line)] p-[24px_0_30px] flex justify-between items-center gap-5 text-[0.875rem] text-[#918794] flex-wrap max-[651px]:[margin:0_20px] max-[651px]:gap-4.5 max-[651px]:pt-5.5 min-[651px]:max-[901px]:[margin:0_25px]">
        <span>
          entrepares<span className="brand-dot">.</span>{" "}
          <span className="footer-divider [margin:0_8px] text-[#c2b8ca]">
            /
          </span>{" "}
          Ética em Computação
        </span>
        <span>
          <ShieldCheck size={14} /> Sem coleta de dados pessoais
        </span>
        <a
          href="https://github.com/RickBarretto/exa615-ethics"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={15} /> Código aberto <ArrowRight size={14} />
        </a>
      </footer>
      {modal && (
        <Modal
          title={
            modal === "help"
              ? "Joguem juntos. Pensem juntos."
              : "Sobre o Entre Pares"
          }
          onClose={() => setModal(null)}
        >
          {modal === "help" ? (
            <Instructions />
          ) : (
            <>
              <p>
                Um jogo educativo de memória e reflexão para crianças e
                adolescentes, desenvolvido para a disciplina de Ética em
                Computação.
              </p>
              <p>
                Cada grupo joga uma partida independente, sem sincronização
                entre dispositivos. Não há cadastro, ranking nem envio de
                respostas a servidores. O progresso dura somente enquanto a
                partida está aberta.
              </p>
              <h3>Conteúdo em construção</h3>
              <p>
                As histórias deste baralho são autorais e demonstrativas. A
                equipe acadêmica definirá as referências culturais e revisará as
                perguntas antes de marcar o baralho como oficial.
              </p>
              <h3>Offline e acessibilidade</h3>
              <p>
                Após o primeiro carregamento completo, o jogo fica disponível
                offline neste navegador. Use teclado, toque ou mouse. As cartas
                ocultas não revelam seu conteúdo ao leitor de tela. Animações
                respeitam a preferência por movimento reduzido.
              </p>
              <p className="small muted text-[1rem] leading-[1.6] text-muted">
                A hospedagem pode processar registros técnicos de acesso. O
                aplicativo não usa analytics, fontes remotas ou cookies de
                rastreamento.
              </p>
              <a
                className="button secondary inline-flex justify-center items-center gap-5 min-h-[47px] rounded-[10px] p-[12px_21px] font-[650] text-[1rem] no-underline [border:1px_solid_transparent] [transition:background_.2s,transform_.2s]"
                href="https://github.com/RickBarretto/exa615-ethics"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={18} /> Código, créditos e contribuições
              </a>
            </>
          )}
        </Modal>
      )}
      {offlineReady && (
        <div
          className="toast fixed bottom-5 right-5 z-[5] bg-[#fff] [border:1px_solid_#e5dce9] shadow-[0_5px_25px_#47335424] flex items-center gap-2.5 p-[10px_15px] rounded-[12px] text-[1rem] max-w-[calc(100%_-_40px)] text-[#6e5d83] max-[651px]:bottom-[13px] max-[651px]:right-[13px] max-[651px]:max-w-[calc(100%_-_26px)]"
          role="status"
        >
          <WifiOff size={19} />
          <span>Pronto para jogar sem internet.</span>
          <button
            type="button"
            className="icon-button border-0 bg-transparent grid place-items-center w-9.5 h-9.5 rounded-[9px] text-[#8b7c9b] min-w-11"
            onClick={() => setOfflineReady(false)}
            aria-label="Fechar aviso offline"
          >
            <X size={17} />
          </button>
        </div>
      )}
      {needRefresh && (
        <div
          className="toast fixed bottom-5 right-5 z-[5] bg-[#fff] [border:1px_solid_#e5dce9] shadow-[0_5px_25px_#47335424] flex items-center gap-2.5 p-[10px_15px] rounded-[12px] text-[1rem] max-w-[calc(100%_-_40px)] text-[#6e5d83] max-[651px]:bottom-[13px] max-[651px]:right-[13px] max-[651px]:max-w-[calc(100%_-_26px)]"
          role="status"
        >
          <Download size={19} />
          <span>
            Uma nova versão está disponível.
            {screen === "game" ? " Conclua a partida para atualizar." : ""}
          </span>
          {screen !== "game" && (
            <button
              type="button"
              className="text-button inline-flex items-center gap-2 border-0 bg-transparent p-[10px_0] text-[1rem] font-semibold text-[#7b7186]"
              onClick={() => updateServiceWorker(true)}
            >
              Atualizar
            </button>
          )}
        </div>
      )}
    </>
  );
}
