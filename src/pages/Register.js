import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import {TestLoginForm} from "../components/test";
import SEO from "../components/common/SEO";
import Navibar from "../components/Navibar";

export default class Register extends Component {
    render() {
        return (
            <div className="container-form">
                <SEO title={"登録"} description={"Register"}/>
                <Navibar/>
                <RegisterForm/>
                {/*<TestLoginForm></TestLoginForm>*/}
            </div>

        )
    }
}

