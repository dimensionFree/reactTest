import React, { useState, useEffect } from "react";
import '../../css/LatestArticle.css';
import RequestSendUtils from "../../Utils/RequestSendUtils";
import {message} from "antd";

const LatestArticle = () => {
    // 使用 useState 初始化状态
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [preface, setPreface] = useState("");

    // 使用 useEffect 来替代 componentDidMount
    useEffect(() => {
        getLatestArticle(); // 组件挂载后调用
    }, []); // 空数组表示只在组件首次渲染后执行一次

    const getLatestArticle = async () => {

        try {
            const response = await RequestSendUtils.sendGetWithReturn("/article/read/latest", null);
            const data = await response.dataContent;

            // 更新状态
            setId(data.id||"");
            setTitle(data.title || ""); // 如果没有 title，设置为空字符串
            setPreface(data.preface || ""); // 如果没有 preface，设置为空字符串
        } catch (error) {
            message.error(error.response.data.body.message);

        }
    };

    return (
        <div className="jumbotron p-4 p-md-5 text-dark rounded text-center">
            <div className="d-flex justify-content-center align-items-center">
                <div className="col-md-6 px-0">
                    <h1 className="display-4 font-italic">
                        {title ? title : "got some article pls"}
                    </h1>
                    <p className="lead my-3">
                        {preface ? preface : "got some preface pls"}
                    </p>
                    <p className="lead mb-0">
                        <a href={`/article/read/${id}`} className="text-dark font-weight-bold">Continue reading...</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LatestArticle;
