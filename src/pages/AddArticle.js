import React, {Component} from "react";
import ReactDOM from 'react-dom'
import LoginForm from "../components/LoginForm";
import Navibar from "../components/Navibar";

export default class Login extends Component{
  render() {
    return  (
        <div>
          <title>Login</title>
          <LoginForm/>
          <Navibar username={this.state.username}/>

        </div>

    )
  }
}

