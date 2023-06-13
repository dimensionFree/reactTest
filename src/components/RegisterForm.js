

import React, {Component} from "react";
import '../css/signin.css'
import bt from '../assets/brand/bootstrap-solid.svg'
import axios from "axios";
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
        alert(this.state.username+"  "+this.state.password);
        axios.post('http://localhost/user', {
            username:this.state.username,
            password:this.state.password
        }).then(function (response) {
            if (response.status==200){
                //本地窗口
                window.location.href="/"

                //新窗口
                // const w = window.open('_black') //这里是打开新窗口
                // let url = 'http://localhost:3000/'
                //     // '这里是url，可以写../../index，也可以写http://www.baidu.com'
                // w.location.href = url //这样就可以跳转了

            }
            alert(this.state.username+"  "+this.state.password+response);
            // alert()
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    }


  render() {
    return  (
          <form className="form-signin" onSubmit={this.Register}>
              <img className="mb-4" src={bt}  alt="" width="72" height="72"/>
              <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>
              <label htmlFor="inputEmail" className="sr-only">Email address</label>
              <input type="text" id="inputUserName" className="form-control" onChange={this.handleChange.bind(this,"username")} value={this.state.username} placeholder="User Name" required
                     autoFocus/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" onChange={this.handleChange.bind(this,"password")} value={this.state.password} placeholder="Password" required/>
                <br/>
                  <button className="btn btn-lg btn-primary btn-block" type="submit"  >Sign up</button>
                 <p className="mt-5 mb-3 text-muted">&copy; 2017-2021</p>
          </form>
    )
  }
}