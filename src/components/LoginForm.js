import React, {Component} from "react";
import '../css/loginForm.css'
import bt from '../assets/brand/bootstrap-solid.svg'
import axios from "axios";
import RequestSendUtils from "../Utils/RequestSendUtils";



export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.Login = this.Login.bind(this)

    }

    handleChange(name, event) {
        var newState = {};
        newState[name] = event.target.value;
        this.setState(newState);

    }

    testMethod(){
        return "test";
    }


    Login(e) {
        e.preventDefault();
        // alert(this.state.username + "  " + this.state.password);
        // const formData = new FormData();
        // formData.append("username", this.state.username);
        // formData.append("password", this.state.password);
        //backend @RequestParam -> formData 可用 json 不可用
        let payload = {
            username:this.state.username,
            password:this.state.password
        };
        RequestSendUtils.SendPost("/user/login",payload,null,(response) => {
            if (response.status == 200) {
                // alert(response.data)
                const data = response.data; // 获取响应数据
                const userInfo = data.dataContent; // 从响应数据中获取令牌
                // 将令牌存储到localStorage
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                //本地窗口
                window.location.href="/"
            }
        },(error)=>{
            alert(error.response.data.message);
        })
    }

    render() {
        return (
            <div className="my-form">

                <form className="form-signin" onSubmit={this.Login}>
                    {/*<img className="mb-4" src={bt} alt="" width="72" height="72"/>*/}
                    <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                    <label htmlFor="inputEmail" className="sr-only">Email address</label>
                    <input type="text" id="userName" className="form-control"
                           onChange={this.handleChange.bind(this, "username")} placeholder="Username" required
                           autoFocus/>
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input type="password" id="inputPassword" onChange={this.handleChange.bind(this, "password")}
                           className="form-control" placeholder="Password" required/>
                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" value="remember-me"/> Remember me
                        </label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2017-2024</p>
                </form>
                <a className="nav-link" style={{color:"blue"}} href="/register">no account yet? sign up</a>
            </div>

        )
    }
}
