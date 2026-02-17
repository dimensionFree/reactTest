import React, {Component, useState, useEffect} from "react";
import Navibar from "../components/Navibar";
import {useParams,useHistory} from 'react-router-dom';
import RequestSendUtils from "../Utils/RequestSendUtils";
import {message} from "antd";
import SEO from "../components/common/SEO";
import "../css/formSurface.css";


const UserDetail = () => {
    const history = useHistory();

    function saveUserInfo() {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // 浠庤〃鍗曚腑鑾峰彇鏇存柊鍚庣殑鐢ㄦ埛鏁版嵁
        const updatedUserData = {
            id: userData.id,  // 杩欓噷浣犲凡缁忔湁浜嗙敤鎴风殑 ID
            username: document.getElementById("username").value,  // 鑾峰彇鐢ㄦ埛鍚?
            roleId: document.getElementById("role").value,  // 鑾峰彇瑙掕壊
            state: document.getElementById("state").value,  // 鑾峰彇鐘舵€?
        };
        const updateUserInfo = async () => {

            try {
                // 鍋囪 API 杩斿洖鐨勬暟鎹槸 userData
                var token = userInfo.token;
                const response = await RequestSendUtils.sendPutWithReturn("/user/update/" + id,updatedUserData, token);
                const data = await response.dataContent;
                console.log(data);
                message.success("update success");
                // setUserData(data); // 鏇存柊 userData 鐨勭姸鎬?
            } catch (error) {
                message.error(error.response.data.body.message);
                history.push( "/");
            }
        };

        updateUserInfo();
        
    }

    const {id} = useParams();

    const [userData, setUserData] = useState(null); // 鍒濆鍖栫敤鎴锋暟鎹姸鎬佷负 null
    const [roleList, setRoleList] = useState([]); // 鍒濆鍖栫敤鎴锋暟鎹姸鎬佷负 null

    useEffect(() => {
        // 妯℃嫙 API 璋冪敤
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        var token = userInfo.token;

        const fetchUserData = async () => {

            try {
                // 鍋囪 API 杩斿洖鐨勬暟鎹槸 userData
                const response = await RequestSendUtils.sendGetWithReturn("/user/find/" + id, token);
                const data = await response.dataContent;
                console.log("user:"+(data.role ? data.role.roleName : ""));
                setUserData(data); // 鏇存柊 userData 鐨勭姸鎬?
            } catch (error) {
                message.error(error.response.data.body.message);

                history.push( "/");
            }
        };
        const fetchAllRoles = async () => {
            try {
                const response = await RequestSendUtils.sendGetWithReturn("/role/findAll/", token);
                const rolesData = await response.dataContent.list;
                console.log(rolesData);
                setRoleList(rolesData); // 灏嗚幏鍙栧埌鐨勮鑹插垪琛ㄤ繚瀛樺埌鐘舵€佷腑
            } catch (error) {
                console.log("Failed to fetch roles")
            }
        };

        fetchAllRoles();
        fetchUserData();
    }, []);


    if (!userData) {
        return <p>Loading...</p>; // 鍦?userData 涓?null 鏃舵樉绀哄姞杞芥枃鏈?
    }

    return (
        <div>
            <SEO title={userData.username} description={"userDetail"}/>
            <Navibar/>
            <div className="container mt-5 pt-5 form-surface">
                <h1 className="mb-4">User Detail</h1>
                {/*<p><strong>鐢ㄦ埛鍚?</strong> {userData.username}</p>*/}
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
                                銈偗銉嗐偅銉?
                            </option>
                            <option key="locked_Id" value="LOCKED">
                                銉儍銈?
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


        </div>
    );
};

export default UserDetail;





