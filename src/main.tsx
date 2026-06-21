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

const zoomFrames = [
  { id: 1, start: 0.66, end: 0.78, fadeStart: 0.76, fadeEnd: 0.84, scaleStart: 6.2, scaleEnd: 2.7, x: -3.8, y: -1.2 },
  { id: 2, start: 0.74, end: 0.86, fadeStart: 0.84, fadeEnd: 0.91, scaleStart: 3.1, scaleEnd: 1.55, x: 1.4, y: -0.9 },
  { id: 3, start: 0.82, end: 0.93, fadeStart: 0.91, fadeEnd: 0.97, scaleStart: 1.62, scaleEnd: 1.09, x: 0.3, y: -0.3 },
  { id: 4, start: 0.89, end: 1, fadeStart: 1, fadeEnd: 1, scaleStart: 1.08, scaleEnd: 1, x: 0, y: 0 },
];

const outroPanels = [
  { sceneIndex: 0, xStart: -58, yStart: -48, xEnd: -36, yEnd: -32, rotate: -11.5, scaleStart: 1.06, scaleEnd: 1.2 },
  { sceneIndex: 1, xStart: 54, yStart: -50, xEnd: 37, yEnd: -34, rotate: 13.5, scaleStart: 1.1, scaleEnd: 1.23 },
  { sceneIndex: 2, xStart: -50, yStart: 50, xEnd: -39, yEnd: 36, rotate: 9.5, scaleStart: 1.02, scaleEnd: 1.18 },
  { sceneIndex: 3, xStart: 58, yStart: 48, xEnd: 40, yEnd: 34, rotate: -9.5, scaleStart: 1.06, scaleEnd: 1.2 },
  { sceneIndex: 4, xStart: 4, yStart: -58, xEnd: 2, yEnd: -42, rotate: 1.4, scaleStart: 1.1, scaleEnd: 1.26 },
];

const OUTRO_FORWARD_DURATION_MS = 4800;
const OUTRO_REVERSE_DURATION_MS = 1400;
const WHEEL_THRESHOLD = 50;
const SCENE_SCROLL_LOCK_MS = 1600;
const OUTRO_SCROLL_LOCK_MS = 2800;
const WHEEL_RESET_MS = 500;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
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
  const rawFinalTransitionRef = useRef(0);
  const displayFinalTransitionRef = useRef(0);
  const currentSceneRef = useRef(0);
  const wheelEnabledRef = useRef(true);
  const wheelAmountRef = useRef(0);
  const wheelVectorRef = useRef(1);
  const wheelResetTimeoutRef = useRef<number | null>(null);
  const wheelLockTimeoutRef = useRef<number | null>(null);
  const touchScreenYRef = useRef<number | null>(null);
  const menuOpenRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [displayFinalTransition, setDisplayFinalTransition] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeIndex = clamp(Math.round(progress * (scenes.length - 1)), 0, scenes.length - 1);
  const scene = scenes[activeIndex];
  const isFinalScene = activeIndex === scenes.length - 1;
  const finalStart = (scenes.length - 2) / (scenes.length - 1);
  const rawFinalTransition = clamp((progress - finalStart) / (1 - finalStart), 0, 1);
  const finalTransition = displayFinalTransition;
  const finalEase = smooth(finalTransition);
  const finalCopyProgress = smooth(clamp((finalTransition - 0.86) / 0.1, 0, 1));
  const finalButtonProgress = smooth(clamp((finalTransition - 0.94) / 0.06, 0, 1));
  const finalWordProgress = smooth(clamp((finalTransition - 0.88) / 0.12, 0, 1));
  const finalBrandVisible = finalTransition > 0.64;
  const finalizing = finalTransition > 0.02;
  const stackVisible = finalTransition > 0.02 && finalTransition < 0.96;
  const panelsVisible = finalTransition > 0.04 && finalTransition < 0.84;
  const showNotebook = finalTransition < 0.025;
  const contentIndex = rawFinalTransition > 0.01 && finalTransition < 0.9 ? scenes.length - 2 : activeIndex;
  const contentScene = scenes[contentIndex];
  const localProgress = progress * (scenes.length - 1) - activeIndex;
  const stackScale =
    finalTransition < 0.42
      ? mix(1, 0.8, smooth(clamp(finalTransition / 0.42, 0, 1)))
      : finalTransition < 0.76
        ? mix(0.8, 0.2, clamp((finalTransition - 0.42) / 0.34, 0, 1) ** 2.4)
        : mix(0.2, 0.0076, smooth(clamp((finalTransition - 0.76) / 0.2, 0, 1)));
  const stackOpacity = 1 - smooth(clamp((finalTransition - 0.79) / 0.13, 0, 1));

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
    menuOpenRef.current = menuOpen;
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    rawFinalTransitionRef.current = rawFinalTransition;
  }, [rawFinalTransition]);

  useEffect(() => {
    let animationFrame = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      const target = rawFinalTransitionRef.current;
      const current = displayFinalTransitionRef.current;
      const difference = target - current;
      const elapsed = Math.max(0, time - previousTime);

      if (Math.abs(difference) > 0.001) {
        const duration = difference > 0 ? OUTRO_FORWARD_DURATION_MS : OUTRO_REVERSE_DURATION_MS;
        const step = Math.min(Math.abs(difference), elapsed / duration);
        const next = current + Math.sign(difference) * step;
        displayFinalTransitionRef.current = next;
        setDisplayFinalTransition(next);
      } else if (current !== target) {
        displayFinalTransitionRef.current = target;
        setDisplayFinalTransition(target);
      }

      previousTime = time;
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const scrollToScene = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const height = track.offsetHeight - window.innerHeight;
    const target = track.offsetTop + (height * clamp(index, 0, scenes.length - 1)) / (scenes.length - 1);
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    currentSceneRef.current = activeIndex;
  }, [activeIndex]);

  const moveSceneByStep = useCallback(
    (moveValue: number) => {
      const previousIndex = currentSceneRef.current;
      const nextIndex = clamp(previousIndex + moveValue, 0, scenes.length - 1);
      if (nextIndex === previousIndex) return;

      currentSceneRef.current = nextIndex;
      scrollToScene(nextIndex);

      wheelEnabledRef.current = false;
      if (wheelLockTimeoutRef.current) {
        window.clearTimeout(wheelLockTimeoutRef.current);
      }
      const lockDuration = nextIndex === scenes.length - 1 || previousIndex === scenes.length - 1 ? OUTRO_SCROLL_LOCK_MS : SCENE_SCROLL_LOCK_MS;
      wheelLockTimeoutRef.current = window.setTimeout(() => {
        wheelEnabledRef.current = true;
        wheelAmountRef.current = 0;
      }, lockDuration);
    },
    [scrollToScene],
  );

  useEffect(() => {
    const updateWheelAmount = (deltaY: number) => {
      if (!wheelEnabledRef.current || Math.abs(deltaY) < 1) return;

      const nextVector = deltaY > 0 ? 1 : -1;
      if (wheelVectorRef.current !== nextVector) {
        wheelAmountRef.current = 0;
      }
      wheelVectorRef.current = nextVector;

      if (wheelResetTimeoutRef.current) {
        window.clearTimeout(wheelResetTimeoutRef.current);
      }
      wheelResetTimeoutRef.current = window.setTimeout(() => {
        wheelAmountRef.current = 0;
      }, WHEEL_RESET_MS);

      wheelAmountRef.current += deltaY;
      if (wheelAmountRef.current > WHEEL_THRESHOLD) {
        moveSceneByStep(1);
      } else if (wheelAmountRef.current < -WHEEL_THRESHOLD) {
        moveSceneByStep(-1);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (menuOpenRef.current) return;
      updateWheelAmount(event.deltaY);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchScreenYRef.current = event.touches[0]?.screenY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (menuOpenRef.current) {
        event.preventDefault();
        return;
      }
      const previousY = touchScreenYRef.current;
      const currentY = event.touches[0]?.screenY ?? null;
      if (previousY === null || currentY === null) return;

      event.preventDefault();
      touchScreenYRef.current = currentY;
      updateWheelAmount((previousY - currentY) * 10);
    };

    document.body.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.body.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      if (wheelResetTimeoutRef.current) {
        window.clearTimeout(wheelResetTimeoutRef.current);
      }
      if (wheelLockTimeoutRef.current) {
        window.clearTimeout(wheelLockTimeoutRef.current);
      }
    };
  }, [moveSceneByStep]);

  const stageStyle = {
    "--accent": scene.accent,
    "--accent2": scene.accent2,
    "--deep": scene.deep,
    "--scene-count": scenes.length,
    "--scene-index": activeIndex,
    "--progress": progress,
    "--final-progress": finalEase,
    "--final-side-opacity": 1 - finalEase,
  } as React.CSSProperties;

  const notebookStyle = {
    opacity: 1,
    transform: `translate3d(${Math.sin(progress * Math.PI) * 2.2}vw, ${Math.cos(progress * Math.PI * 1.4) * 1.8}vh, 0) rotate(${
      -8 + progress * 12 + localProgress * 2
    }deg)`,
  } as React.CSSProperties;

  const outroStackStyle = {
    "--stack-scale": stackScale,
    "--stack-opacity": stackOpacity,
    "--stack-softness": `${smooth(clamp((finalTransition - 0.82) / 0.12, 0, 1)) * 1.4}px`,
    "--stack-x": `${mix(0, 3.4, smooth(finalTransition))}vw`,
    "--stack-y": `${mix(0, -0.2, smooth(finalTransition))}vh`,
  } as React.CSSProperties;

  const finalBrandStyle = {
    "--final-copy-opacity": finalCopyProgress,
    "--final-button-opacity": finalButtonProgress,
    "--final-copy-y": `${(1 - finalCopyProgress) * 18}px`,
    "--final-word-opacity": finalWordProgress,
    "--final-word-y": `${(1 - finalWordProgress) * 20}px`,
    opacity: clamp((finalTransition - 0.64) / 0.12, 0, 1),
    pointerEvents: finalTransition > 0.9 ? "auto" : "none",
  } as React.CSSProperties;

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
        <section
          className={`stage ${isFinalScene ? "final-scene" : ""} ${finalizing ? "finalizing" : ""}`}
          style={stageStyle}
          aria-label="Incurise モーショントップ"
        >
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

          {finalBrandVisible && (
            <article className="final-brand" style={finalBrandStyle} aria-live="polite">
              <div className="zoom-word-stage" aria-hidden="true">
                {zoomFrames.map((frame) => {
                  const appear = smooth(clamp((finalTransition - frame.start) / (frame.end - frame.start), 0, 1));
                  const leave = frame.fadeStart >= 1 ? 0 : smooth(clamp((finalTransition - frame.fadeStart) / (frame.fadeEnd - frame.fadeStart), 0, 1));
                  const frameProgress = smooth(clamp((finalTransition - frame.start) / (frame.end - frame.start), 0, 1));
                  return (
                    <span
                      className={`zoom-word zoom-word--${frame.id}`}
                      key={frame.id}
                      style={
                        {
                          "--zoom-opacity": appear * (1 - leave),
                          "--zoom-scale": mix(frame.scaleStart, frame.scaleEnd, frameProgress),
                          "--zoom-x": `${mix(frame.x, 0, frameProgress)}vw`,
                          "--zoom-y": `${mix(frame.y, 0, frameProgress)}vh`,
                        } as React.CSSProperties
                      }
                    >
                      INCURISE
                    </span>
                  );
                })}
              </div>
              <h1 className="final-brand__title">Incurise Consulting</h1>
              <div className="final-brand__copy">
                <p>こうした小さな実装を、一つひとつ積み重ねていきます。</p>
                <p>これからも、事業の成長に向き合いながら前に進みます。</p>
              </div>
              <button className="final-brand__button" type="button" onClick={() => setMenuOpen(true)}>
                CONTACT
                <span aria-hidden="true">→</span>
              </button>
            </article>
          )}

          {stackVisible && (
            <>
              {panelsVisible && (
                <div className="outro-panels" aria-hidden="true">
                  {outroPanels.map((panel, index) => {
                    const item = scenes[panel.sceneIndex];
                    const intro = smooth(clamp((finalTransition - 0.06) / 0.24, 0, 1));
                    const exit = smooth(clamp((finalTransition - 0.66) / 0.16, 0, 1));
                    const drift = smooth(clamp((finalTransition - 0.12) / 0.52, 0, 1));
                    return (
                      <section
                        className={`outro-panel outro-panel--${index + 1}`}
                        key={item.id}
                        style={
                          {
                            "--panel-opacity": intro * (1 - exit),
                            "--panel-transform": `translate3d(${mix(panel.xStart, panel.xEnd, drift)}vw, ${mix(
                              panel.yStart,
                              panel.yEnd,
                              drift,
                            )}vh, 0) rotate(${panel.rotate}deg) scale(${mix(panel.scaleStart, panel.scaleEnd, drift)})`,
                          } as React.CSSProperties
                        }
                      >
                        <span className="outro-panel__mark">0{panel.sceneIndex + 1}</span>
                        <strong>{item.title}</strong>
                        <small>{item.english}</small>
                        <SceneArt type={item.art} />
                      </section>
                    );
                  })}
                </div>
              )}
              <div className="outro-stack" style={outroStackStyle} aria-hidden="true">
                {scenes.slice(0, 5).map((item, index) => (
                  <section className={`outro-sheet outro-sheet--${index + 1}`} key={item.id}>
                    <span className="outro-sheet__index">0{index + 1}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.english}</small>
                    </div>
                    <SceneArt type={item.art} />
                  </section>
                ))}
              </div>
            </>
          )}

          {showNotebook && (
            <article className="notebook" style={notebookStyle} aria-live="polite">
              <div className="rings" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <div className="page page--copy">
                <span className="page-kicker">SCENE {String(contentIndex + 1).padStart(2, "0")}</span>
                <h1>{contentScene.title}</h1>
                <p className="english">{contentScene.english}</p>
                <p>{contentScene.body}</p>
              </div>
              <div className="page page--visual">
                <SceneArt type={contentScene.art} />
              </div>
            </article>
          )}

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

          <button className="join-us" type="button" onClick={() => scrollToScene(scenes.length - 1)}>
            <Plus size={20} />
            CONTACT
          </button>
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
