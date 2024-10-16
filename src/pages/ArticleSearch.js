import Navibar from "../components/Navibar";
import React from "react";
import FindArticle from "../components/article/FindArticles";
import {useParams} from "react-router-dom";
import SEO from "../components/common/SEO";


const ArticleSearch = () => {
    const { keyword } = useParams();


    return (
        <div className="container mt-5 pt-5">
            <SEO title={"検索結果"} description={"searchResult"}/>
            <Navibar/>
            <h1 className="mb-4">Article Management</h1>
            <FindArticle filters={{ content: keyword}} isShowDeleteButton={false} isShowEditButton={false} />

        </div>
    );
};

export default ArticleSearch;


