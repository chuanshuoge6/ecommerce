import React, { Component } from 'react';
import '../App.css';
import { Input } from 'antd';
import { FaUser, FaBarcode } from "react-icons/fa";
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchToken } from '../redux/actions/loginAction'
import { Redirect } from 'react-router-dom'
import { message, Spin } from 'antd';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            spin: false,
            spinTip: '',
        };
    }

    inputChange = (e, p) => {
        this.setState({ [p]: e.target.value });
    }

    formSubmit = (e) => {
        e.preventDefault();

        this.props.dispatch(fetchToken(this.state.username, this.state.password))

        //wait for 5sec, check every sec to see if login successful
        let i = 0;
        this.setState({ spin: true, spinTip: 'Logging In...' })
        const waitLogin = setInterval(() => {
            if (this.props.loggedin) {

                clearInterval(waitLogin);
                this.setState({ spin: false })
            }
            if (i == 100) {
                message.error('Server disconnected, login failed.')
                clearInterval(waitLogin);
                this.setState({ spin: false })
            }
            i++;
        }, 100)
    }

    render() {
        if (this.props.loggedin) {
            return <Redirect to='/' />
        }

        return (
            <form style={{ marginLeft: '10px', width: '300px' }}
                onSubmit={(e) => this.formSubmit(e)}>
                <legend>Login</legend>
                {this.state.spin ? <Spin tip={this.state.spinTip} style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                <hr />
                <p style={{ color: 'red' }}>{this.props.error}</p>
                <Input placeholder="username" required='required'
                    prefix={<FaUser style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'username')}
                    style={{ marginTop: '5px' }}
                />
                <Input.Password placeholder="password" required='required'
                    prefix={<FaBarcode style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'password')}
                    style={{ marginTop: '15px' }}
                />
                <p style={{ marginTop: '15px' }}>New user? <a href='/registerUser/'>Register</a></p>
                <p style={{ marginTop: '15px' }}>Forget password? <a href='/resetPassword/'>Reset Password</a></p>
                <p style={{ marginTop: '15px' }}>For testing, username: nick, password: nickpasswd123, credit card: 4242 4242 4242 4242, exp: 02/22, cvc: 222</p>
                <Button color="success" type='submit' size='sm'
                    style={{ marginTop: '15px' }}
                >Submit</Button>
            </form>
        );
    }
}

export default connect(
    (store) => {
        return {
            username: store.login.username,
            token: store.login.token,
            loggedin: store.login.fetched,
            error: store.login.error
        };
    }
)(Login);