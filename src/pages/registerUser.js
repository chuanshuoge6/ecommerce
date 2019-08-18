import React, { Component } from 'react';
import '../App.css';
import { registerUser } from '../redux/actions/registerUser';
import { connect } from 'react-redux';
import { Input, Spin } from 'antd';
import { Button } from 'reactstrap';
import { MdEmail, MdAccessibility } from "react-icons/md";
import { Fa500Px } from "react-icons/fa";

class RegisterUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
        };
    }

    inputChange = (e, p) => {
        this.setState({ [p]: e.target.value });
    }

    formSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('email', this.state.email);
        formData.set('username', this.state.username);
        formData.set('password', this.state.password);

        this.props.dispatch(registerUser(formData));
    }

    render() {
        return (
            <form style={{ marginLeft: '10px', width: '300px' }}
                onSubmit={(e) => this.formSubmit(e)}>
                <legend>Register User</legend>
                {this.props.registering ? <Spin tip='Registering...' style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                <hr />
                <p style={{ color: 'red' }}>{this.props.error}</p>
                {this.props.registered ? <p style={{ color: 'green' }}>Registration success</p> : null}
                <Input placeholder="username" required='required'
                    prefix={<MdAccessibility style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'username')}
                    style={{ marginTop: '5px' }}
                />
                <Input placeholder="email" required='required' type='email'
                    prefix={<MdEmail style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'email')}
                    style={{ marginTop: '15px' }}
                />
                <Input.Password placeholder="password" required='required'
                    prefix={<Fa500Px style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'password')}
                    style={{ marginTop: '15px' }}
                />
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
            registered: store.users.registered,
            registering: store.users.registering,
            error: store.users.error
        };
    }
)(RegisterUser);