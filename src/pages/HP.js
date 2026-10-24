import Navibar from "../components/Navibar";
import React, { useEffect, useMemo, useState } from "react";
import LatestArticle from "../components/article/LatestArticle";
import ArchiveByMonthCard from "../components/article/ArchiveByMonthCard";
import HomeArticleList from "../components/article/HomeArticleList";
import { SITE_NAME } from "../components/common/constants";
import Helmet from "react-helmet";
import { fetchAllArticles } from "../Utils/articleApi";
import { selectHomeLatestArticle } from "../data/homeLatestArticle";
import "../css/homeTheme.css";

const HP = () => {
  const [lang, setLang] = useState("ja");
  const [selectedArchive, setSelectedArchive] = useState("");
  const [allArticles, setAllArticles] = useState([]);

  const intro = useMemo(
    () => ({
      zh: {
        title: "后端工程师，现居日本",
        lines: [
          "日常使用 Java / TypeScript，关注系统设计与 AI 工程实践。",
          "业余时间喜欢策略游戏、历史和投资。",
          "这里主要记录技术与一些零散思考。"
        ],
        languageLabel: "侧栏显示语言",
        more: "更多关于我"
      },
      ja: {
        title: "日本在住のバックエンドエンジニア",
        lines: [
          "Java / TypeScript を中心に、システム設計と AI 実装に取り組んでいます。",
          "趣味は戦略ゲーム、歴史、投資。",
          "このブログでは技術メモと日々の思考を記録しています。"
        ],
        languageLabel: "サイドバーの表示言語",
        more: "もっと見る"
      },
      en: {
        title: "Backend Engineer in Japan",
        lines: [
          "I use Java / TypeScript daily and focus on system design and AI engineering.",
          "I also enjoy strategy games, history, and investing.",
          "This blog records technical notes and practical thoughts."
        ],
        languageLabel: "Sidebar language",
        more: "Read More"
      }
    }),
    []
  );

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setAllArticles(await fetchAllArticles());
      } catch (error) {
        setAllArticles([]);
      }
    };
    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    if (!selectedArchive) {
      return allArticles;
    }
    const yearPrefix = `${selectedArchive}-`;
    return allArticles.filter((article) => {
      const createdDate = article?.createdDate || "";
      if (selectedArchive.length === 4) {
        return createdDate.startsWith(yearPrefix);
      }
      return createdDate.startsWith(selectedArchive);
    });
  }, [allArticles, selectedArchive]);

  const latestArticle = useMemo(() => selectHomeLatestArticle(allArticles), [allArticles]);
  const recentArticles = useMemo(() => {
    if (selectedArchive || !latestArticle) {
      return filteredArticles;
    }
    return filteredArticles.filter((article) => article.id !== latestArticle.id);
  }, [latestArticle, filteredArticles, selectedArchive]);

  const currentIntro = intro[lang];
  const archiveTitle = selectedArchive ? `Recent Posts (${selectedArchive})` : "Recent Posts";

  return (
    <div className="home-shell">
      <Helmet>
        <title>{SITE_NAME}</title>
        <meta name="description" content={`homepage of ${SITE_NAME}`} />
        <link rel="canonical" href="https://lllspread.com/" />
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:description" content={`homepage of ${SITE_NAME}`} />
        <meta property="og:url" content="https://lllspread.com/" />
      </Helmet>
      <div className="home-block home-nav-layer">
        <Navibar />
      </div>
      <div className="home-grid home-block home-block--2">
        <main className="home-main">
          {latestArticle && <LatestArticle article={latestArticle} />}
          <section className="home-section">
            <div className="home-section__header">
              <p className="home-section__tag">Archive</p>
              <h2>{archiveTitle}</h2>
            </div>
            <HomeArticleList articles={recentArticles} />
          </section>
        </main>
        <aside className="home-side">
          <section className="side-card">
            <p className="side-card__kicker">About</p>
            <h3>{currentIntro.title}</h3>
            <p>{currentIntro.lines[0]}</p>
            <p>{currentIntro.lines[1]}</p>
            <p>{currentIntro.lines[2]}</p>
            <a className="side-card__link" href="/about">
              {currentIntro.more}
            </a>
            <div className="side-card__language-controls">
              <p className="side-card__lang-label">{currentIntro.languageLabel}</p>
              <div className="side-card__lang" role="group" aria-label={currentIntro.languageLabel}>
                <button
                  type="button"
                  className={`side-card__lang-btn ${lang === "ja" ? "is-active" : ""}`}
                  aria-pressed={lang === "ja"}
                  onClick={() => setLang("ja")}
                >
                  日本語
                </button>
                <button
                  type="button"
                  className={`side-card__lang-btn ${lang === "en" ? "is-active" : ""}`}
                  aria-pressed={lang === "en"}
                  onClick={() => setLang("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`side-card__lang-btn ${lang === "zh" ? "is-active" : ""}`}
                  aria-pressed={lang === "zh"}
                  onClick={() => setLang("zh")}
                >
                  中文
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>
      <ArchiveByMonthCard
        className="archive-float"
        articles={allArticles}
        selected={selectedArchive}
        onSelect={setSelectedArchive}
      />
      <footer className="home-footer">
        <a href="/changelog">サイトの更新履歴</a>
      </footer>
    </div>
  );
};

export default HP;

