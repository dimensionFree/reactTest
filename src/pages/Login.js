import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";

export default class Login extends Component{
  render() {
    return  (
        <div className="container-form">
        <title>Login</title>
          <LoginForm/>
        </div>

    )
  }
}

