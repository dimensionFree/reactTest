import React, { useState, useEffect } from 'react';
import {message, Pagination, Space, Table} from 'antd';
import RequestSendUtils from "../../Utils/RequestSendUtils";
import {Button} from "reactstrap";


const PaginatedTable = ({ columns, fetchData }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let token="";
    if (userInfo) {
        token = userInfo.token;
    }
    const [total, setTotal] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log("loading")
        setLoading(true);
        fetchData(page, pageSize).then((result) => {
            console.log(result)
            let total = result.dataContent.total;
            let list = result.dataContent.list;
            // setData(list);
            // setRowCount(total);
            setData(list);
            setTotal(total);
            setLoading(false);
        });
    }, [page, pageSize, fetchData]);

    const handlePageChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const extendedColumns = [
        ...columns,
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" danger onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        }
    ];

    const handleDelete = async (id) => {
        try {
            await RequestSendUtils.sendDelete(`/user/delete/${id}`, token, (response) => {
                if (response.status === 200) {

                    message.success('Deleted successfully');
                    // Refresh data after deletion
                    fetchData(page, pageSize).then((result) => {
                        let total = result.dataContent.total;
                        let list = result.dataContent.list;
                        // const { total, list } = result;
                        setData(list);
                        setTotal(total);
                    }).catch(() => {
                        setLoading(false);
                    });
                }
            }, (error) => {
                console.error('Error deleting data:', error);
                message.error('Error deleting data');
            });

        } catch (error) {
            console.error('Error deleting data:', error);
            message.error('Error deleting data');
        }
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <Table
                dataSource={data}
                columns={extendedColumns}
                pagination={false}
                rowKey="id"
            />
            <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={true}
                // onShowSizeChange={handlePageChange}
                // pageSizeOptions={['5', '10', '20', '50']} // Custom page size options
            />
        </div>


    // <div style={{ width: '100%' }}>
    //     {/* 遍历 data 数据，并展示每条数据的内容 */}
    //     {data.map((item, index) => (
    //         <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
    //             <div>
    //                 <strong>ID: </strong> {item.id}
    //             </div>
    //             {/* 你可以根据 columns 动态展示每条记录的字段 */}
    //             {columns.map((col) => (
    //                 <p key={col.key}>
    //                     <strong>{col.title}: </strong> {item[col.dataIndex]}
    //                 </p>
    //             ))}
    //             <Space size="middle">
    //                 <Button type="primary" danger onClick={() => handleDelete(item.id)}>
    //                     Delete
    //                 </Button>
    //             </Space>
    //         </div>
    //     ))}
    //     {/* Pagination 控件 */}
    //     <Pagination
    //         current={page}
    //         pageSize={pageSize}
    //         total={total}
    //         onChange={handlePageChange}
    //         showSizeChanger={true}
    //     />
    // </div>


    );
};

export default PaginatedTable;
