

import React, {Component} from "react";
import '../css/loginForm.css'
import bt from '../assets/brand/bootstrap-solid.svg'
import axios from "axios";
import RequestSendUtils from "../Utils/RequestSendUtils";
export default class RegisterForm extends Component{

    constructor(props) {
        super(props);
        this.state={
            username:"",
            password:""
        };
        this.Register=this.Register.bind(this)

    }
    handleChange(name,event){
      var newState={};
      newState[name]=event.target.value;
      this.setState(newState);

    }


    Register(e){
        e.preventDefault();
        // alert(this.state.username+"  "+this.state.password);
        // const formData = new FormData();
        // formData.append("username", this.state.username);
        // formData.append("password", this.state.password);
        //backend @RequestParam -> formData 可用 json 不可用
        let payload = {
            username:this.state.username,
            password:this.state.password
        };
        RequestSendUtils.SendPost("/user/register",payload,null,(response) => {
            if (response.status==200){
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

            }else if(response.status==400){
                console.log(response.data);
                alert(response.data);
            }
        },(error)=>{
            alert(error.response.data.message);
            // alert(error);
        })
    }


  render() {
    return  (
        <div className="my-form">
            <form className="form-signin" onSubmit={this.Register}>
                {/*<img className="mb-4" src={bt}  alt="" width="72" height="72"/>*/}
                <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="text" id="inputUserName" className="form-control" onChange={(e) => this.handleChange("username", e)} value={this.state.username} placeholder="User Name" required
                       autoFocus/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" onChange={(e) => this.handleChange("password", e)} value={this.state.password} placeholder="Password" required/>
                <br/>
                <button className="btn btn-lg btn-primary btn-block" type="submit"  >Sign up</button>
                <p className="mt-5 mb-3 text-muted">&copy; 2017-2021</p>
            </form>
        </div>

    )
  }
}
