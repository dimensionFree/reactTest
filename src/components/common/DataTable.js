// src/DataTable.js
import React from 'react';

const DataTable = ({ data, columns }) => {
    return (
        <table className="table table-striped">
            <thead>
            <tr>
                {columns.map((col, index) => (
                    <th scope="col" key={index}>{col.header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                        <td key={colIndex}>{row[col.accessor]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DataTable;
