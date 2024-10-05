import React, { useState } from "react";
import '../css/loginForm.css';
import RequestSendUtils from "../Utils/RequestSendUtils";
import { useHistory } from 'react-router-dom';
import {message} from "antd"; // React Router v6

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory(); // 使用 useNavigate 代替 useHistory

    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const payload = {
            username,
            password
        };

        try {
            const responseData = await RequestSendUtils.sendPostWithReturn("/user/login", payload, null);
            if (responseData.code === "200") {
                const userInfo = responseData.dataContent;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                message.success("Login successful! ");
                // 使用 navigate 进行页面跳转
                history.push( "/");
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Login failed")
        }
    };

    return (
        <div className="my-form">
            <form className="form-signin" onSubmit={handleLogin}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <input
                    type="text"
                    id="userName"
                    className="form-control"
                    onChange={handleChange(setUsername)}
                    placeholder="Username"
                    required
                    autoFocus
                />
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    onChange={handleChange(setPassword)}
                    placeholder="Password"
                    required
                />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                <p className="mt-5 mb-3 text-muted">&copy; 2017-2024</p>
            </form>
            <a className="nav-link" style={{ color: "blue" }} href="/register">no account yet? sign up</a>
        </div>
    );
};

export default LoginForm;
