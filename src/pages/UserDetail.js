import React, {Component, useState, useEffect} from "react";
import Navibar from "../components/Navibar";
import {useParams} from 'react-router-dom';
import RequestSendUtils from "../Utils/RequestSendUtils";


const UserDetail = () => {

    function saveUserInfo() {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // 从表单中获取更新后的用户数据
        const updatedUserData = {
            id: userData.id,  // 这里你已经有了用户的 ID
            username: document.getElementById("username").value,  // 获取用户名
            roleId: document.getElementById("role").value,  // 获取角色
            state: document.getElementById("state").value,  // 获取状态
        };
        const updateUserInfo = async () => {

            try {
                // 假设 API 返回的数据是 userData
                var token = userInfo.token;
                const response = await RequestSendUtils.sendPutWithReturn("/user/update/" + id,updatedUserData, token);
                const data = await response.dataContent;
                console.log(data);
                alert("update success")
                // setUserData(data); // 更新 userData 的状态
            } catch (error) {
                alert(error.response.data.body.message);
                window.location.href = "/"
            }
        };

        updateUserInfo();
        
    }

    const {id} = useParams();

    const [userData, setUserData] = useState(null); // 初始化用户数据状态为 null
    const [roleList, setRoleList] = useState([]); // 初始化用户数据状态为 null

    useEffect(() => {
        // 模拟 API 调用
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        var token = userInfo.token;

        const fetchUserData = async () => {

            try {
                // 假设 API 返回的数据是 userData
                const response = await RequestSendUtils.sendGetWithReturn("/user/find/" + id, token);
                const data = await response.dataContent;
                console.log("user:"+(data.role ? data.role.roleName : ""));
                setUserData(data); // 更新 userData 的状态
            } catch (error) {
                alert(error.response.data.body.message);
                window.location.href = "/"
            }
        };
        const fetchAllRoles = async () => {
            try {
                const response = await RequestSendUtils.sendGetWithReturn("/role/findAll/", token);
                const rolesData = await response.dataContent.list;
                console.log(rolesData);
                setRoleList(rolesData); // 将获取到的角色列表保存到状态中
            } catch (error) {
                console.log("Failed to fetch roles")
            }
        };

        fetchAllRoles();
        fetchUserData();
    }, []);


    if (!userData) {
        return <p>Loading...</p>; // 在 userData 为 null 时显示加载文本
    }

    return (
        <div className="container mt-5 pt-5">
            <title>user manage</title>
            <Navibar/>
            <h1 className="mb-4">User Detail</h1>
            {/*<p><strong>用户名:</strong> {userData.username}</p>*/}
            <div className="form-group form-inline mx-auto">
                <div className="form-group form-inline mx-auto">
                    <span className="mr-2">UserName</span>
                    <input type="text" className="form-control" id="username" defaultValue={userData.username}
                           required=""/>
                </div>
                {/*<div className="form-group form-inline mx-auto">*/}
                {/*    <span className="mr-2">email</span>*/}
                {/*    <input type="text" className="form-control" id="email" defaultValue={userData.email} required=""/>*/}
                {/*</div>*/}
                <div className="form-group form-inline mx-auto">
                    <span className="mr-2">role</span>
                    <select className="form-control" id="role" defaultValue={userData.role ? userData.role.id : ""} required>
                        {roleList.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.roleName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group form-inline mx-auto">
                    <span className="mr-2">state</span>
                    <select className="form-control" id="state" defaultValue={userData.state} required>
                        <option key="active_Id" value="ACTIVE">
                            アクティブ
                        </option>
                        <option key="locked_Id" value="LOCKED">
                            ロック
                        </option>
                    </select>
                </div>
                <div className="d-flex justify-content-start">
                    <button className="btn btn-lg btn-primary" onClick={saveUserInfo}>Save</button>
                </div>
            </div>

            {/*<button className="btn btn-lg btn-primary" onClick={() => saveUserInfo()}>save</button>*/}
            {/*<p>User ID: {id}</p>*/}
        </div>
    );
};

export default UserDetail;


