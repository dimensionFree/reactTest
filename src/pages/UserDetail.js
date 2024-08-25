
import React, {Component,useState, useEffect} from "react";
import Navibar from "../components/Navibar";
import { useParams } from 'react-router-dom';
import RequestSendUtils from "../Utils/RequestSendUtils";


const UserDetail = () => {

    const { id } = useParams();

    const [userData, setUserData] = useState(null); // 初始化用户数据状态为 null

    useEffect(() => {
        // 模拟 API 调用
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));


        const fetchUserData = async () => {

            try {
                // 假设 API 返回的数据是 userData
                var token = userInfo.token;
                const response= await RequestSendUtils.SendGetWithReturn("/user/find/" + id, token);
                const data = await response.dataContent;
                // console.log(data);
                setUserData(data); // 更新 userData 的状态
            } catch (error) {
                alert(error.response.data.body.message);
                window.location.href = "/"
            }
        };

        fetchUserData();
    }, []);


    if (!userData) {
        return <p>Loading...</p>; // 在 userData 为 null 时显示加载文本
    }

    // alert(id)

    return (
        <div className="container mt-5 pt-5">
        <title>user manage</title>
            <Navibar/>
            <h1 className="mb-4">User Detail</h1>
            {/*<p><strong>用户名:</strong> {userData.username}</p>*/}
            <div className="form-group">
                <span>UserName</span>
                <input type="text" className="form-control" id="username" defaultValue={userData.username} required=""/>
            </div>

            {/*<p>User ID: {id}</p>*/}
        </div>
    );
};

export default UserDetail;


