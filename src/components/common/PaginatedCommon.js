import React, {useEffect, useState} from 'react';
import {message, Pagination} from 'antd';
import RequestSendUtils from "../../Utils/RequestSendUtils"; // 假设你有用于发送删除请求的工具类

const PaginatedCommon = ({fetchData, renderItem, showDeleteButton, deleteApiBasePath = '' ,initFilter=''}) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let token = "";
    if (userInfo) {
        token = userInfo.token;
    }

    useEffect(() => {
        setLoading(true);
        fetchData(page, pageSize,initFilter).then((result) => {
            let total = result.dataContent.total;
            let list = result.dataContent.list;
            setData(list);
            setTotal(total);
            setLoading(false);
        });
    }, [page, pageSize, fetchData]);

    const handlePageChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const handleDelete = async (id) => {
        try {
            const deleteUrl = `${deleteApiBasePath}/delete/${id}`;
            const response = await RequestSendUtils.sendDelete(deleteUrl, token);
            if (response.status === 200) {
                message.success('Deleted successfully');
                // 删除成功后重新获取数据
                setLoading(true);
                fetchData(page, pageSize).then((result) => {
                    let total = result.dataContent.total;
                    let list = result.dataContent.list;
                    setData(list);
                    setTotal(total);
                    setLoading(false);
                }).catch(() => {
                    setLoading(false);
                });
            } else {
                message.error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            message.error('Error deleting data');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* 使用 renderItem 进行数据渲染 */}
            {data.map((item, index) => renderItem(item, index, handleDelete, showDeleteButton))}
            {/* Pagination 控件 */}
            <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={true}
            />
        </div>
    );
};

export default PaginatedCommon;
