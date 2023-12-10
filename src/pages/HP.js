import logo from '../logo.svg';
import Navibar from "../components/Navibar";
import React, {Component} from "react";


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Login from "./Login";
import Clock from "../components/test/Clock";
import LatestArticle from "../components/article/LatestArticle";
export default class HP extends Component{

    constructor() {
        super();
        this.state={
            username:""
        };
    }

    componentDidMount() {
        // 从 localStorage 中获取用户信息
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo){
            // 如果 userInfo 存在，则获取其中的 name 并更新组件状态
            this.setState({
                    username:userInfo.user.username
                }
            )
        }
        document.title="welcome to HP"
    }

    render() {
    return  (
        <div>
            <title>HomePage</title>
            <Navibar username={this.state.username}/>
            <LatestArticle></LatestArticle>
            {/*<Clock/>*/}
        </div>

    )
  }
  
}

