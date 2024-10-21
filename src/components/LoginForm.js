import React, { useState } from "react";
import '../css/loginForm.css';
import RequestSendUtils from "../Utils/RequestSendUtils";
import { useHistory } from 'react-router-dom';
import {message} from "antd";
import Helmet from "react-helmet"; // React Router v6

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory(); // 使用 useNavigate 代替 useHistory

    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        // 获取 Turnstile 验证结果
        const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]')?.value;

        // 检查是否获取到 Turnstile 的 response
        if (!turnstileResponse) {
            message.error("Please complete the CAPTCHA verification");
            return;
        }

        const payload = {
            username,
            password,
            turnstileResponse // 将 Turnstile 验证结果加入 payload
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
            <Helmet>
                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
            </Helmet>

            <form className="form-signin" onSubmit={handleLogin}>
                <h1 className="h3 mb-3 font-weight-normal" style={{
                    color:'#e4a3e7',
                    fontStyle: 'italic'
                }}> Please Sign in</h1>
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

                <div className="cf-turnstile" data-sitekey={process.env.REACT_APP_TURNSTILE_SITEKEY}></div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                <p className="mt-5 mb-3 text-muted">&copy; 2017-2024</p>
            </form>
            <button
                className="nav-button"
                style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 20px",
                    borderRadius: "10px" // 圆角样式
                    ,border: "none", cursor: "pointer", margin: "5px" }}
                onClick={() => window.location.href = '/register'}>
                No account yet? Sign up
            </button>

            <button
                className="nav-button"
                style={{ backgroundColor: "#f44336", color: "white", padding: "10px 20px",
                    borderRadius: "10px" // 圆角样式
                    , border: "none", cursor: "pointer", margin: "5px" }}
                onClick={() => window.location.href = '/'}>
                HP戻る
            </button>
        </div>
    );
};

export default LoginForm;
