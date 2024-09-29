import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import RequestSendUtils from "../../Utils/RequestSendUtils";  // 导入 react-markdown

const ShowArticleById = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const response = await RequestSendUtils.sendGetWithReturn("/article/find/"+id, null);
                const data = await response.dataContent;

                setArticle(data);  // 将获取到的文章数据存入 article 状态中
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!article) {
        return <div>Article not found.</div>;
    }

    return (
        <div >
            <h1>{article.title}</h1>
            {/* 使用 ReactMarkdown 渲染 Markdown 格式的内容 */}
            <div style={{ textAlign: 'left' }}>
                <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
        </div>
    );
};

export default ShowArticleById;
