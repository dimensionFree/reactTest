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
export default class HP extends Component{
  render() {
    return  (
        <div>
            <title>HomePage</title>
            <Navibar/>
        </div>

    )
  }
}
