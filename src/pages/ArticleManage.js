import Navibar from "../components/Navibar";
import React from "react";
import FindArticle from "../components/article/FindArticles";
import {useParams} from "react-router-dom";


const ArticleManage = () => {
    const { id } = useParams();


    return (
        <div className="container mt-5 pt-5">
            <title>user manage</title>
            <Navibar/>
            <h1 className="mb-4">Article Management</h1>
            <FindArticle filters={{ created_by: id}} isShowDeleteButton={true} />

        </div>
    );
};

export default ArticleManage;


