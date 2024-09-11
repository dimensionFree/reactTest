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
import FindArticle from "../components/article/FindArticles";
export default class HP extends Component{

    constructor() {
        super();
        // this.state={
        //     username:""
        // };
    }

    componentDidMount() {

        document.title="welcome to HP"
    }

    render() {
    return  (
        <div>
            <title>HomePage</title>
            <Navibar/>
            <LatestArticle></LatestArticle>
            <FindArticle></FindArticle>
            {/*<Clock/>*/}
        </div>

    )
  }
  
}

