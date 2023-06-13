

import React, {Component} from "react";
import '../css/signin.css'
import bt from '../assets/brand/bootstrap-solid.svg'
export default class LoginForm extends Component{

    login(){

    }


  render() {
    return  (
          <form className="form-signin">
              <img className="mb-4" src={bt}  alt="" width="72" height="72"/>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <label htmlFor="inputEmail" className="sr-only">Email address</label>
              <input type="text" id="userName" className="form-control" placeholder="Username" required
                     autoFocus/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
                  <div className="checkbox mb-3">
                    <label>
                      <input type="checkbox" value="remember-me"/> Remember me
                    </label>
                  </div>
                  <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                 <p className="mt-5 mb-3 text-muted">&copy; 2017-2021</p>
          </form>
    )
  }
}
