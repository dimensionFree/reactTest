import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";

export default class Login extends Component{
  render() {
    return  (
        <div>
          <title>Login</title>
          <LoginForm/>
        </div>

    )
  }
}

