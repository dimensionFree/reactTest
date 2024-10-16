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
import {SITE_NAME} from "../components/common/constants";
import Helmet from "react-helmet";
import SEO from "../components/common/SEO";
export default class HP extends Component{

    constructor() {
        super();
        // this.state={
        //     username:""
        // };
    }

    render() {
    return  (
        <div>
            <Helmet>
                <title>{SITE_NAME}</title>  {/* 使用常量 */}
                <meta name="description" content={`homepage of ${SITE_NAME}`} />
            </Helmet>
            <Navibar/>
            <LatestArticle></LatestArticle>
            {/* 在这里可以通过用户输入或选择更改 sortBy 和 filters */}
            <FindArticle/>
            {/*filters= {{ id: 1 }}*/}
            {/*<Clock/>*/}
        </div>

    )
  }
  
}

