import React, { useEffect, useMemo, useState } from "react";
import { Pagination } from "antd";
import "../../css/articleList.css";

const PAGE_SIZE_DEFAULT = 10;

const HomeArticleList = ({ articles = [] }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  useEffect(() => {
    setPage(1);
  }, [articles]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return articles.slice(start, start + pageSize);
  }, [articles, page, pageSize]);

  const handlePageChange = (nextPage, nextPageSize) => {
    if (nextPageSize !== pageSize) {
      setPage(1);
      setPageSize(nextPageSize);
      return;
    }
    setPage(nextPage);
  };

  return (
    <div className="article-list">
      {pageData.map((item) => (
        <article className="article-card" key={item.id}>
          <div className="article-card__main">
            <a href={`/article/read/${item.id}`} className="article-card__title">
              {item.title}
            </a>
            <p className="article-card__preface">{item.preface}</p>
            <p className="article-card__meta">
              {new Date(item.createdDate).toISOString().slice(0, 16).replace("T", " ")}
            </p>
            <div className="article-card__meta article-card__meta-row">
              <p>{item.createdUserName}</p>
              <p>{item.viewCount || 0}</p>
            </div>
          </div>
        </article>
      ))}
      <Pagination
        current={page}
        pageSize={pageSize}
        total={articles.length}
        onChange={handlePageChange}
        showSizeChanger
      />
    </div>
  );
};

export default HomeArticleList;
