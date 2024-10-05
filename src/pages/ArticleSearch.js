import Navibar from "../components/Navibar";
import React from "react";
import FindArticle from "../components/article/FindArticles";
import {useParams} from "react-router-dom";


const ArticleSearch = () => {
    const { keyword } = useParams();


    return (
        <div className="container mt-5 pt-5">
            <title>article manage</title>
            <Navibar/>
            <h1 className="mb-4">Article Management</h1>
            <FindArticle filters={{ content: keyword}} isShowDeleteButton={false} isShowEditButton={false} />

        </div>
    );
};

export default ArticleSearch;


