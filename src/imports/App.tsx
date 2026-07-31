import { useState, useEffect, useCallback, useRef } from "react";
import lionImg from "@/imports/lion.png";
import bearImg from "@/imports/bear.png";
import owlImg from "@/imports/owl.png";
import rabbitImg from "@/imports/rabbit.png";
import sheepImg from "@/imports/sheep.png";
import homeBg from "@/imports/play.png";
import playBg from "@/imports/play.png";

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
  img: string;
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
    img: lionImg,
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
    img: bearImg,
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
    img: owlImg,
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
    img: rabbitImg,
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
    img: sheepImg,
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

  // Quiz state
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

  // ── Toast helper ──
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // ── Navigation ──
  const prevChar = () =>
    setCharIdx((i) => (i - 1 + CHARACTERS.length) % CHARACTERS.length);
  const nextChar = () => setCharIdx((i) => (i + 1) % CHARACTERS.length);

  const handlePlay = () => {
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

  const startQuiz = () => setScreen("quiz");

  const handleAnswer = (idx: number) => {
    if (answerState !== "idle") return;
    const q = char.questions[qIdx];
    setSelected(idx);
    if (idx === q.correct) {
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
      // Check unlocks
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
      setAnswerState("wrong");
      setCharAnim("shake");
    }
    setTimeout(() => setCharAnim("idle"), 600);
  };

  const handleNext = () => {
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
    setScreen("home");
    setShowHint(false);
    setShowSettings(false);
  };

  const grade = GRADES.find((g) => correctCount >= g.min)!;

  // ─── Screens ────────────────────────────────────────────────────────────────

  // HOME SCREEN
  if (screen === "home") {
    const charSize = "clamp(190px, 30vh, 260px)";
    return (
      <div className="game-wrap">
        {/* Background — full viewport cover, no container clipping */}
        <img
          src={homeBg}
          alt="Jungle"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Soft dark veil for contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Full-height flex column overlay */}
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
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
            >
              <span style={{ fontSize: 22 }}>⚙️</span>
            </button>
          </div>

          {/* ── Wood-sign title ── */}
          <div style={{ flexShrink: 0, marginTop: "1.5vh" }}>
            <div
              style={{
                background:
                  "linear-gradient(180deg, #a07040 0%, #7a4f2c 45%, #5e3a1e 100%)",
                border: "4px solid #3d2210",
                borderRadius: 18,
                padding: "clamp(8px,1.5vh,14px) clamp(18px,4vw,36px)",
                textAlign: "center",
                boxShadow:
                  "0 6px 0 #2a1508, 0 10px 28px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)",
                position: "relative",
              }}
            >
              {/* Decorative vine accents */}
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  left: 10,
                  fontSize: 18,
                  opacity: 0.9,
                }}
              >
                🍃
              </span>
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: 10,
                  fontSize: 18,
                  opacity: 0.9,
                  transform: "scaleX(-1)",
                }}
              >
                🍃
              </span>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(22px, 5vw, 40px)",
                  color: "#f5c518",
                  textShadow:
                    "2px 2px 0 #3a2000, -1px -1px 0 #3a2000, 1px -1px 0 #3a2000, -1px 1px 0 #3a2000",
                  lineHeight: 1.1,
                }}
              >
                Accounting
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(13px, 2.5vw, 22px)",
                  color: "#fdf6dc",
                  lineHeight: 1.0,
                  opacity: 0.9,
                }}
              >
                on
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "clamp(28px, 6.5vw, 52px)",
                  color: "#7bc67e",
                  textShadow:
                    "2px 2px 0 #1a4a1a, -1px -1px 0 #1a4a1a, 1px -1px 0 #1a4a1a, -1px 1px 0 #1a4a1a",
                  lineHeight: 1.05,
                }}
              >
                Jungle
              </div>
            </div>
          </div>

          {/* ── Character stage — flex-1 so it fills remaining space ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: 0,
              gap: "clamp(8px,3vw,24px)",
              padding: "0 clamp(8px,2vw,20px)",
            }}
          >
            {/* Left arrow */}
            <button
              className="arrow-btn"
              style={{ width: 52, height: 52, flexShrink: 0 }}
              onClick={prevChar}
              aria-label="Previous character"
            >
              <span style={{ fontSize: 24, color: "#5a3e08" }}>◀</span>
            </button>

            {/* Character — single image, transparent PNG, no wrapper background */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                position: "relative",
              }}
            >
              <img
                src={char.img}
                alt={char.name}
                style={{
                  width: charSize,
                  height: charSize,
                  objectFit: "contain",
                  background: "transparent",
                  filter: isLocked
                    ? "grayscale(100%) brightness(0.3) drop-shadow(0 6px 16px rgba(0,0,0,0.5))"
                    : "drop-shadow(0 6px 18px rgba(0,0,0,0.55))",
                  transition: "filter 0.3s, width 0.2s",
                  display: "block",
                }}
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
              {/* Name label */}
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

            {/* Right arrow */}
            <button
              className="arrow-btn"
              style={{ width: 52, height: 52, flexShrink: 0 }}
              onClick={nextChar}
              aria-label="Next character"
            >
              <span style={{ fontSize: 24, color: "#5a3e08" }}>▶</span>
            </button>
          </div>

          {/* ── Bottom buttons ── */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: "0 20px 24px",
              flexShrink: 0,
            }}
          >
            <button
              className="gold-btn"
              style={{ width: 76, height: 76 }}
              onClick={() => {
                setHintPage(0);
                setShowHint(true);
              }}
              aria-label="Hint"
            >
              <span style={{ fontSize: 24 }}>💡</span>
              <span
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 13,
                  color: "#5a3e08",
                  lineHeight: 1,
                }}
              >
                HINT
              </span>
            </button>
            <button
              className="gold-btn"
              style={{ width: 76, height: 76 }}
              onClick={handlePlay}
              aria-label="Play"
            >
              <span
                style={{
                  fontSize: 26,
                  color: isLocked ? "#5a3e08" : "#ff6b9d",
                }}
              >
                ▶
              </span>
              <span
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 13,
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
                  onClick={() => setShowHint(false)}
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

              {/* Card */}
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

              {/* Dots */}
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
                    onClick={() => setHintPage(i)}
                    style={{ border: "none", cursor: "pointer", padding: 0 }}
                    aria-label={`Card ${i + 1}`}
                  />
                ))}
              </div>

              {/* Nav */}
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
                  onClick={() => setHintPage((p) => Math.max(0, p - 1))}
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
                  onClick={() =>
                    hintPage < HINT_CARDS.length - 1
                      ? setHintPage((p) => p + 1)
                      : setShowHint(false)
                  }
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
                  <span
                    style={{
                      color: "white",
                      fontFamily: "'Nunito',sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {muted ? "🔇 Sound Off" : "🔊 Sound On"}
                  </span>
                  <button
                    onClick={() => setMuted((m) => !m)}
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
                onClick={() => setShowSettings(false)}
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
              <img
                src={showUnlock.img}
                alt={showUnlock.name}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  margin: "0 auto 10px",
                  display: "block",
                }}
              />
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  color: "#f5c518",
                  fontSize: 22,
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
                onClick={() => setShowUnlock(null)}
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
        <img
          src={playBg}
          alt="Jungle"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />

        {/* Back */}
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 20 }}>
          <button
            className="gold-btn"
            style={{ width: 46, height: 46 }}
            onClick={goHome}
            aria-label="Back to home"
          >
            <span style={{ fontSize: 20 }}>🏠</span>
          </button>
        </div>

        {/* Coins */}
        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 20 }}>
          <div className="coin-pill">
            <span style={{ fontSize: 18 }}>🪙</span>
            <span>{coins}</span>
          </div>
        </div>

        {/* Content */}
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
          <img
            src={char.img}
            alt={char.name}
            style={{
              width: 160,
              height: 160,
              objectFit: "contain",
              filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))",
            }}
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
                fontSize: 14,
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
              padding: "15px 48px",
              borderRadius: 50,
              border: "3px solid #7a5610",
              background: "linear-gradient(145deg,#ffe066,#f5c518,#c78c00)",
              color: "#3a2000",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 20,
              cursor: "pointer",
              boxShadow: "0 5px 0 #5a3e08, 0 7px 16px rgba(0,0,0,0.4)",
              transition: "transform 0.08s",
            }}
          >
            Let's Go! 🚀
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
        <img
          src={playBg}
          alt="Jungle"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
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
            <span style={{ fontSize: 18 }}>🏠</span>
          </button>

          {/* Step dots */}
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
              style={{ maxWidth: 300, marginBottom: 8 }}
            >
              {answerState === "correct" ? "✅ " : "💭 "}
              {q.explanation}
              <div
                className={`bubble-tail ${answerState === "correct" ? "correct-bubble" : "wrong-bubble"}`}
              />
            </div>
          )}

          <div style={{ position: "relative" }}>
            <img
              src={char.img}
              alt={char.name}
              className={
                charAnim === "bounce"
                  ? "bounce"
                  : charAnim === "shake"
                    ? "shake"
                    : ""
              }
              style={{
                width: 110,
                height: 110,
                objectFit: "contain",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
              }}
            />
            {/* Coin pops */}
            {coinPops.map((p) => (
              <CoinPop key={p.id} x={30} y={0} amount={p.amount} />
            ))}
          </div>

          {/* Concept badge */}
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
            padding: "0 0 0 0",
          }}
        >
          <div
            className="wood-panel"
            style={{ borderRadius: "18px 18px 0 0", padding: "18px 18px 20px" }}
          >
            {/* Question */}
            <div
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                color: "#fdf6dc",
                fontSize: 15,
                lineHeight: 1.5,
                marginBottom: 14,
                textAlign: "center",
              }}
            >
              Q{qIdx + 1}: {q.text}
            </div>

            {/* Answers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {q.answers.map((ans, i) => {
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
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        marginRight: 6,
                        fontFamily: "'Fredoka One',cursive",
                      }}
                    >
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    {ans}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
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
        <img
          src={playBg}
          alt="Jungle"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
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
          <img
            src={char.img}
            alt={char.name}
            className="bounce"
            style={{
              width: 130,
              height: 130,
              objectFit: "contain",
              filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))",
            }}
          />

          {/* Grade banner */}
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

            {/* Stars */}
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

            {/* Coins earned */}
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

          {/* Buttons */}
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
              🏠 Jungle
            </button>
            <button
              onClick={() => {
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

  return null;
}
