import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";
import SEO from "../components/common/SEO";
import Helmet from "react-helmet";

export default class Login extends Component {
    render() {
        return (
            <div className="container-form">
                <Helmet>
                    <meta name="robots" content="noindex"/>
                </Helmet>
                <SEO title={"login"} description={"login"}/>

                <LoginForm/>
            </div>

        )
    }
}



