import React from "react";
import RequestSendUtils from "../../Utils/RequestSendUtils"; // 假设你有用于发送删除请求的工具类
import {Button, Space} from 'antd';
import PaginatedCommon from "../common/PaginatedCommon";


const fetchData = (page, pageSize) => {
    return new Promise((resolve, reject) => {
        // 从 localStorage 中获取用户信息
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            var token = userInfo.token;
        }

        RequestSendUtils.sendGet(`/article/findAll/?currentPage=${page}&pageSize=${pageSize}`, null, (response) => {
            if (response.status === 200) {
                resolve(response.data); // 解析响应数据
            } else {
                reject(new Error('Failed to fetch data'));
            }
        }, (error) => {
            alert(error.response.data.body.message);
            reject(error); // 拒绝错误
        });
    });
};

const renderItem = (item, index, handleDelete, showDeleteButton) => (
    <div className={"d-flex justify-content-between ml-auto"} key={item.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <div className="text-left">
            <a href={`/article/${item.id}`} style={{ fontSize: '30px', fontWeight: 'bold' }}>
                {item.title}
            </a>
            <p style={{ fontSize: '16px', fontStyle: 'italic' }}>
                {item.preface}Dockerfile
                buildspec.yml
                appspec.yml
            </p>
            <p style={{ fontSize: '14px' }}>
                {new Date(item.createdDate).toISOString().slice(0, 16).replace('T', ' ')}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {item.createdUserName}
            </p>
        </div>

        <Space size="middle">
            {showDeleteButton && (
                <Button type="primary" danger onClick={() => handleDelete(item.id)}>
                    Delete
                </Button>
            )}
        </Space>
    </div>
);





const FindArticle = () => {
    return (

        // 在父组件中调用
        <PaginatedCommon
            fetchData={fetchData}
            renderItem={renderItem}
            showDeleteButton={false}  // 控制是否显示删除按钮
            deleteApiBasePath="/article" // 控制删除 API 的基础路径
        />
    );
};

export default FindArticle;


