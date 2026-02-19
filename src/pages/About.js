import React, { useMemo, useState } from "react";
import Navibar from "../components/Navibar";
import SEO from "../components/common/SEO";
import "../css/about.css";

const About = () => {
  const [lang, setLang] = useState("ja");

  const content = useMemo(
    () => ({
      zh: {
        title: "关于我",
        desc: "about me",
        kicker: "About",
        p1: "后端工程师，现居日本。日常使用 Java / TypeScript，主要关注系统设计与 AI 工程实践。",
        p2: "工作之外，我是策略和系统类游戏爱好者。常玩的有 Dota2、文明6、骑马与砍杀，也会接触一些剧情向作品（包括 gal）。",
        p3: "对我来说，游戏里的规则、资源分配和长期决策，与工程实践有很多共通之处。这个博客会持续记录技术笔记，也写一些投资、历史与日常思考。"
      },
      ja: {
        title: "自己紹介",
        desc: "about me in japanese",
        kicker: "About",
        p1: "日本在住のバックエンドエンジニアです。Java / TypeScript を中心に、システム設計と AI の実装を主に扱っています。",
        p2: "仕事以外では、戦略・シミュレーション系のゲームが好きです。Dota2、Civilization VI、Mount & Blade をよく遊び、物語系作品（gal）にも触れます。",
        p3: "ゲームにおけるルール設計、資源配分、長期的な意思決定は、実務のエンジニアリングと通じる部分が多いと感じています。このブログでは技術メモを中心に、投資・歴史・日常の思考も記録しています。"
      },
      en: {
        title: "About Me",
        desc: "about me in english",
        kicker: "About",
        p1: "Backend engineer based in Japan. I mainly work with Java and TypeScript, focusing on system design and practical AI engineering.",
        p2: "Outside work, I enjoy strategy and systems-oriented games. I regularly play Dota2, Civilization VI, and Mount & Blade, and also explore story-driven titles (including gal games).",
        p3: "To me, game mechanics such as rules, resource allocation, and long-term decision-making are closely related to engineering practice. This blog records technical notes, along with thoughts on investing, history, and everyday life."
      }
    }),
    []
  );

  const current = content[lang];

  return (
    <div className="about-shell">
      <SEO title={current.title} description={current.desc} />
      <div className="about-shell__nav">
        <Navibar />
      </div>
      <section className="about-card">
        <div className="about-card__lang">
          <button
            type="button"
            className={`about-card__lang-btn ${lang === "ja" ? "is-active" : ""}`}
            onClick={() => setLang("ja")}
          >
            日本語
          </button>
          <button
            type="button"
            className={`about-card__lang-btn ${lang === "en" ? "is-active" : ""}`}
            onClick={() => setLang("en")}
          >
            English
          </button>
          <button
            type="button"
            className={`about-card__lang-btn ${lang === "zh" ? "is-active" : ""}`}
            onClick={() => setLang("zh")}
          >
            中文
          </button>
        </div>
        <p className="about-card__kicker">{current.kicker}</p>
        <h1>{current.title}</h1>
        <p>{current.p1}</p>
        <p>{current.p2}</p>
        <p>{current.p3}</p>
      </section>
    </div>
  );
};

export default About;
