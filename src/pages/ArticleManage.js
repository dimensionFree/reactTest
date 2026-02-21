import Navibar from "../components/Navibar";
import React, {useEffect, useState} from "react";
import FindArticle from "../components/article/FindArticles";
import SEO from "../components/common/SEO";

const ArticleManage = () => {
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            const {id, role} = userInfo.user4Display;
            setIsAdmin(role.roleName === "admin");
            setUserId(id);
        }
    }, []);

    return (
        <div>
            <SEO title={"文章管理"} description={"articleManage"}/>
            <Navibar/>
            <div className="container mt-5 pt-5">
                <h1 className="mb-4">Article Management</h1>
                {userId !== null && (
                    <FindArticle
                        filters={isAdmin ? {} : {created_by: userId}}
                        isShowDeleteButton={true}
                        isShowEditButton={true}
                        isShowPublicSwitch={true}
                        manageMode={true}
                    />
                )}
            </div>
        </div>
    );
};

export default ArticleManage;
