import React, {useEffect, useState} from 'react';
import RequestSendUtils from "../Utils/RequestSendUtils";
import Navibar from "../components/Navibar";
import {useParams, useHistory} from 'react-router-dom';
import {message} from "antd";
import remarkGfm from "remark-gfm";
import MarkdownRenderer from "../components/markdown/MarkdownRenderer";
import SEO from "../components/common/SEO";
import "../css/formSurface.css";

const EditArticle = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const {id} = useParams(); // 浠庤矾鐢卞弬鏁颁腑鑾峰彇 id
    const history = useHistory();

    // 濡傛灉鏄紪杈戞ā寮忥紝浠庡悗绔幏鍙栨枃绔犳暟鎹?
    useEffect(() => {
        if (id && id !== 'NEW') {
            // 璋冪敤鍚庣 API 鑾峰彇鏂囩珷鏁版嵁
            const fetchArticle = async () => {
                try {
                    let token = RequestSendUtils.getToken();
                    const response = await RequestSendUtils.sendGetWithReturn(`/article/find/${id}`, token);
                    // const response = await RequestSendUtils.sendGetWithReturn("/article/find/"+id, null);
                    const data = await response.dataContent;

                    setTitle(data.title);
                    setContent(data.content);
                } catch (error) {
                    message.error("Error fetching article: " + error)
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

    // 淇濆瓨鎴栨洿鏂版枃绔?
    const handleSave = async () => {
        try {
            let token = RequestSendUtils.getToken();

            let payload = {
                title: title,
                content: content
            };

            if (id === 'NEW') {
                // 鍒涘缓鏂版枃绔?
                const response = await RequestSendUtils.sendPostWithReturn("/article/create", payload, token);
                const data = await response.dataContent;
                if (data) {
                    message.success("Save successful! ");
                    history.push("/article/read/" + data);  // 浣跨敤 React Router 杩涜璺敱璺宠浆
                }
            } else {
                // 鏇存柊宸叉湁鏂囩珷
                const response = await RequestSendUtils.sendPutWithReturn(`/article/update/${id}`, payload, token);
                if (response) {
                    message.success("Update successful!");
                    history.push("/article/read/" + id);  // 浣跨敤 React Router 杩涜璺敱璺宠浆

                }
            }
        } catch (error) {
            message.error(error.response.data.body.message);

        }
    };

    return (
        <div >
            <SEO title={"文章編集"} description={"articleEdit"}/>
            <Navibar/>
            <div className="container-fluid my-5 form-surface">
                <h1>{id === 'NEW' ? "Create New Article" : "Edit Article"}</h1>
                <div className="row" style={{display: 'flex', height: '70vh'}}>
                    {/* 宸﹁竟鐨勮緭鍏ュ尯鍩?*/}
                    <div className="col-md-6" style={{height: '100%'}}>
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
                        <div className="form-group" style={{height: 'calc(100% - 60px)'}}>
                            <label htmlFor="content">Article Content (Markdown format)</label>
                            <textarea
                                className="form-control"
                                id="content"
                                value={content}
                                onChange={handleContentChange}
                                placeholder="Enter content in Markdown format"
                                style={{height: '100%', resize: 'none'}}
                            />
                        </div>

                        {/* 淇濆瓨鎸夐挳 */}
                        <button onClick={handleSave} className="btn btn-primary mt-5">
                            {id === 'NEW' ? "Save Article" : "Update Article"}
                        </button>
                    </div>

                    {/* 鍙宠竟鐨勯瑙堝尯鍩?*/}
                    <div className="col-md-6" style={{height: '100%'}}>
                        <h2>Preview</h2>
                        <div className="preview-panel p-3" style={{textAlign: 'left', minHeight: '50vh', height: 'auto'}}>
                            <h3 style={{textAlign: 'center'}}>{title}</h3>
                            <MarkdownRenderer content={content}></MarkdownRenderer>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default EditArticle;




