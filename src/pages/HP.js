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
export default class HP extends Component{

    componentDidMount() {
        document.title="welcome to HP"
        let user = JSON.parse(localStorage.getItem("userInfo")).user;
        alert(user.username)
    }

    render() {
    return  (
        <div>
            <title>HomePage</title>
            <Navibar/>
            {/*<Clock/>*/}
        </div>

    )
  }
  
}

