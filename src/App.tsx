import { useState, useCallback, useRef, useEffect } from "react";
import BackgroundLayer from "@/layers/BackgroundLayer";
import TitleLayer from "@/layers/TitleLayer";
import CharacterLayer from "@/layers/CharacterLayer";
import IconLayer from "@/layers/IconLayer";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "home" | "intro" | "quiz" | "result";
type AnswerState = "idle" | "correct" | "wrong";

interface Question {
  text: string;
  answers: string[];
  correct: number;
  explanation: string;
  concept: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  teaches: string;
  unlockCost: number;
  accent: string;
  story: string;
  questions: Question[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CHARACTERS: Character[] = [
  {
    id: "lion",
    name: "Leo the Lion",
    role: "Market Chief",
    teaches: "Profit & Fair Trade",
    unlockCost: 0,
    accent: "#F5A623",
    story:
      "Leo runs the jungle's biggest market stall! He buys fruits cheap and sells them at a higher price. Help him figure out his profits!",
    questions: [
      {
        text: "Leo bought 10 mangoes for 2 coins each, then sold them all for 3 coins each. How much PROFIT did he make?",
        answers: ["5 coins", "10 coins", "20 coins", "30 coins"],
        correct: 1,
        explanation:
          "Profit = Earnings − Cost! He earned 30 coins but spent 20 coins… so profit = 10 coins! 🏆",
        concept: "PROFIT",
      },
      {
        text: "Leo sells bananas for 5 coins each, but they cost him 3 coins to buy. What is his profit per banana?",
        answers: ["8 coins", "5 coins", "3 coins", "2 coins"],
        correct: 3,
        explanation:
          "Profit per item = Sell price − Buy price. 5 − 3 = 2 coins profit per banana! 🍌",
        concept: "PROFIT PER ITEM",
      },
      {
        text: "What do we call the money Leo earns from selling things at the market?",
        answers: ["Expense", "Savings", "Income", "Debt"],
        correct: 2,
        explanation:
          "Income is money coming IN! When Leo sells things, that money is his income! 💰",
        concept: "INCOME",
      },
      {
        text: "Leo sold 5 pineapples for 4 coins each. He spent 10 coins buying them. What is his profit?",
        answers: ["20 coins", "5 coins", "15 coins", "10 coins"],
        correct: 3,
        explanation:
          "He earned 5×4 = 20 coins, spent 10 coins. Profit = 20 − 10 = 10 coins! 🍍",
        concept: "PROFIT",
      },
    ],
  },
  {
    id: "bear",
    name: "Barry Bear",
    role: "Honey & Berry Trader",
    teaches: "Income vs. Expenses",
    unlockCost: 50,
    accent: "#A0522D",
    story:
      "Barry collects honey and berries from the deep forest to sell at the market. He needs your help tracking what he earns and what he spends!",
    questions: [
      {
        text: "Barry earned 20 coins selling honey this week. Money that comes IN is called…?",
        answers: ["Expense", "Income", "Profit", "Savings"],
        correct: 1,
        explanation:
          "Income is ALL the money you earn! Barry earned 20 coins — that's his income! 🍯",
        concept: "INCOME",
      },
      {
        text: "Barry spent 5 coins on berry baskets and 3 coins on honey jars. These spending costs are called…?",
        answers: ["Income", "Savings", "Profit", "Expenses"],
        correct: 3,
        explanation:
          "Expenses are money going OUT! Every coin Barry spends on supplies is an expense! 🧺",
        concept: "EXPENSES",
      },
      {
        text: "Barry earns 15 coins from honey but spends 9 coins on supplies. How much does he have left?",
        answers: ["24 coins", "9 coins", "6 coins", "15 coins"],
        correct: 2,
        explanation:
          "Income − Expenses = Money left over! 15 − 9 = 6 coins kept! 🐻",
        concept: "INCOME − EXPENSES",
      },
      {
        text: "Barry made 30 coins in January and spent 22 coins on supplies. What is his net income?",
        answers: ["52 coins", "22 coins", "30 coins", "8 coins"],
        correct: 3,
        explanation:
          "Net Income = Income − Expenses. 30 − 22 = 8 coins! That's what Barry keeps! 🎉",
        concept: "NET INCOME",
      },
    ],
  },
  {
    id: "owl",
    name: "Ollie Owl",
    role: "Forest Bank Manager",
    teaches: "Deposits & Net Worth",
    unlockCost: 100,
    accent: "#6B4226",
    story:
      "Ollie manages the Forest Bank where animals keep their savings safe. He helps everyone understand deposits, withdrawals, and net worth!",
    questions: [
      {
        text: "Ollie has 50 coins in the bank. He deposits 20 more. How many coins does he have now?",
        answers: ["30 coins", "20 coins", "50 coins", "70 coins"],
        correct: 3,
        explanation:
          "Deposit means putting money IN the bank! 50 + 20 = 70 coins! 🏦",
        concept: "DEPOSIT",
      },
      {
        text: "What do we call taking money OUT of the bank?",
        answers: ["Deposit", "Saving", "Withdrawal", "Income"],
        correct: 2,
        explanation:
          "A withdrawal is taking money OUT of the bank. Deposit = in, Withdrawal = out! 💳",
        concept: "WITHDRAWAL",
      },
      {
        text: "Ollie had 80 coins and withdrew 35. How much is left in the bank?",
        answers: ["115 coins", "80 coins", "35 coins", "45 coins"],
        correct: 3,
        explanation:
          "Withdrawal lowers your balance! 80 − 35 = 45 coins left! 🦉",
        concept: "BALANCE",
      },
      {
        text: "Ollie has 60 coins in savings but owes 15 coins. What is his NET WORTH?",
        answers: ["75 coins", "60 coins", "15 coins", "45 coins"],
        correct: 3,
        explanation:
          "Net Worth = What you own − What you owe! 60 − 15 = 45 coins! 📊",
        concept: "NET WORTH",
      },
    ],
  },
  {
    id: "rabbit",
    name: "Ruby Rabbit",
    role: "Carrot Farm Seller",
    teaches: "Budgeting & Goals",
    unlockCost: 150,
    accent: "#5A9E5A",
    story:
      "Ruby grows carrots on her little farm and sells them at the jungle market. She plans every coin carefully with a budget — help her stay on track!",
    questions: [
      {
        text: "Ruby earns 20 coins. She wants to save 25% of it. How many coins should she save?",
        answers: ["10 coins", "25 coins", "15 coins", "5 coins"],
        correct: 3,
        explanation:
          "25% of 20 = 20 ÷ 4 = 5 coins! Ruby saves 5 coins from every 20 she earns! 🥕",
        concept: "PERCENTAGE SAVINGS",
      },
      {
        text: "Ruby has a budget of 30 coins for seeds. She spent 12 on carrot seeds and 10 on water. How much budget is left?",
        answers: ["22 coins", "10 coins", "18 coins", "8 coins"],
        correct: 3,
        explanation:
          "Budget left = 30 − 12 − 10 = 8 coins! Sticking to the budget is super important! 💼",
        concept: "BUDGET TRACKING",
      },
      {
        text: "What is a BUDGET?",
        answers: [
          "Money you earn",
          "Money you owe",
          "A plan for how to spend money",
          "Money in the bank",
        ],
        correct: 2,
        explanation:
          "A budget is a PLAN for your money — it shows how much you can spend on each thing! 📋",
        concept: "BUDGET",
      },
      {
        text: "Ruby wants to save 100 coins for a new cart. She saves 25 coins a week. How many weeks will it take?",
        answers: ["25 weeks", "10 weeks", "2 weeks", "4 weeks"],
        correct: 3,
        explanation:
          "Weeks needed = Goal ÷ Savings per week = 100 ÷ 25 = 4 weeks! Goals take planning! 🎯",
        concept: "SAVINGS GOALS",
      },
    ],
  },
  {
    id: "sheep",
    name: "Shelly Sheep",
    role: "Wool Market Seller",
    teaches: "Saving & Emergency Fund",
    unlockCost: 200,
    accent: "#7BAFD4",
    story:
      "Shelly shears her fluffy wool every season and sells it at the market. She is the most consistent saver in the whole jungle — she never skips a week!",
    questions: [
      {
        text: "Shelly saves 5 coins every week. After 8 weeks, how much has she saved?",
        answers: ["13 coins", "45 coins", "80 coins", "40 coins"],
        correct: 3,
        explanation:
          "5 coins × 8 weeks = 40 coins! Saving a little every week adds up BIG! 🐑",
        concept: "CONSISTENT SAVING",
      },
      {
        text: "Shelly puts coins aside for unexpected emergencies. What is this special stash called?",
        answers: ["A budget", "An emergency fund", "Income", "Profit"],
        correct: 1,
        explanation:
          "An emergency fund is money saved for surprise costs! It keeps you safe when things go wrong! 🛡️",
        concept: "EMERGENCY FUND",
      },
      {
        text: "Why is it great to save money consistently every week?",
        answers: [
          "To spend more later",
          "To avoid paying for things",
          "To build up money over time",
          "To earn more income",
        ],
        correct: 2,
        explanation:
          "Saving consistently builds your wealth over time — even tiny amounts grow into a lot! 🌱",
        concept: "WHY SAVE?",
      },
      {
        text: "Shelly earns 25 coins per month and saves 20% each month. How many coins does she save?",
        answers: ["20 coins", "25 coins", "10 coins", "5 coins"],
        correct: 3,
        explanation:
          "20% of 25 = 25 ÷ 5 = 5 coins saved per month! Small savings make big dreams come true! ✨",
        concept: "SAVINGS PERCENTAGE",
      },
    ],
  },
];

const HINT_CARDS = [
  {
    icon: "💰",
    title: "What is Income?",
    def: "Income is all the money you earn or receive — like coins from selling berries, or a gift from grandma!",
  },
  {
    icon: "🛒",
    title: "What is an Expense?",
    def: "An expense is money you spend — like buying seeds to grow carrots. It's money going OUT of your pocket!",
  },
  {
    icon: "📈",
    title: "What is Profit?",
    def: "Profit is what is left after you subtract expenses from income. Sell high, buy low = more profit in your pouch!",
  },
  {
    icon: "📋",
    title: "What is a Budget?",
    def: "A budget is a plan for your money! You decide in advance how much to spend on each thing, so you never run out.",
  },
  {
    icon: "🐷",
    title: "What is Saving?",
    def: "Saving means setting some money aside instead of spending it — so you can use it for something important or special later!",
  },
  {
    icon: "🏦",
    title: "What is a Bank?",
    def: "A bank is a safe place to keep your coins! You can deposit (put in) and withdraw (take out) whenever you need.",
  },
  {
    icon: "💎",
    title: "What is Net Worth?",
    def: "Net worth = everything you OWN minus everything you OWE. It tells you how truly wealthy you really are!",
  },
  {
    icon: "🍎",
    title: "Needs vs. Wants",
    def: "Needs are things you must have (food, shelter, water). Wants are nice extras (toys, candy). Always cover needs first!",
  },
  {
    icon: "📓",
    title: "Why Track Money?",
    def: "Tracking your money helps you make smart choices, avoid running out, and save up for your biggest dreams!",
  },
  {
    icon: "🪙",
    title: "Fun Fact!",
    def: "Long ago, people traded with shells, salt, and even giant stones instead of coins! Money has changed a LOT over history.",
  },
];

const GRADES = [
  { min: 4, label: "PERFECT!", emoji: "🌟", color: "#FFD700", coins: 25 },
  { min: 3, label: "GREAT!", emoji: "⭐", color: "#7BC67E", coins: 18 },
  { min: 2, label: "GOOD JOB!", emoji: "👍", color: "#87CEEB", coins: 12 },
  { min: 0, label: "KEEP GOING!", emoji: "💪", color: "#F5A623", coins: 8 },
];

const COIN_PER_CORRECT = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Confetti({ count = 40 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 1.8 + Math.random() * 1.2,
    color: ["#f5c518", "#ff6b9d", "#7bc67e", "#87ceeb", "#ff9944", "#cc88ff"][
      i % 6
    ],
    rotate: Math.random() * 360,
  }));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 80,
      }}
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function CoinPop({ x, y, amount }: { x: number; y: number; amount: number }) {
  return (
    <div className="coin-pop" style={{ left: x, top: y }}>
      +{amount}🪙
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [coins, setCoins] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>(["lion"]);
  const [muted, setMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintPage, setHintPage] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [charAnim, setCharAnim] = useState<"idle" | "bounce" | "shake">("idle");
  const [coinPops, setCoinPops] = useState<{ id: number; amount: number }[]>(
    [],
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showUnlock, setShowUnlock] = useState<Character | null>(null);

  const char = CHARACTERS[charIdx];
  const isLocked = !unlocked.includes(char.id);
  const coinPopRef = useRef(0);

  // ─── Audio Refs ────────────────────────────────────────────────────────────
  const bgMusicRef = useRef<HTMLAudioElement>(null!);
  const btnClickRef = useRef<HTMLAudioElement>(null!);
  const checkSoundRef = useRef<HTMLAudioElement>(null!);
  const wrongSoundRef = useRef<HTMLAudioElement>(null!);

  // ─── Play Sound Function ───────────────────────────────────────────────────
  const playSound = useCallback(
    (soundRef: React.RefObject<HTMLAudioElement>) => {
      if (!muted && soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(() => {
          // Silently handle autoplay restrictions
        });
      }
    },
    [muted],
  );

  // ─── Audio Elements ─────────────────────────────────────────────────────────
  // Rendered on every screen (each screen below returns independently, so this
  // must be included inside each returned tree rather than after it).
  const audioLayer = (
    <>
      <audio
        ref={bgMusicRef}
        src="/src/music/bgmusic.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
      <audio
        ref={btnClickRef}
        src="/src/music/btnClick.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
      <audio
        ref={checkSoundRef}
        src="/src/music/check.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
      <audio
        ref={wrongSoundRef}
        src="/src/music/wrong.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
    </>
  );

  // ─── Manage Background Music ───────────────────────────────────────────────
  useEffect(() => {
    if (!bgMusicRef.current) return;

    if (screen === "home" || screen === "quiz") {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.3;
      if (muted) {
        bgMusicRef.current.pause();
      } else {
        bgMusicRef.current.play().catch(() => {
          // Silently handle autoplay restrictions
        });
      }
    } else {
      bgMusicRef.current.pause();
    }
  }, [screen, muted]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const prevChar = () => {
    playSound(btnClickRef);
    setCharIdx((i) => (i - 1 + CHARACTERS.length) % CHARACTERS.length);
  };
  const nextChar = () => {
    playSound(btnClickRef);
    setCharIdx((i) => (i + 1) % CHARACTERS.length);
  };

  const handlePlay = () => {
    playSound(btnClickRef);
    if (isLocked) {
      showToast(`🔒 Need ${char.unlockCost} coins to unlock ${char.name}!`);
      return;
    }
    setQIdx(0);
    setSelected(null);
    setAnswerState("idle");
    setCorrectCount(0);
    setCharAnim("idle");
    setScreen("intro");
  };

  const startQuiz = () => {
    playSound(btnClickRef);
    setScreen("quiz");
  };

  const handleAnswer = (idx: number) => {
    if (answerState !== "idle") return;
    playSound(btnClickRef);
    const q = char.questions[qIdx];
    setSelected(idx);
    if (idx === q.correct) {
      playSound(checkSoundRef);
      setAnswerState("correct");
      setCorrectCount((c) => c + 1);
      setCharAnim("bounce");
      const newCoins = coins + COIN_PER_CORRECT;
      setCoins(newCoins);
      const popId = ++coinPopRef.current;
      setCoinPops((ps) => [...ps, { id: popId, amount: COIN_PER_CORRECT }]);
      setTimeout(
        () => setCoinPops((ps) => ps.filter((p) => p.id !== popId)),
        1000,
      );
      CHARACTERS.forEach((c) => {
        if (
          !unlocked.includes(c.id) &&
          c.unlockCost > 0 &&
          newCoins >= c.unlockCost
        ) {
          setTimeout(() => {
            setUnlocked((u) => (u.includes(c.id) ? u : [...u, c.id]));
            setShowUnlock(c);
          }, 800);
        }
      });
    } else {
      playSound(wrongSoundRef);
      setAnswerState("wrong");
      setCharAnim("shake");
    }
    setTimeout(() => setCharAnim("idle"), 600);
  };

  const handleNext = () => {
    playSound(btnClickRef);
    if (qIdx < char.questions.length - 1) {
      setQIdx((q) => q + 1);
      setSelected(null);
      setAnswerState("idle");
    } else {
      setShowConfetti(true);
      setScreen("result");
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const goHome = () => {
    playSound(btnClickRef);
    setScreen("home");
    setShowHint(false);
    setShowSettings(false);
  };

  // ─── HOME SCREEN ────────────────────────────────────────────────────────────
  if (screen === "home") {
    return (
      <div className="game-wrap">
        {audioLayer}
        {/* ── LAYER: background ── fills viewport, behind everything */}
        <BackgroundLayer />

        {/* Soft dark veil for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Full-height flex column, above background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* ── Top bar ── */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              flexShrink: 0,
            }}
          >
            <div className="coin-pill">
              <span style={{ fontSize: 20 }}>🪙</span>
              <span>{coins}</span>
            </div>
            <button
              className="gold-btn"
              style={{ width: 50, height: 50 }}
              onClick={() => {
                playSound(btnClickRef);
                setShowSettings(true);
              }}
              aria-label="Settings"
            >
              {/* ── LAYER: icon_settings ── */}
              <IconLayer icon="settings" size={22} />
            </button>
          </div>

          {/* ── LAYER: title — wood-sign logo, top-center, anchored independently ── */}
          <div
            style={{
              flexShrink: 0,
              marginTop: "1.5vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TitleLayer />
          </div>

          {/* ── Character stage — flex-1 fills remaining space ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: 0,
              gap: "clamp(4px,2vw,16px)",
              padding: "0 clamp(4px,1.5vw,14px)",
            }}
          >
            {/* ── LAYER: icon_left ── */}
            <button
              className="arrow-btn"
              style={{ width: 68, height: 68, flexShrink: 0 }}
              onClick={prevChar}
              aria-label="Previous character"
            >
              <IconLayer icon="left" size={30} />
            </button>

            {/* ── LAYER: character_* — one per animal, only active one shown ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                position: "relative",
              }}
            >
              <CharacterLayer
                characterId={char.id}
                size="clamp(266px, 42vh, 364px)"
                locked={isLocked}
              />
              {isLocked && (
                <div
                  style={{
                    position: "absolute",
                    top: "38%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    pointerEvents: "none",
                  }}
                >
                  <span style={{ fontSize: 38 }}>🔒</span>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.8)",
                      border: "2px solid #f5c518",
                      borderRadius: 20,
                      padding: "3px 12px",
                      color: "#f5c518",
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {char.unlockCost} 🪙
                  </div>
                </div>
              )}
              <div
                style={{
                  background: "rgba(0,0,0,0.68)",
                  border: "2px solid rgba(245,197,24,0.75)",
                  borderRadius: 20,
                  padding: "3px 16px",
                  color: "white",
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(13px,2.5vw,17px)",
                }}
              >
                {char.name}
              </div>
            </div>

            {/* ── LAYER: icon_right ── */}
            <button
              className="arrow-btn"
              style={{ width: 68, height: 68, flexShrink: 0 }}
              onClick={nextChar}
              aria-label="Next character"
            >
              <IconLayer icon="right" size={30} />
            </button>
          </div>

          {/* ── Bottom buttons ── */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: "0 24px 24px",
              flexShrink: 0,
            }}
          >
            <button
              className="gold-btn"
              style={{ width: 99, height: 99 }}
              onClick={() => {
                playSound(btnClickRef);
                setHintPage(0);
                setShowHint(true);
              }}
              aria-label="Hint"
            >
              {/* ── LAYER: icon_hint ── */}
              <IconLayer icon="hint" size={30} />
              <span
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 15,
                  color: "#5a3e08",
                  lineHeight: 1,
                }}
              >
                HINT
              </span>
            </button>
            <button
              className="gold-btn"
              style={{ width: 99, height: 99 }}
              onClick={handlePlay}
              aria-label="Play"
            >
              {/* ── LAYER: icon_play ── */}
              <IconLayer
                icon="play"
                size={32}
                color={isLocked ? "#5a3e08" : "#ff6b9d"}
              />
              <span
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 15,
                  color: "#5a3e08",
                  lineHeight: 1,
                }}
              >
                PLAY
              </span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}

        {/* Hint Modal */}
        {showHint && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 50,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              className="wood-panel slide-up"
              style={{
                width: "100%",
                padding: 20,
                borderRadius: "20px 20px 0 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    color: "#f5c518",
                    fontSize: 20,
                  }}
                >
                  📚 Accounting Basics
                </span>
                <button
                  onClick={() => {
                    playSound(btnClickRef);
                    setShowHint(false);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    borderRadius: "50%",
                    width: 34,
                    height: 34,
                    cursor: "pointer",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: 20,
                  minHeight: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 48 }}>
                  {HINT_CARDS[hintPage].icon}
                </span>
                <div
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    color: "#f5c518",
                    fontSize: 18,
                  }}
                >
                  {HINT_CARDS[hintPage].title}
                </div>
                <div
                  style={{
                    color: "#fdf6dc",
                    fontSize: 14,
                    lineHeight: 1.55,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {HINT_CARDS[hintPage].def}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                  margin: "14px 0 10px",
                }}
              >
                {HINT_CARDS.map((_, i) => (
                  <button
                    key={i}
                    className={`dot${i === hintPage ? " active" : ""}`}
                    onClick={() => {
                      playSound(btnClickRef);
                      setHintPage(i);
                    }}
                    style={{ border: "none", cursor: "pointer", padding: 0 }}
                    aria-label={`Card ${i + 1}`}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 12,
                    border: "2px solid rgba(255,255,255,0.25)",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: hintPage === 0 ? "default" : "pointer",
                    opacity: hintPage === 0 ? 0.4 : 1,
                  }}
                  onClick={() => {
                    playSound(btnClickRef);
                    setHintPage((p) => Math.max(0, p - 1));
                  }}
                  disabled={hintPage === 0}
                >
                  ◀ Back
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 12,
                    border: "2px solid #f5c518",
                    background: "linear-gradient(145deg,#f5c518,#c78c00)",
                    color: "#3a2000",
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    playSound(btnClickRef);
                    if (hintPage < HINT_CARDS.length - 1) {
                      setHintPage((p) => p + 1);
                    } else {
                      setShowHint(false);
                    }
                  }}
                >
                  {hintPage < HINT_CARDS.length - 1 ? "Next ▶" : "Got it! ✓"}
                </button>
              </div>
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  fontFamily: "'Nunito',sans-serif",
                  marginTop: 8,
                }}
              >
                {hintPage + 1} / {HINT_CARDS.length}
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <div
              className="wood-panel fade-in"
              style={{ width: "100%", maxWidth: 340, padding: 24 }}
            >
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  color: "#f5c518",
                  fontSize: 22,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                ⚙️ Settings
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  {/* ── LAYER: icon_mute / icon_speaker ── */}
                  <span
                    style={{
                      color: "white",
                      fontFamily: "'Nunito',sans-serif",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <IconLayer
                      icon={muted ? "mute" : "speaker"}
                      size={18}
                      color="white"
                    />
                    {muted ? "Sound Off" : "Sound On"}
                  </span>
                  <button
                    onClick={() => {
                      setMuted((m) => {
                        const next = !m;
                        // Only confirm with a click when sound is turning ON
                        if (!next && btnClickRef.current) {
                          btnClickRef.current.currentTime = 0;
                          btnClickRef.current.play().catch(() => {});
                        }
                        return next;
                      });
                    }}
                    style={{
                      width: 52,
                      height: 28,
                      borderRadius: 14,
                      background: muted ? "#555" : "#3a9e3a",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 3,
                        left: muted ? 4 : 24,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s",
                      }}
                    />
                  </button>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      color: "white",
                      fontFamily: "'Nunito',sans-serif",
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    🪙 Total Coins: {coins}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 12,
                      fontFamily: "'Nunito',sans-serif",
                    }}
                  >
                    Unlocked: {unlocked.length} / {CHARACTERS.length} characters
                  </div>
                </div>
                <button
                  style={{
                    padding: "11px 0",
                    borderRadius: 12,
                    border: "2px solid #9e3a3a",
                    background: "linear-gradient(145deg,#9e3a3a,#6e1e1e)",
                    color: "white",
                    fontFamily: "'Nunito',sans-serif",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                  onClick={() => {
                    playSound(btnClickRef);
                    if (confirm("Reset all progress? This cannot be undone.")) {
                      setCoins(0);
                      setUnlocked(["lion"]);
                      setCharIdx(0);
                      setShowSettings(false);
                    }
                  }}
                >
                  🔄 Reset Progress
                </button>
              </div>
              <button
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "12px 0",
                  borderRadius: 12,
                  border: "2px solid #f5c518",
                  background: "linear-gradient(145deg,#f5c518,#c78c00)",
                  color: "#3a2000",
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => {
                  playSound(btnClickRef);
                  setShowSettings(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Unlock celebration */}
        {showUnlock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <Confetti count={50} />
            <div
              className="wood-panel fade-in unlock-pulse"
              style={{
                padding: 28,
                textAlign: "center",
                maxWidth: 320,
                zIndex: 70,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  color: "#f5c518",
                  fontFamily: "'Fredoka One', cursive",
                  marginBottom: 10,
                }}
              >
                🎉 NEW CHARACTER UNLOCKED!
              </div>
              <CharacterLayer characterId={showUnlock.id} size={120} />
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  color: "#f5c518",
                  fontSize: 22,
                  marginTop: 10,
                }}
              >
                {showUnlock.name}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                  fontFamily: "'Nunito',sans-serif",
                  marginTop: 4,
                }}
              >
                {showUnlock.role}
              </div>
              <button
                style={{
                  marginTop: 18,
                  padding: "12px 32px",
                  borderRadius: 12,
                  border: "2px solid #f5c518",
                  background: "linear-gradient(145deg,#f5c518,#c78c00)",
                  color: "#3a2000",
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => {
                  playSound(btnClickRef);
                  setShowUnlock(null);
                }}
              >
                Awesome! 🌟
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── INTRO SCREEN ────────────────────────────────────────────────────────────
  if (screen === "intro") {
    return (
      <div className="game-wrap">
        {audioLayer}
        {/* ── LAYER: background ── */}
        <BackgroundLayer />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1,
          }}
        />

        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 20 }}>
          <button
            className="gold-btn"
            style={{ width: 46, height: 46 }}
            onClick={goHome}
            aria-label="Back to home"
          >
            {/* ── LAYER: icon_home ── */}
            <IconLayer icon="home" size={20} />
          </button>
        </div>
        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 20 }}>
          <div className="coin-pill">
            <span style={{ fontSize: 18 }}>🪙</span>
            <span>{coins}</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px 24px",
            zIndex: 10,
          }}
          className="fade-in"
        >
          {/* ── LAYER: character_* ── */}
          <CharacterLayer
            characterId={char.id}
            size={240}
            style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))" }}
          />
          <div
            className="wood-panel"
            style={{
              marginTop: 16,
              padding: "20px 22px",
              textAlign: "center",
              width: "100%",
              maxWidth: 360,
            }}
          >
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: "#f5c518",
                fontSize: 22,
                marginBottom: 4,
              }}
            >
              {char.name}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                fontFamily: "'Nunito',sans-serif",
                fontWeight: 700,
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {char.role} · {char.teaches}
            </div>
            <div
              style={{
                color: "#fdf6dc",
                fontSize: 21,
                lineHeight: 1.6,
                fontFamily: "'Nunito',sans-serif",
                fontWeight: 700,
              }}
            >
              {char.story}
            </div>
          </div>
          <button
            onClick={startQuiz}
            style={{
              marginTop: 20,
              padding: "22px 72px",
              borderRadius: 50,
              border: "3px solid #7a5610",
              background: "linear-gradient(145deg,#ffe066,#f5c518,#c78c00)",
              color: "#3a2000",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 30,
              cursor: "pointer",
              boxShadow: "0 5px 0 #5a3e08, 0 7px 16px rgba(0,0,0,0.4)",
            }}
          >
            {"Let's Go! 🚀"}
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ SCREEN ─────────────────────────────────────────────────────────────
  if (screen === "quiz") {
    const q = char.questions[qIdx];

    return (
      <div className="game-wrap">
        {audioLayer}
        {/* ── LAYER: background ── */}
        <BackgroundLayer />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1,
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            className="gold-btn"
            style={{ width: 42, height: 42 }}
            onClick={goHome}
            aria-label="Home"
          >
            {/* ── LAYER: icon_home ── */}
            <IconLayer icon="home" size={18} />
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {char.questions.map((_, i) => (
              <div
                key={i}
                className={`step-dot ${i < qIdx ? "done" : i === qIdx ? "current" : "future"}`}
              />
            ))}
          </div>
          <div className="coin-pill" style={{ fontSize: 15 }}>
            <span style={{ fontSize: 16 }}>🪙</span>
            <span>{coins}</span>
          </div>
        </div>

        {/* Character + speech bubble */}
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          {answerState !== "idle" && (
            <div
              className={`bubble ${answerState === "correct" ? "correct-bubble" : "wrong-bubble"} fade-in`}
              style={{ maxWidth: 320, marginBottom: 8, fontSize: 14 }}
            >
              {answerState === "correct" ? "✅ " : "💭 "}
              {q.explanation}
              <div
                className={`bubble-tail ${answerState === "correct" ? "correct-bubble" : "wrong-bubble"}`}
              />
            </div>
          )}
          <div style={{ position: "relative" }}>
            {/* ── LAYER: character_* ── */}
            <CharacterLayer
              characterId={char.id}
              size={320}
              animClass={charAnim !== "idle" ? charAnim : ""}
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
            />
            {coinPops.map((p) => (
              <CoinPop key={p.id} x={30} y={0} amount={p.amount} />
            ))}
          </div>
          {answerState !== "idle" && (
            <div
              style={{
                background:
                  answerState === "correct"
                    ? "rgba(58,158,58,0.9)"
                    : "rgba(158,58,58,0.9)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: 20,
                padding: "3px 12px",
                color: "white",
                fontFamily: "'Fredoka One', cursive",
                fontSize: 12,
                marginTop: 4,
                letterSpacing: 0.5,
              }}
            >
              {answerState === "correct" ? "🌟" : "📘"} {q.concept}
            </div>
          )}
        </div>

        {/* Question + answers panel */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 15,
          }}
        >
          <div
            className="wood-panel"
            style={{
              borderRadius: "18px 18px 0 0",
              padding: "18px 18px 20px",
              //maxWidth: 560,

              margin: "0 auto",
            }}
          >
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                color: "#fdf6dc",
                fontSize: 22,
                lineHeight: 1.55,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Q{qIdx + 1}: {q.text}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {q.answers.map((answer, i) => {
                let cls = "ans-btn";
                if (answerState !== "idle") {
                  if (i === q.correct) cls += " reveal";
                  else if (i === selected && answerState === "wrong")
                    cls += " wrong";
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={answerState !== "idle"}
                    style={{
                      minHeight: 88,
                      display: "flex",
                      alignItems: "center",
                      padding: "18px 20px",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        marginRight: 10,
                        fontFamily: "'Fredoka One',cursive",
                        fontSize: 22,
                      }}
                    >
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    <span style={{ lineHeight: 1.45, fontSize: 20 }}>
                      {answer}
                    </span>
                  </button>
                );
              })}
            </div>

            {answerState !== "idle" && (
              <button
                onClick={handleNext}
                className="fade-in"
                style={{
                  width: "100%",
                  marginTop: 14,
                  padding: "13px 0",
                  borderRadius: 14,
                  border: "3px solid #7a5610",
                  background: "linear-gradient(145deg,#ffe066,#f5c518,#c78c00)",
                  color: "#3a2000",
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 17,
                  cursor: "pointer",
                  boxShadow: "0 4px 0 #5a3e08",
                }}
              >
                {qIdx < char.questions.length - 1
                  ? "Next Question ▶"
                  : "See Results 🏆"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULT SCREEN ───────────────────────────────────────────────────────────
  if (screen === "result") {
    const g = GRADES.find((gr) => correctCount >= gr.min)!;
    return (
      <div className="game-wrap">
        {audioLayer}
        {/* ── LAYER: background ── */}
        <BackgroundLayer />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        />
        {showConfetti && <Confetti count={60} />}

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 10,
          }}
          className="fade-in"
        >
          {/* ── LAYER: character_* ── */}
          <CharacterLayer
            characterId={char.id}
            size={130}
            animClass="bounce"
            style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))" }}
          />

          <div
            className="wood-panel"
            style={{
              marginTop: 16,
              padding: "20px 28px",
              textAlign: "center",
              width: "100%",
              maxWidth: 360,
            }}
          >
            <div style={{ fontSize: 52 }}>{g.emoji}</div>
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 28,
                color: g.color,
                marginTop: 4,
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              {g.label}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.8)",
                fontFamily: "'Nunito',sans-serif",
                fontWeight: 700,
                fontSize: 15,
                marginTop: 6,
              }}
            >
              {correctCount} / {char.questions.length} correct
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                margin: "12px 0 8px",
              }}
            >
              {char.questions.map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 28,
                    opacity: i < correctCount ? 1 : 0.25,
                    filter: i < correctCount ? "none" : "grayscale(1)",
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div
              style={{
                background: "rgba(245,197,24,0.15)",
                border: "2px solid rgba(245,197,24,0.4)",
                borderRadius: 12,
                padding: "10px 16px",
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "#f5c518",
                fontFamily: "'Fredoka One', cursive",
                fontSize: 18,
              }}
            >
              <span>🪙</span>
              <span>+{correctCount * COIN_PER_CORRECT} coins earned!</span>
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                fontFamily: "'Nunito',sans-serif",
                marginTop: 4,
              }}
            >
              Total: {coins} coins
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 18,
              width: "100%",
              maxWidth: 360,
            }}
          >
            <button
              onClick={goHome}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 14,
                border: "3px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                fontFamily: "'Fredoka One', cursive",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {/* ── LAYER: icon_home ── */}
              🏠 Jungle
            </button>
            <button
              onClick={() => {
                playSound(btnClickRef);
                setQIdx(0);
                setSelected(null);
                setAnswerState("idle");
                setCorrectCount(0);
                setCharAnim("idle");
                setScreen("quiz");
              }}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 14,
                border: "3px solid #7a5610",
                background: "linear-gradient(145deg,#ffe066,#f5c518,#c78c00)",
                color: "#3a2000",
                fontFamily: "'Fredoka One', cursive",
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 4px 0 #5a3e08",
              }}
            >
              ▶ Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Unreachable: `screen` is a 4-value union and every value is handled above.
  return null;
}
