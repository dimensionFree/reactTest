import React from "react";
import Navibar from "../components/Navibar";
import SEO from "../components/common/SEO";
import siteChangelog from "../data/siteChangelog";
import "../css/changelog.css";

const Changelog = () => (
  <div className="changelog-shell">
    <SEO title="サイトの更新履歴" description="このブログの主な機能と表示の変更履歴" />
    <Navibar />
    <main className="changelog-card">
      <p className="changelog-card__kicker">Site History</p>
      <h1>サイトの更新履歴</h1>
      <p className="changelog-card__intro">
        このブログの主な変更を記録しています。日付は代表的なコードのコミット日で、公開日とは異なる場合があります。
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
