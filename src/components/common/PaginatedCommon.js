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

    const fetchAndUpdateData = (pageNum, sizeNum, filter) => {
        setLoading(true);
        fetchData(pageNum, sizeNum, filter).then((result) => {
            const totalCount = result.dataContent.total;
            const list = result.dataContent.list;
            setData(list);
            setTotal(totalCount);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchAndUpdateData(page, pageSize, initFilter);
    }, [page, pageSize, initFilter]);

    const handlePageChange = (nextPage, nextPageSize) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    };

    const handleDelete = async (id) => {
        try {
            const deleteUrl = `${crudApiBasePath}/delete/${id}`;
            const response = await RequestSendUtils.sendDeleteWithReturn(deleteUrl, token);
            if (response.status === 200) {
                message.success('Deleted successfully');
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

    const handleRefresh = () => {
        fetchAndUpdateData(page, pageSize, initFilter);
    };

    return (
        <div style={{ width: '100%' }}>
            {data.map((item, index) => renderItem(item, index, handleDelete, handleEdit, showDeleteButton, showEditButton, handleRefresh))}
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
