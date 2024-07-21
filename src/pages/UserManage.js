import logo from '../logo.svg';
import Navibar from "../components/Navibar";
import React, {Component} from "react";
import PaginatedTable from "../components/common/PaginatedTable";
import requestSendUtils from "../Utils/RequestSendUtils";
import RequestSendUtils from "../Utils/RequestSendUtils";



const fetchData = (page, pageSize) => {
    return new Promise((resolve, reject) => {
        // 从 localStorage 中获取用户信息
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            var token = userInfo.token;
        }

        RequestSendUtils.SendGet(`/user/findAll/?currentPage=${page}&pageSize=${pageSize}`, token, (response) => {
            if (response.status === 200) {

                response.data.dataContent.list = response.data.dataContent.list.map(user => ({
                    ...user,
                    roleName: user.role.roleName
                }));
                // resolve({ data: processedData});
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

const columns = [
    {field: 'id', headerName: '#', width: 90},
    {field: 'username', headerName: 'Name', width: 150},
    {field: 'email', headerName: 'Email', width: 150},
    {field: 'roleName', headerName: 'Role', width: 110},
];

const UserManage = () => {
    return (
        <div className="container mt-5 pt-5">
            <Navibar/>
            <h1 className="mb-4">User Management</h1>
            <PaginatedTable columns={columns} fetchData={fetchData}/>
        </div>
    );
};

export default UserManage;


