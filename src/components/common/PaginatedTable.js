import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const PaginatedTable = ({ columns, fetchData }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("loading")
        setLoading(true);
        fetchData(page, pageSize).then((result) => {
            console.log(result)
            let total = result.dataContent.total;
            let list = result.dataContent.list;
            setData(list);
            setRowCount(total);
            setLoading(false);
        });
    }, [page, pageSize, fetchData]);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pagination
                page={page}
                pageSize={pageSize}
                rowCount={rowCount}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                loading={loading}
                checkboxSelection
            />
        </div>
    );
};

export default PaginatedTable;
