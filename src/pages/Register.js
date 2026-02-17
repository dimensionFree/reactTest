import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import {TestLoginForm} from "../components/test";
import SEO from "../components/common/SEO";
import Navibar from "../components/Navibar";
import Helmet from "react-helmet";

export default class Register extends Component {
    render() {
        return (
            <div className="container-form">
                <Helmet>
                    <meta name="robots" content="noindex"/>
                </Helmet>
                <SEO title={"鐧婚尣"} description={"Register"}/>
                <RegisterForm/>
                {/*<TestLoginForm></TestLoginForm>*/}
            </div>

        )
    }
}



