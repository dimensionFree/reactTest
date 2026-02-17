import Navibar from "../components/Navibar";
import React, { Component } from "react";
import LatestArticle from "../components/article/LatestArticle";
import FindArticle from "../components/article/FindArticles";
import { SITE_NAME } from "../components/common/constants";
import Helmet from "react-helmet";
import "../css/homeTheme.css";

export default class HP extends Component {
  render() {
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
                <h2>最近文章</h2>
              </div>
              <FindArticle />
            </section>
          </main>
          <aside className="home-side">
            <section className="side-card">
              <p className="side-card__kicker">Personal Blog</p>
              <h3>把想法做成可以长期维护的系统</h3>
              <p>
                这里记录 Java、前端工程化、部署和踩坑。风格偏技术沉淀，不是碎片化发帖。
              </p>
            </section>
            <section className="side-card">
              <p className="side-card__kicker">Now Building</p>
              <ul className="side-card__list">
                <li>统一前后端部署流水线</li>
                <li>Markdown 写作体验优化</li>
                <li>博客主题与阅读体验升级</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    );
  }
}
