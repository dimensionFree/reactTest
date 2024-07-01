// import 'bootstrap/js/dist/dropdown'
import React, {Component} from "react";
import "../css/navibar.css"
import axios, {Axios} from "axios";
import RequestSendUtils from "../Utils/RequestSendUtils";

function quitUser() {
    localStorage.removeItem("userInfo")
    window.location.href = "/"
}

let requestSendUtils = new RequestSendUtils();

export default class Navibar extends Component {


    constructor() {
        super();
        this.state = {
            username: ""
        }

    }

    quit(e) {
        quitUser()
    }


    componentDidMount() {

        // 从 localStorage 中获取用户信息
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            var userId = userInfo.user4Display.id;
            var token = userInfo.token;
            requestSendUtils.SendGet("/user/find/" + userId, token, (response) => {
                    if (response.status == 200) {
                        // alert(response.data.message)
                        console.log(response.data.message)
                        // const data = response.data; // 获取响应数据
                        // const userInfo = data.dataContent; // 从响应数据中获取令牌
                        // // 将令牌存储到localStorage
                        // localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        // //本地窗口
                        // window.location.href="/"

                        //新窗口
                        // const w = window.open('_black') //这里是打开新窗口
                        // let url = 'http://localhost:3000/'
                        //     // '这里是url，可以写../../index，也可以写http://www.baidu.com'
                        // w.location.href = url //这样就可以跳转了

                    }
                    // alert(this.state.username + "  " + this.state.password + response);
                    // alert()
                    // console.log(response);
                }, (error) => {
                    // localStorage.removeItem("userInfo")
                    // window.location.href="/"
                    alert(error.response.data.body.message);
                    quitUser();
                }
            )

            // 如果 userInfo 存在，则获取其中的 name 并更新组件状态
            this.setState({
                    username: userInfo.user4Display.username
                }
            )
        }
    }

    render() {
        const username = this.state.username;
        const isAdmin = true;

        const userAvaterContent = !username ? (
            <a className="nav-link" style={{color: "white"}} href="/login">sign in</a>
        ) : (
            <div className="d-flex justify-content-between">
                <a className="btn btn-primary btn-lg" href="/article/create" role="button">create article</a>

                <div className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"
                       aria-expanded="false">welcome,{username}!</a>
                    <div className="dropdown-menu" aria-labelledby="dropdown01">
                        {isAdmin && <a className="dropdown-item" href="#">user management</a>}
                        <a className="dropdown-item" href="#"> Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item" onClick={this.quit} href="#">quit</a>
                    </div>
                </div>

            </div>

        );

        return (
            <div className="Navibar">
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarsExampleDefault"
                            aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Disabled</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"
                                   aria-expanded="false">Dropdown</a>
                                <div className="dropdown-menu" aria-labelledby="dropdown01">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                </div>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0 mr-auto">
                            <input className="form-control mr-sm-2" type="text" placeholder="Search"
                                   aria-label="Search"/>
                            <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                        </form>

                        {userAvaterContent}
                    </div>

                </nav>
            </div>
        )
    }
}

