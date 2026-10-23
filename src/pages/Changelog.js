import React from "react";
import Navibar from "../components/Navibar";
import SEO from "../components/common/SEO";
import siteChangelog from "../data/siteChangelog";
import "../css/changelog.css";

const Changelog = () => (
  <div className="changelog-shell">
    <SEO title="更新日志" description="网站功能与体验的开发记录" />
    <Navibar />
    <main className="changelog-card">
      <p className="changelog-card__kicker">Site Changelog</p>
      <h1>更新日志</h1>
      <p className="changelog-card__intro">
        这里记录网站功能与体验的主要变化。日期为代码提交日期，可能与网站实际更新时间不同。
      </p>
      <ol className="changelog-list">
        {siteChangelog.map(({ date, title, changes, href, linkLabel }) => (
          <li className="changelog-entry" key={`${date}-${title}`}>
            <time dateTime={date}>{date}</time>
            <h2>{title}</h2>
            <ul>
              {changes.map((change) => <li key={change}>{change}</li>)}
            </ul>
            {href && <a href={href}>{linkLabel}</a>}
          </li>
        ))}
      </ol>
    </main>
  </div>
);

export default Changelog;
