
// import 'bootstrap/js/dist/dropdown'
import React, {Component} from "react";
import "../css/navibar.css"
export default class Navibar extends Component{

  constructor() {
    super();
    this.props={
      username:""
    }
  }

  quit(e){
    localStorage.removeItem("userInfo")
    window.location.href="/"
  }

  render() {
    const username=this.props.username;

    const userAvaterContent=!username?(
        <a className="nav-link" style={{color:"white"}} href="/login">sign in</a>
    ):(
        <div className="nav-item dropdown" >
          <a className = "nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"
             aria-expanded = "false">welcome,{username}!</a>
          <div className="dropdown-menu" aria-labelledby="dropdown01">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" onClick={this.quit} href="#">quit</a>
          </div>
        </div>
    );

    return  (
        <div className="Navibar">
          <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                    aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarsExampleDefault">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled">Disabled</a>
                </li>
                <li className="nav-item dropdown">
                  <a className = "nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"
                     aria-expanded = "false">Dropdown</a>
                  <div className="dropdown-menu" aria-labelledby="dropdown01">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <a className="dropdown-item" href="#">Something else here</a>
                  </div>
                </li>
              </ul>
              <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
              </form>

              {userAvaterContent}
            </div>

          </nav>
        </div>
    )
  }
}

