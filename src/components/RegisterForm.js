import React, { useState, useEffect } from "react";
import '../css/loginForm.css';
import bt from '../assets/brand/bootstrap-solid.svg';
import RequestSendUtils from "../Utils/RequestSendUtils";

const RegisterForm = () => {
    const [formState, setFormState] = useState({
        username: "",
        password: "",
        email: "",
        verificationCode: ""
    });
    const [isSending, setIsSending] = useState(false);
    const [timer, setTimer] = useState(0);

    const handleChange = (name, event) => {
        setFormState({
            ...formState,
            [name]: event.target.value
        });
    };

    const sendVerificationCode = async () => {
        try {
            let payload = {
                email: formState.email
            };
            await RequestSendUtils.sendPost("/user/send-verification-code", payload, null);

            // Start countdown
            setIsSending(true);
            setTimer(60);
        } catch (error) {
            alert(error.response?.data?.body?.message || "Error sending verification code");
        }
    };

    useEffect(() => {
        let interval = null;
        if (isSending && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsSending(false);
        }
        return () => clearInterval(interval);
    }, [isSending, timer]);

    const Register = (e) => {
        e.preventDefault();
        let payload = {
            username: formState.username,
            password: formState.password,
            email: formState.email,
            verificationCode: formState.verificationCode
        };
        RequestSendUtils.sendPost("/user/register", payload, null, (response) => {
            if (response.status === 200) {
                const userInfo = response.data.dataContent;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                window.location.href = "/";
            } else if (response.status === 400) {
                alert(response.data);
            }
        }, (error) => {
            alert(error.response?.data?.message || "Registration error");
        });
    };

    return (
        <div className="my-form">
            <form className="form-signin" onSubmit={Register}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>

                {/* Username */}
                <label htmlFor="inputUserName" className="sr-only">Username</label>
                <input
                    type="text"
                    id="inputUserName"
                    className="form-control"
                    onChange={(e) => handleChange("username", e)}
                    value={formState.username}
                    placeholder="Username"
                    required
                    autoFocus
                />

                {/* Email */}
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    onChange={(e) => handleChange("email", e)}
                    value={formState.email}
                    placeholder="Email address"
                    required
                />

                {/* Send Verification Code Button */}
                <button
                    type="button"
                    className="btn btn-secondary btn-block mt-2"
                    onClick={sendVerificationCode}
                    disabled={isSending}>
                    {isSending ? `Resend in ${timer}s` : "Send Verification Code"}
                </button>

                {/* Verification Code */}
                <label htmlFor="inputVerificationCode" className="sr-only">Verification Code</label>
                <input
                    type="text"
                    id="inputVerificationCode"
                    className="form-control mt-2"
                    onChange={(e) => handleChange("verificationCode", e)}
                    value={formState.verificationCode}
                    placeholder="Verification Code"
                    required
                />

                {/* Password */}
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control mt-2"
                    onChange={(e) => handleChange("password", e)}
                    value={formState.password}
                    placeholder="Password"
                    required
                />

                <br />

                {/* Submit Button */}
                <button className="btn btn-lg btn-primary btn-block" type="submit">
                    Sign up
                </button>

                <p className="mt-5 mb-3 text-muted">&copy; 2017-2021</p>
            </form>
        </div>
    );
};

export default RegisterForm;
