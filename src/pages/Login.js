import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";
import SEO from "../components/common/SEO";

export default class Login extends Component {
    render() {
        return (
            <div className="container-form">
                <SEO title={"ログイン"} description={"login"}/>

                <LoginForm/>
            </div>

        )
    }
}

