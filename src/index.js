// index.js文件

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserManage from "./pages/UserManage";
import UserDetail from "./pages/UserDetail";

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/register" component={Register}/>
            <Route path="/login" component={Login}/>
            <Route path="/userManage" component={UserManage}/>
            <Route path="/userDetail/:id" component={UserDetail}/>
            <Route path="/" component={App}/>

        </Switch>
    </Router>,
    document.getElementById('root')
)


