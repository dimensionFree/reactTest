import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import RequestSendUtils from "../Utils/RequestSendUtils";
import Navibar from "../components/Navibar";

const CreateArticle = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 触发保存事件的函数

    const handleSave = async () => {
        try {
            let token = RequestSendUtils.getToken();

            let payload = {
                title: title,
                content: content
            };

            const response = await RequestSendUtils.sendPostWithReturn("/article/create", payload, token);
            // while (!response){
            //
            // }
            const data = await response.dataContent;
            console.log(data)
            if (data){
                alert("save successful!"+data);
                window.location.href = "/article/read/"+data
            }

        } catch (error) {
            alert("error:"+ error);
        }
    };

    return (
        <div className="container my-5">
            <Navibar/>
            <h1>Create New Article</h1>
            <div className="row" style={{ display: 'flex', height: '50vh' }}>
                {/* 左边的输入区域 */}
                <div className="col-md-6" style={{ height: '100%'}}>
                    <div className="form-group">
                        <label htmlFor="title">Article Title</label>
                        <input style={{overflow: 'auto' }}
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
                            style={{ height: '100%', resize: 'none',overflow: 'auto' }}
                        />
                    </div>

                    {/* 保存按钮 */}
                    <button onClick={handleSave} className="btn btn-primary mt-5">
                        Save Article
                    </button>
                </div>

                {/* 右边的预览区域 */}
                <div className="col-md-6" style={{ height: '100%' }}>
                    <h2>Preview</h2>
                    <div className="border p-3" style={{ textAlign: 'left', height: 'calc(100% - 40px)',overflow: 'auto' }}>
                        <h3>{title}</h3>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CreateArticle;
