import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import {TestLoginForm} from "../components/test";

export default class Register extends Component{
  render() {
    return  (
        <div className="container-form">
          <title>Register</title>
          <RegisterForm/>
          {/*<TestLoginForm></TestLoginForm>*/}
        </div>

    )
  }
}

