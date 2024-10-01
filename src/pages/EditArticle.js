import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import RequestSendUtils from "../Utils/RequestSendUtils";
import Navibar from "../components/Navibar";
import { useParams } from 'react-router-dom';

const EditArticle = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { id } = useParams(); // 从路由参数中获取 id

    // 如果是编辑模式，从后端获取文章数据
    useEffect(() => {
        if (id && id !== 'NEW') {
            // 调用后端 API 获取文章数据
            const fetchArticle = async () => {
                try {
                    let token = RequestSendUtils.getToken();
                    const response = await RequestSendUtils.sendGetWithReturn(`/article/find/${id}`, token);
                    // const response = await RequestSendUtils.sendGetWithReturn("/article/find/"+id, null);
                    const data = await response.dataContent;

                    setTitle(data.title);
                    setContent(data.content);
                } catch (error) {
                    alert("Error fetching article: " + error);
                }
            };
            fetchArticle();
        }
    }, [id]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 保存或更新文章
    const handleSave = async () => {
        try {
            let token = RequestSendUtils.getToken();

            let payload = {
                title: title,
                content: content
            };

            if (id === 'NEW') {
                // 创建新文章
                const response = await RequestSendUtils.sendPostWithReturn("/article/create", payload, token);
                const data = await response.dataContent;
                if (data) {
                    alert("Save successful! " + data);
                    window.location.href = "/article/read/" + data;
                }
            } else {
                // 更新已有文章
                const response = await RequestSendUtils.sendPutWithReturn(`/article/update/${id}`, payload, token);
                if (response) {
                    alert("Update successful!");
                    window.location.href = "/article/read/" + id;
                }
            }
        } catch (error) {
            alert("Error: " + error);
        }
    };

    return (
        <div className="container my-5">
            <Navibar />
            <h1>{id === 'NEW' ? "Create New Article" : "Edit Article"}</h1>
            <div className="row" style={{ display: 'flex', height: '50vh' }}>
                {/* 左边的输入区域 */}
                <div className="col-md-6" style={{ height: '100%' }}>
                    <div className="form-group">
                        <label htmlFor="title">Article Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter title"
                        />
                    </div>
                    <div className="form-group" style={{ height: 'calc(100% - 60px)' }}>
                        <label htmlFor="content">Article Content (Markdown format)</label>
                        <textarea
                            className="form-control"
                            id="content"
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Enter content in Markdown format"
                            style={{ height: '100%', resize: 'none' }}
                        />
                    </div>

                    {/* 保存按钮 */}
                    <button onClick={handleSave} className="btn btn-primary mt-5">
                        {id === 'NEW' ? "Save Article" : "Update Article"}
                    </button>
                </div>

                {/* 右边的预览区域 */}
                <div className="col-md-6" style={{ height: '100%' }}>
                    <h2>Preview</h2>
                    <div className="border p-3" style={{ textAlign: 'left', height: 'calc(100% - 40px)' }}>
                        <h3>{title}</h3>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditArticle;
