import logo from '../logo.svg';
import Navibar from "../components/Navibar";
import React, {Component} from "react";
import PaginatedTable from "../components/common/PaginatedTable";
import RequestSendUtils from "../Utils/RequestSendUtils";
import Link from "antd/es/typography/Link";
import {Button, Space, message } from 'antd';


const fetchData = (page, pageSize) => {
    return new Promise((resolve, reject) => {
        // 从 localStorage 中获取用户信息
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            var token = userInfo.token;
        }

        RequestSendUtils.SendGet(`/user/findAll/?currentPage=${page}&pageSize=${pageSize}`, token, (response) => {
            if (response.status === 200) {

                // response.data.dataContent.list = response.data.dataContent.list.map(user => ({
                //     ...user,
                //     roleName: user.role.roleName
                // }));
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
    {
        title: 'username',
        dataIndex: 'username',
        key: 'username',
        render: (text, record) => <Link href={`/userDetail/${record.id}`}>{text}</Link>,
    },
    {
        title: 'Role Name',
        dataIndex: ['role', 'roleName'],
        key: 'roleName',
    },
    // 添加其他需要显示的列
];



const UserManage = () => {
    return (
        <div className="container mt-5 pt-5">
            <title>user manage</title>
            <Navibar/>
            <h1 className="mb-4">User Management</h1>
            <PaginatedTable
                columns={columns}
                fetchData={fetchData}

            />

        </div>
    );
};

export default UserManage;


