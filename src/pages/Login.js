import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";
import SEO from "../components/common/SEO";
import Helmet from "react-helmet";

export default class Login extends Component {
    render() {
        return (
            <div className="container-form" style={{
                backgroundImage: `url('/static/pic/BG3.png')`,
                backgroundSize: 'cover',
                // backgroundPosition: 'center',
                // height: '100vh',  // 确保 div 高度足够
                margin: 0,  // 确保没有额外的 margin
                padding: 0  // 确保没有额外的 padding
            }}>
                <Helmet>
                    <meta name="robots" content="noindex"/>
                </Helmet>
                <SEO title={"ログイン"} description={"login"}/>

                <LoginForm/>
            </div>

        )
    }
}

