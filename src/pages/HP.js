import Navibar from "../components/Navibar";
import React, { useEffect, useMemo, useState } from "react";
import LatestArticle from "../components/article/LatestArticle";
import ArchiveByMonthCard from "../components/article/ArchiveByMonthCard";
import HomeArticleList from "../components/article/HomeArticleList";
import { SITE_NAME } from "../components/common/constants";
import Helmet from "react-helmet";
import RequestSendUtils from "../Utils/RequestSendUtils";
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
        more: "更多关于我"
      },
      ja: {
        title: "日本在住のバックエンドエンジニア",
        lines: [
          "Java / TypeScript を中心に、システム設計と AI 実装に取り組んでいます。",
          "趣味は戦略ゲーム、歴史、投資。",
          "このブログでは技術メモと日々の思考を記録しています。"
        ],
        more: "もっと見る"
      },
      en: {
        title: "Backend Engineer in Japan",
        lines: [
          "I use Java / TypeScript daily and focus on system design and AI engineering.",
          "I also enjoy strategy games, history, and investing.",
          "This blog records technical notes and practical thoughts."
        ],
        more: "Read More"
      }
    }),
    []
  );

  const nowBuilding = useMemo(
    () => ({
      zh: {
        title: "正在构建",
        items: [
          "前端性能 / 界面优化",
          "Markdown 写作体验优化",
          "博客主题与阅读体验升级"
        ]
      },
      ja: {
        title: "開発中",
        items: [
          "フロントエンド性能 / UI最適化",
          "Markdown執筆体験の改善",
          "ブログテーマと読書体験の改善"
        ]
      },
      en: {
        title: "Now Building",
        items: [
          "Frontend performance and UI updates",
          "Markdown writing experience improvements",
          "Theme and reading experience upgrades"
        ]
      }
    }),
    []
  );

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const response = await RequestSendUtils.sendGetWithReturn(
          "/article/findAll/?currentPage=1&pageSize=500",
          null
        );
        const list = response?.dataContent?.list || [];
        setAllArticles(Array.isArray(list) ? list : []);
      } catch (error) {
        setAllArticles([]);
      }
    };
    fetchAllArticles();
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

  const currentIntro = intro[lang];
  const currentNowBuilding = nowBuilding[lang];
  const archiveTitle = selectedArchive ? `Recent Posts (${selectedArchive})` : "Recent Posts";

  return (
    <div className="home-shell">
      <Helmet>
        <title>{SITE_NAME}</title>
        <meta name="description" content={`homepage of ${SITE_NAME}`} />
      </Helmet>
      <div className="home-block">
        <Navibar />
      </div>
      <div className="home-grid home-block home-block--2">
        <main className="home-main">
          <LatestArticle />
          <section className="home-section">
            <div className="home-section__header">
              <p className="home-section__tag">Archive</p>
              <h2>{archiveTitle}</h2>
            </div>
            <HomeArticleList articles={filteredArticles} />
          </section>
        </main>
        <aside className="home-side">
          <section className="side-card">
            <p className="side-card__kicker">Personal Blog</p>
            <div className="side-card__lang">
              <button
                type="button"
                className={`side-card__lang-btn ${lang === "ja" ? "is-active" : ""}`}
                onClick={() => setLang("ja")}
              >
                日本語
              </button>
              <button
                type="button"
                className={`side-card__lang-btn ${lang === "en" ? "is-active" : ""}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`side-card__lang-btn ${lang === "zh" ? "is-active" : ""}`}
                onClick={() => setLang("zh")}
              >
                中文
              </button>
            </div>
            <h3>{currentIntro.title}</h3>
            <p>{currentIntro.lines[0]}</p>
            <p>{currentIntro.lines[1]}</p>
            <p>{currentIntro.lines[2]}</p>
            <a className="side-card__link" href="/about">
              {currentIntro.more}
            </a>
          </section>
          <section className="side-card">
            <p className="side-card__kicker">{currentNowBuilding.title}</p>
            <ul className="side-card__list">
              <li>{currentNowBuilding.items[0]}</li>
              <li>{currentNowBuilding.items[1]}</li>
              <li>{currentNowBuilding.items[2]}</li>
            </ul>
          </section>
        </aside>
      </div>
      <ArchiveByMonthCard
        className="archive-float"
        articles={allArticles}
        selected={selectedArchive}
        onSelect={setSelectedArchive}
      />
    </div>
  );
};

export default HP;

