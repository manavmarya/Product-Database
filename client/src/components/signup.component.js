import React, { Component } from "react";

export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: '',
            last_name: '',
            email_address: '',
            password : ''
        }
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitHandler = (e) => {
        e.preventDefault()
        console.log(this.state)
    }
    render() {
        const { first_name, last_name, email_address, password } = this.state;
        return (
            <form onSubmit={this.submitHandler}>
                <h3>Sign Up</h3>
                <div className="form-group p-2">
                    <label className="my-1">First name</label>
                    <input type="text" className="form-control my-2" placeholder="First name" name="first_name" value={first_name} onChange={this.changeHandler} />
                </div>

                <div className="form-group p-2">
                    <label className="my-1">Last name</label>
                    <input type="text" className="form-control my-2" placeholder="Last name" name="last_name" value={last_name} onChange={this.changeHandler} />
                </div>

                <div className="form-group p-2">
                    <label className="my-1">Email address</label>
                    <input type="email" className="form-control my-2" placeholder="Enter email" name="email_address" value={email_address} onChange={this.changeHandler} />
                </div>

                <div className="form-group p-2">
                    <label className="my-1">Password</label>
                    <input type="password" className="form-control my-2" placeholder="Enter password" name="password" value={password} onChange={this.changeHandler} />
                </div>

                <div className="form-group p-2">
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </div>
            </form>
        );
    }
}