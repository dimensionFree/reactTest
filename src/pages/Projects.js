import React, { useState } from "react";
import Navibar from "../components/Navibar";
import SEO from "../components/common/SEO";
import "../css/projects.css";

const TOKYO_HEX_ARTICLE = "/article/read/c16bd235375769906386ff107b0b7dc7";
const FILE_ZIPER_REPOSITORY = "https://github.com/dimensionFree/FileZiper";

const copy = {
  ja: {
    title: "制作したもの",
    description: "小さな実験を、動く形で残しておく場所です。",
    projectType: "地図・データ可視化",
    projectDescription: "東京23区の公開GISデータをQGISで前処理し、Civilization風の六角形マップとして表示しました。地図を動かしながら、各タイルの分類を見ることができます。",
    openProject: "マップを試す",
    readArticle: "制作記録を読む",
    fileZiperType: "ローカルツール・メディア整理",
    fileZiperDescription: "画像の整理・圧縮と、FFmpegを使ったMP4動画の一括圧縮を行うJava製のローカルツールです。",
    viewSource: "GitHubでコードを見る",
    backToAbout: "自己紹介に戻る",
  },
  en: {
    title: "Projects",
    description: "A place for the small experiments I have built and put online.",
    projectType: "Map · Data visualization",
    projectDescription: "I processed public GIS data for Tokyo's 23 wards in QGIS and displayed it as a Civilization-inspired hex map. Explore the map and inspect how each tile is classified.",
    openProject: "Explore the map",
    readArticle: "Read the build notes",
    fileZiperType: "Local utility · Media processing",
    fileZiperDescription: "A local Java tool for organizing and compressing images and batch compressing MP4 videos with FFmpeg.",
    viewSource: "View source on GitHub",
    backToAbout: "Back to About",
  },
  zh: {
    title: "做过的项目",
    description: "把一些小实验整理成可以实际体验的作品。",
    projectType: "地图 · 数据可视化",
    projectDescription: "使用 QGIS 预处理东京 23 区的公开地理数据，再以《文明》风格的六边形地图展示。可以拖动地图，查看每个格子的分类。",
    openProject: "体验地图",
    readArticle: "阅读制作记录",
    fileZiperType: "本地工具 · 媒体处理",
    fileZiperDescription: "一个 Java 本地工具，用于整理和压缩图片，以及借助 FFmpeg 批量压缩 MP4 视频。",
    viewSource: "在 GitHub 查看源码",
    backToAbout: "返回关于我",
  },
};

const Projects = () => {
  const [lang, setLang] = useState("ja");
  const text = copy[lang];

  return (
    <div className="projects-shell">
      <SEO title={text.title} description={text.description} />
      <Navibar />
      <main className="projects-page">
        <div className="projects-page__topline">
          <a href="/about">{text.backToAbout}</a>
          <div className="projects-page__languages" aria-label="Language">
            <button type="button" className={lang === "ja" ? "is-active" : ""} onClick={() => setLang("ja")}>日本語</button>
            <button type="button" className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>English</button>
            <button type="button" className={lang === "zh" ? "is-active" : ""} onClick={() => setLang("zh")}>中文</button>
          </div>
        </div>
        <header className="projects-page__header">
          <p className="projects-page__kicker">PROJECTS</p>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </header>
        <article className="projects-feature">
          <div className="projects-feature__content">
            <p className="projects-page__kicker">01 / {text.projectType}</p>
            <h2>Tokyo Hex Map</h2>
            <p>{text.projectDescription}</p>
            <ul className="projects-feature__stack" aria-label="Technologies">
              <li>QGIS</li>
              <li>GeoJSON</li>
              <li>React · SVG</li>
            </ul>
            <div className="projects-feature__actions">
              <a className="projects-feature__primary" href="/geo-lab/tokyo-hex">{text.openProject} <span aria-hidden="true">↗</span></a>
              <a className="projects-feature__secondary" href={TOKYO_HEX_ARTICLE}>{text.readArticle} <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="projects-feature__visual" aria-hidden="true">
            <span className="projects-feature__visual-label">TOKYO / 23 WARDS</span>
            <div className="projects-feature__hexes">
              {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
            </div>
            <span className="projects-feature__visual-footer">GIS × CIVILIZATION</span>
          </div>
        </article>
        <article className="projects-secondary">
          <p className="projects-page__kicker">02 / {text.fileZiperType}</p>
          <h2>FileZiper</h2>
          <p>{text.fileZiperDescription}</p>
          <ul className="projects-feature__stack" aria-label="Technologies">
            <li>Java</li>
            <li>FFmpeg</li>
          </ul>
          <a href={FILE_ZIPER_REPOSITORY} target="_blank" rel="noopener noreferrer">
            {text.viewSource} <span aria-hidden="true">↗</span>
          </a>
        </article>
      </main>
    </div>
  );
};

export default Projects;
