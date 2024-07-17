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
import DataTable from "../components/common/DataTable";

export default class UserManage extends Component {


    constructor() {
        super();
    }


    componentDidMount() {
        document.title = "User management"
    }

    render() {
        const users = [
            {id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin'},
            {id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User'},
            {id: 3, name: 'Sam Green', email: 'sam@example.com', role: 'Moderator'},
        ];
        return (
            <div>
                <title>HomePage</title>
                <Navibar/>
                <br/>
                <DataTable users={users}/>

                {/*<Clock/>*/}
            </div>

        )
    }

}

