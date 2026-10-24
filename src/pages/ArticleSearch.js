import Navibar from "../components/Navibar";
import React, { useMemo, useState } from "react";
import FindArticle from "../components/article/FindArticles";
import { useParams } from "react-router-dom";
import SEO from "../components/common/SEO";
import "../css/articleSearch.css";

const ArticleSearch = () => {
    const { keyword = "" } = useParams();
    const searchKeyword = keyword.trim();
    const filters = useMemo(() => ({ content: searchKeyword }), [searchKeyword]);
    const [searchStatus, setSearchStatus] = useState({ status: "loading", total: 0 });

    return (
        <div>
            <SEO title={`「${searchKeyword}」の検索結果`} description={`「${searchKeyword}」に一致する記事を探します。`} />
            <Navibar initialSearchKeyword={searchKeyword} />
            <main className="article-search-page">
                <header className="article-search-page__header">
                    <p className="article-search-page__eyebrow">BLOG SEARCH</p>
                    <h1>検索結果</h1>
                    <p className="article-search-page__query">
                        <span>キーワード</span>
                        <strong>「{searchKeyword}」</strong>
                    </p>
                    <p className="article-search-page__status" role="status" aria-live="polite">
                        {searchStatus.status === "loading" && "記事を検索しています…"}
                        {searchStatus.status === "error" && "検索結果を取得できませんでした。"}
                        {searchStatus.status === "ready" && `${searchStatus.total} 件の記事が見つかりました`}
                    </p>
                </header>
                <FindArticle
                    key={searchKeyword}
                    filters={filters}
                    searchKeyword={searchKeyword}
                    onSearchStatusChange={setSearchStatus}
                />
            </main>
        </div>
    );
};

export default ArticleSearch;


