import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RequestSendUtils from "../../Utils/RequestSendUtils";
import MarkdownRenderer from "../markdown/MarkdownRenderer";
import SEO from "../common/SEO";
import "../../css/readArticle.css";

const ShowArticleById = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await RequestSendUtils.sendGetWithReturn("/article/find/" + id + "?recordRead=true", null);
        const data = await response.dataContent;
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="read-empty">Loading...</div>;
  }

  if (!article) {
    return <div className="read-empty">Article not found.</div>;
  }

  return (
    <article className="read-article">
      <SEO title={article.title} description={article.title} />
      <header className="read-article__head">
        <p className="read-article__kicker">Article</p>
        <h1>{article.title}</h1>
        <p className="read-article__author">{article.createdUserName}</p>
        <div className="read-article__meta">
          <p>authored at {new Date(article.createdDate).toISOString().slice(0, 16).replace("T", " ")}</p>
          <p>lastUpdated at {new Date(article.updatedDate).toISOString().slice(0, 16).replace("T", " ")}</p>
        </div>
      </header>
      <div className="read-article__body">
        <MarkdownRenderer content={article.content}></MarkdownRenderer>
      </div>
    </article>
  );
};

export default ShowArticleById;

