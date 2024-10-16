import Navibar from "../components/Navibar";
import React, {useEffect, useState} from "react";
import FindArticle from "../components/article/FindArticles";
import {useParams} from "react-router-dom";
import {SITE_NAME} from "../components/common/constants";
import Helmet from "react-helmet";
import RequestSendUtils from "../Utils/RequestSendUtils";
import SEO from "../components/common/SEO";


const ArticleManage = () => {
    // const { id } = useParams();

    const [userId,setUserId] = useState(null);
    const [isAdmin,setIsAdmin] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            const { id, username, role } = userInfo.user4Display;

            setIsAdmin(role.roleName === "admin");
            setUserId(id);
        }
    }, []);

    return (
        <div className="container mt-5 pt-5">
            <SEO title={"文章管理"} description={"articleManage"}/>
            {/*<Helmet>*/}
            {/*    <title>文章管理　|　{SITE_NAME}</title>  /!* 使用常量 *!/*/}
            {/*    <meta name="description" content={`articleManage of ${SITE_NAME}`} />*/}
            {/*</Helmet>*/}
            <Navibar/>
            <h1 className="mb-4">Article Management</h1>
            {userId !== null &&
            <FindArticle filters={isAdmin?{}:{ created_by: userId}} isShowDeleteButton={true} isShowEditButton={true} />
            }

        </div>
    );
};

export default ArticleManage;


