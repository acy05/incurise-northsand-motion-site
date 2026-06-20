import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDown, ArrowUp, Menu, Plus, X } from "lucide-react";
import "./styles.css";

type Scene = {
  id: string;
  nav: string;
  title: string;
  english: string;
  body: string;
  accent: string;
  accent2: string;
  deep: string;
  art: "orbit" | "stack" | "bridge" | "shield" | "people" | "spark";
};

const scenes: Scene[] = [
  {
    id: "company",
    nav: "COMPANY",
    title: "挑戦の入口を、事業の現場に増やす。",
    english: "Open the first move.",
    body:
      "Incurise は、Web、AI、業務設計をひとつの実装ラインでつなぎ、事業が次の一歩を踏み出すための体験をつくります。",
    accent: "#f36f21",
    accent2: "#44b4a3",
    deep: "#1b1b1b",
    art: "orbit",
  },
  {
    id: "philosophy",
    nav: "PHILOSOPHY",
    title: "思想を、使われる仕組みに変える。",
    english: "Make values operational.",
    body:
      "見た目だけで終わらせず、判断・行動・改善が回る構造まで落とし込む。理念を毎日の仕事に届く形へ翻訳します。",
    accent: "#f7b733",
    accent2: "#4b7bec",
    deep: "#22263a",
    art: "stack",
  },
  {
    id: "service",
    nav: "SERVICE",
    title: "サイト制作から、AI活用まで一気通貫で。",
    english: "Design, build, automate.",
    body:
      "LP、コーポレートサイト、予約導線、業務アプリ、生成AI活用まで。必要な機能を小さく始め、運用に合わせて伸ばします。",
    accent: "#2f9e44",
    accent2: "#ff7a90",
    deep: "#14291e",
    art: "bridge",
  },
  {
    id: "works",
    nav: "WORKS",
    title: "成果物は、公開後の改善まで含めて考える。",
    english: "Launch is the start line.",
    body:
      "納品して終わりではなく、ユーザーの反応・問い合わせ・運用負荷を読み、次の改善が見える設計にします。",
    accent: "#00a6d6",
    accent2: "#f36f21",
    deep: "#102d38",
    art: "shield",
  },
  {
    id: "recruit",
    nav: "RECRUIT",
    title: "一緒に、作れる人を増やす。",
    english: "Grow builders together.",
    body:
      "技術と事業の距離を縮め、実装で価値を出せるチームへ。小さな検証を積み上げる文化を大切にしています。",
    accent: "#8e5cf7",
    accent2: "#37c871",
    deep: "#231c39",
    art: "people",
  },
  {
    id: "contact",
    nav: "CONTACT",
    title: "相談を、次の実験に変える。",
    english: "Turn the question into a test.",
    body:
      "要件が固まっていなくても大丈夫です。現状、目的、制約を整理し、まず動かせる最短の形から提案します。",
    accent: "#ff5f57",
    accent2: "#00c2a8",
    deep: "#321d1c",
    art: "spark",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDate() {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("/", ".");
}

function SceneArt({ type }: { type: Scene["art"] }) {
  return (
    <svg className={`scene-art scene-art--${type}`} viewBox="0 0 520 360" role="img" aria-label="">
      <defs>
        <linearGradient id={`grad-${type}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent2)" />
        </linearGradient>
        <filter id={`soft-${type}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      {type === "orbit" && (
        <>
          <circle cx="260" cy="178" r="96" fill="none" stroke="url(#grad-orbit)" strokeWidth="22" />
          <path d="M84 236c78-94 256-123 352-60" fill="none" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
          <circle cx="344" cy="117" r="42" fill="var(--accent2)" />
          <circle cx="164" cy="247" r="28" fill="var(--accent)" />
          <rect x="216" y="142" width="88" height="72" rx="14" fill="var(--paper)" stroke="var(--ink)" strokeWidth="10" />
        </>
      )}
      {type === "stack" && (
        <>
          {[0, 1, 2, 3].map((item) => (
            <g key={item} transform={`translate(${120 + item * 42} ${70 + item * 36}) rotate(${-8 + item * 4})`}>
              <rect width="214" height="76" rx="16" fill={item % 2 ? "var(--accent2)" : "var(--accent)"} />
              <path d="M34 40h142" stroke="var(--paper)" strokeWidth="12" strokeLinecap="round" opacity=".8" />
            </g>
          ))}
          <path d="M83 282h354" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
        </>
      )}
      {type === "bridge" && (
        <>
          <path d="M74 240c70-105 126-105 185 0 63-113 120-112 187 0" fill="none" stroke="url(#grad-bridge)" strokeWidth="28" strokeLinecap="round" />
          <path d="M82 248h360" stroke="var(--ink)" strokeWidth="14" strokeLinecap="round" />
          <circle cx="122" cy="216" r="28" fill="var(--accent2)" />
          <circle cx="398" cy="216" r="28" fill="var(--accent)" />
          <path d="M160 110h200M190 150h140" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
        </>
      )}
      {type === "shield" && (
        <>
          <path d="M260 54 402 104v92c0 78-57 124-142 152-85-28-142-74-142-152v-92z" fill="url(#grad-shield)" />
          <path d="m198 184 44 44 92-108" fill="none" stroke="var(--paper)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M128 298h264" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
        </>
      )}
      {type === "people" && (
        <>
          {[132, 260, 388].map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy={112 + (i % 2) * 20} r="36" fill={i === 1 ? "var(--accent)" : "var(--accent2)"} />
              <path d={`M${cx - 62} ${238 + i * 4}c14-63 110-63 124 0`} fill="none" stroke="var(--ink)" strokeWidth="18" strokeLinecap="round" />
            </g>
          ))}
          <path d="M98 288h324" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
        </>
      )}
      {type === "spark" && (
        <>
          <path d="M260 54 286 146l90-28-64 70 76 56-94 4-34 86-32-86-96-4 78-56-66-70 90 28z" fill="url(#grad-spark)" />
          <circle cx="126" cy="112" r="22" fill="var(--accent2)" />
          <circle cx="410" cy="250" r="26" fill="var(--accent)" />
          <circle cx="390" cy="92" r="10" fill="var(--ink)" filter="url(#soft-spark)" />
          <path d="M150 300h220" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function Walker({ progress }: { progress: number }) {
  const x = -21 + progress * 34;

  return (
    <div className="walker" style={{ "--walker-x": `${x}vw` } as React.CSSProperties}>
      <div className="walker-shadow" />
      <div className="walker-body">
        <div className="walker-head" />
        <div className="walker-torso" />
        <div className="walker-arm walker-arm--front" />
        <div className="walker-arm walker-arm--back" />
        <div className="walker-leg walker-leg--front" />
        <div className="walker-leg walker-leg--back" />
        <div className="walker-bag" />
      </div>
    </div>
  );
}

function App() {
  const trackRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeIndex = clamp(Math.round(progress * (scenes.length - 1)), 0, scenes.length - 1);
  const scene = scenes[activeIndex];
  const localProgress = progress * (scenes.length - 1) - activeIndex;

  const dateText = useMemo(() => formatDate(), []);

  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.offsetTop;
    const height = track.offsetHeight - window.innerHeight;
    setProgress(height <= 0 ? 0 : clamp((window.scrollY - top) / height, 0, 1));
  }, []);

  useEffect(() => {
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  const scrollToScene = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const height = track.offsetHeight - window.innerHeight;
    const target = track.offsetTop + (height * clamp(index, 0, scenes.length - 1)) / (scenes.length - 1);
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const stageStyle = {
    "--accent": scene.accent,
    "--accent2": scene.accent2,
    "--deep": scene.deep,
    "--scene-count": scenes.length,
    "--scene-index": activeIndex,
    "--progress": progress,
  } as React.CSSProperties;

  const notebookStyle = {
    transform: `translate3d(${Math.sin(progress * Math.PI) * 2.2}vw, ${Math.cos(progress * Math.PI * 1.4) * 1.8}vh, 0) rotate(${
      -8 + progress * 12 + localProgress * 2
    }deg)`,
  };

  return (
    <>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => scrollToScene(0)} aria-label="最初のシーンへ">
          <span className="brand-mark">I</span>
          <span className="brand-text">INCURISE</span>
        </button>
        <div className="header-center" aria-label="本日の表示">
          <span>{dateText}</span>
          <span>INTERACTIVE HOME</span>
        </div>
        <button
          className="icon-button menu-trigger"
          type="button"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main ref={trackRef} className="scroll-track" style={{ minHeight: `${scenes.length * 100}vh` }}>
        <section className="stage" style={stageStyle} aria-label="Incurise モーショントップ">
          <div className="ambient ambient--one" />
          <div className="ambient ambient--two" />
          <div className="left-rails" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="scene-number" aria-hidden="true">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <small>{scene.nav}</small>
          </div>
          <div className="floor" aria-hidden="true" />

          <Walker progress={progress} />

          <article className="notebook" style={notebookStyle} aria-live="polite">
            <div className="rings" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="page page--copy">
              <span className="page-kicker">SCENE {String(activeIndex + 1).padStart(2, "0")}</span>
              <h1>{scene.title}</h1>
              <p className="english">{scene.english}</p>
              <p>{scene.body}</p>
            </div>
            <div className="page page--visual">
              <SceneArt type={scene.art} />
            </div>
          </article>

          <nav className="right-controller" aria-label="シーン操作">
            <button className="icon-button" type="button" aria-label="前のシーン" onClick={() => scrollToScene(activeIndex - 1)}>
              <ArrowUp size={20} />
            </button>
            <div className="controller-track" aria-hidden="true">
              <span style={{ height: `${8 + progress * 92}%` }} />
            </div>
            <span className="controller-count">
              {activeIndex + 1}/{scenes.length}
            </span>
            <button className="icon-button" type="button" aria-label="次のシーン" onClick={() => scrollToScene(activeIndex + 1)}>
              <ArrowDown size={20} />
            </button>
          </nav>

          <nav className="bottom-nav" aria-label="ページ内ナビゲーション">
            {scenes.map((item, index) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                className={activeIndex === index ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToScene(index);
                }}
              >
                <span>{item.nav}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </a>
            ))}
          </nav>

          <a className="join-us" href="https://incurise.co.jp/" target="_blank" rel="noreferrer">
            <Plus size={20} />
            CONTACT
          </a>
        </section>
      </main>

      <div className={`menu-panel ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="menu-panel__inner">
          <p className="menu-label">INCURISE SITE MAP</p>
          <nav aria-label="フルスクリーンメニュー">
            {scenes.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  window.setTimeout(() => scrollToScene(index), 120);
                }}
              >
                <span>{item.nav}</span>
                <small>{item.english}</small>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
