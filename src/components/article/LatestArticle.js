import React from "react";
import "../../css/LatestArticle.css";

const LatestArticle = ({ article }) => (
  <section className="latest-hero jumbotron p-4 rounded text-center">
    <div className="d-flex justify-content-center align-items-center">
      <div className="col-md-8 px-0">
        <p className="latest-hero__kicker">最新記事</p>
        <h1>{article.title}</h1>
        <p className="lead my-3">{article.preface}</p>
        <a href={`/article/read/${article.id}`} className="latest-hero__cta">
          記事を読む
        </a>
      </div>
    </div>
  </section>
);

export default LatestArticle;
