import React, { useEffect, useState } from 'react';
import { message, Pagination } from 'antd';
import RequestSendUtils from "../../Utils/RequestSendUtils";
import { useHistory } from 'react-router-dom';

const PaginatedCommon = ({ fetchData, renderItem, showDeleteButton, showEditButton, crudApiBasePath = '', initFilter = '' }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const history = useHistory();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let token = "";
    if (userInfo) {
        token = userInfo.token;
    }

    const fetchAndUpdateData = (page, pageSize, filter) => {
        setLoading(true);
        fetchData(page, pageSize, filter).then((result) => {
            let total = result.dataContent.total;
            let list = result.dataContent.list;
            setData(list);
            setTotal(total);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    // 当 page, pageSize, 或 initFilter 变化时重新获取数据
    useEffect(() => {
        fetchAndUpdateData(page, pageSize, initFilter);
    }, [page, pageSize, initFilter]); // 添加 initFilter 作为依赖项

    const handlePageChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const handleDelete = async (id) => {
        try {
            const deleteUrl = `${crudApiBasePath}/delete/${id}`;
            const response = await RequestSendUtils.sendDeleteWithReturn(deleteUrl, token);
            if (response.status === 200) {
                message.success('Deleted successfully');
                // 删除成功后重新获取数据
                fetchAndUpdateData(page, pageSize, initFilter);
            } else {
                message.error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            message.error('Error deleting data');
        }
    };

    const handleEdit = async (id) => {
        history.push(`${crudApiBasePath}/edit/${id}`);
    };

    return (
        <div style={{ width: '100%' }}>
            {/* 使用 renderItem 进行数据渲染 */}
            {data.map((item, index) => renderItem(item, index, handleDelete, handleEdit, showDeleteButton, showEditButton))}
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
