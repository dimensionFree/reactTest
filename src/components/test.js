import React, {Component} from "react";

export class TestLoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pwd: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        const name = this.name.value
        const {pwd} = this.state
        alert(`准备提交的用户名为 ${name} ,密码为 ${pwd}`)
    }

    handleChange(event) {
        const pwd = event.target.value
        this.setState({pwd})

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                usrname: <input type='text' ref={input => this.name = input}></input> <br/>
                paw: <input type='password' value={this.state.pwd} onChange={this.handleChange}></input> <br/>
                <input type='submit' value='login'/>
            </form>
        )
    }
}