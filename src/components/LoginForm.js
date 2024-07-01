import React, {Component} from "react";
import '../css/loginForm.css'
import bt from '../assets/brand/bootstrap-solid.svg'
import axios from "axios";
import RequestSendUtils from "../Utils/RequestSendUtils";


let requestSendUtils = new RequestSendUtils();

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
        const formData = new FormData();
        // formData.append("username", this.state.username);
        // formData.append("password", this.state.password);
        //backend @RequestParam -> formData 可用 json 不可用


        let payload = {
            username:this.state.username,
            password:this.state.password
        };
        requestSendUtils.SendPost("/user/login",payload,null,(response) => {
            if (response.status == 200) {
                // alert(response.data)
                const data = response.data; // 获取响应数据
                const userInfo = data.dataContent; // 从响应数据中获取令牌
                // 将令牌存储到localStorage
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                //本地窗口
                window.location.href="/"

                //新窗口
                // const w = window.open('_black') //这里是打开新窗口
                // let url = 'http://localhost:3000/'
                //     // '这里是url，可以写../../index，也可以写http://www.baidu.com'
                // w.location.href = url //这样就可以跳转了

            }
        })

        // axios.post('http://localhost/user/login',
        //         payload
        //     , {
        //         headers: {
        //             'Content-Type': 'application/json', // 设置请求内容类型为 JSON
        //             // 还可以添加其他自定义请求头
        //             // 'Authorization': 'Bearer YourAccessToken' // 例如添加身份验证令牌
        //         }
        //     }).then(function (response) {
        //     if (response.status == 200) {
        //         // alert(response.data)
        //         const data = response.data; // 获取响应数据
        //         const userInfo = data.dataContent; // 从响应数据中获取令牌
        //         // 将令牌存储到localStorage
        //         localStorage.setItem('userInfo', JSON.stringify(userInfo));
        //         //本地窗口
        //         window.location.href="/"
        //
        //         //新窗口
        //         // const w = window.open('_black') //这里是打开新窗口
        //         // let url = 'http://localhost:3000/'
        //         //     // '这里是url，可以写../../index，也可以写http://www.baidu.com'
        //         // w.location.href = url //这样就可以跳转了
        //
        //     }
        //     // alert(this.state.username + "  " + this.state.password + response);
        //     // alert()
        //     // console.log(response);
        // }).catch(function (error) {
        //     alert(error.response.data.message);
        // });
    }

    render() {
        return (
            <div>

                <form className="form-signin" onSubmit={this.Login}>
                    <img className="mb-4" src={bt} alt="" width="72" height="72"/>
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
                    <p className="mt-5 mb-3 text-muted">&copy; 2017-2021</p>
                </form>
                <a className="nav-link" style={{color:"blue"}} href="/register">no account yet? sign up</a>
            </div>

        )
    }
}
