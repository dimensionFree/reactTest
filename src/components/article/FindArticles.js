import React from "react";
import RequestSendUtils from "../../Utils/RequestSendUtils"; // 假设你有用于发送删除请求的工具类
import {Button, Space} from 'antd';
import PaginatedCommon from "../common/PaginatedCommon";


const fetchData = (page, pageSize,filters) => {
    return new Promise((resolve, reject) => {


        // 构造查询参数
        let queryParams = `currentPage=${page}&pageSize=${pageSize}`;

        // 如果有筛选条件
        if (filters) {
            //filters is string "{"id":1}"
            // alert(JSON.stringify(filters))
            // 提取出 filters 对象
            const extractedFilters = filters.filters;

            // 将提取出的 filters 对象转换为 JSON 字符串
            const filtersString = JSON.stringify(extractedFilters);

            console.log(filtersString); // 输出: '{"id":1}'
            if (filtersString){
                const encodedFilters = encodeURIComponent(filtersString);
                queryParams += `&filtersStr=${encodedFilters}`;
            }

        }

        RequestSendUtils.sendGet(`/article/findAll/?${queryParams}`, null, (response) => {
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
            <a href={`/article/read/${item.id}`} style={{ fontSize: '30px', fontWeight: 'bold' }}>
                {item.title}
            </a>
            <p style={{ fontSize: '16px', fontStyle: 'italic' }}>
                {item.preface}
            </p>
            <p style={{ fontSize: '14px' }}>
                {new Date(item.createdDate).toISOString().slice(0, 16).replace('T', ' ')}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {item.createdUserName}
            </p>
        </div>

        <Space size="middle">
            {showDeleteButton===true && (
                <Button type="primary" danger onClick={() => handleDelete(item.id)}>
                    Delete
                </Button>
            )}
        </Space>
    </div>
);





const FindArticle = (filter= {},isShowDeleteButton) => {

    return (

        // 在父组件中调用
        <PaginatedCommon
            fetchData={fetchData}
            renderItem={renderItem}
            showDeleteButton={isShowDeleteButton}  // 控制是否显示删除按钮
            deleteApiBasePath="/article" // 控制删除 API 的基础路径
            initFilter={filter}   //{filter} //'{"id": 1}'

            // 控制删除 API 的基础路径
        />
    );
};

export default FindArticle;


