// import 'bootstrap/js/dist/dropdown'
import React, {Component} from "react";
import "../css/navibar.css"
import axios, {Axios} from "axios";
import RequestSendUtils from "../Utils/RequestSendUtils";

function quitUser() {
    localStorage.removeItem("userInfo")
    window.location.href = "/"
}

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
            RequestSendUtils.sendGet("/user/find/" + userId, token, (response) => {
                    if (response.status == 200) {
                        // alert(response.data.message)
                        console.log(response.data.message)
                    }
                }, (error) => {
                    alert(error.response.data.body.message);
                    quitUser();
                }
            )

            // 如果 userInfo 存在，则获取其中的 name 并更新组件状态
            this.setState({
                    username: userInfo.user4Display.username,
                    isAdmin: userInfo.user4Display.role.roleName == "admin"
                }
            )
        }
    }

    render() {
        const username = this.state.username;
        const isAdmin = this.state.isAdmin;

        const userAvaterContent = !username ? (
            <a className="nav-link ml-auto" style={{color: "white"}} href="/login">sign in/sign up</a>
        ) : (
            <div className="d-flex justify-content-between ml-auto">
                <a className="btn btn-primary btn-lg" href="/article/create" role="button">create article</a>

                <div className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"
                       aria-expanded="false">welcome,{username}!</a>
                    <div className="dropdown-menu" aria-labelledby="dropdown01">
                        {isAdmin && <a className="dropdown-item" href="/userManage">user management</a>}
                        <a className="dropdown-item" href="#" hidden={true}> Action</a>
                        <a className="dropdown-item" onClick={this.quit} href="#">quit</a>
                    </div>
                </div>

            </div>

        );

        return (
            <div className="Navibar">
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top" style={
                    {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                }>
                    <a className="navbar-brand" href="/">Home</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarsExampleDefault"
                            aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        {/*<ul className="navbar-nav mr-auto">*/}
                        {/*    <li className="nav-item active">*/}
                        {/*        <a className="nav-link" href="/" hidden={true}>article <span className="sr-only">(current)</span></a>*/}
                        {/*    </li>*/}
                        {/*    <li className="nav-item active">*/}
                        {/*        <a className="nav-link" href="/" hidden={true}>catalog <span className="sr-only">(current)</span></a>*/}
                        {/*    </li>*/}
                        {/*    /!*<li className="nav-item">*!/*/}
                        {/*    /!*    <a className="nav-link disabled">Disabled</a>*!/*/}
                        {/*    /!*</li>*!/*/}
                        {/*    /!*<li className="nav-item dropdown">*!/*/}
                        {/*    /!*    <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"*!/*/}
                        {/*    /!*       aria-expanded="false">Dropdown</a>*!/*/}
                        {/*    /!*    <div className="dropdown-menu" aria-labelledby="dropdown01">*!/*/}
                        {/*    /!*        <a className="dropdown-item" href="#">Action</a>*!/*/}
                        {/*    /!*        <a className="dropdown-item" href="#">Another action</a>*!/*/}
                        {/*    /!*        <a className="dropdown-item" href="#">Something else here</a>*!/*/}
                        {/*    /!*    </div>*!/*/}
                        {/*    /!*</li>*!/*/}
                        {/*</ul>*/}


                        {/*<form className="form-inline my-2 my-lg-0 mr-3 ml-auto">*/}
                        {/*    <input className="form-control mr-sm-2" type="text" placeholder="Search"*/}
                        {/*           aria-label="Search"/>*/}
                        {/*    <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>*/}
                        {/*</form>*/}

                        {userAvaterContent}
                    </div>

                </nav>
            </div>
        )
    }
}

