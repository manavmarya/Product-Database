import React, { Component } from "react";
import axios from 'axios';


export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password : ''
        }
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:4000/user/login', this.state)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {
        const { username, password } = this.state;
        return (
            <form onSubmit={this.submitHandler}>
                <h3>Sign In</h3>

                <div className="form-group p-2">
                    <label className="my-1">Email address</label>
                    <input type="email" className="form-control my-2" placeholder="Enter email" name="username" value={username} onChange={this.changeHandler} />
                </div>

                <div className="form-group p-2">
                    <label className="my-1">Password</label>
                    <input type="password" className="form-control my-2" placeholder="Enter password" name="password" value={password} onChange={this.changeHandler} />
                </div>

                <div className="form-group p-2">
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>
            </form>
        );
    }
}