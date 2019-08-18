import React, { Component } from 'react';
import '../App.css';
import { resetPassword } from '../redux/actions/resetPassword';
import { connect } from 'react-redux';
import { Input, Spin } from 'antd';
import { Button } from 'reactstrap';
import { MdEmail } from "react-icons/md";

class ResetPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
        };
    }

    inputChange = (e, p) => {
        this.setState({ [p]: e.target.value });
    }

    formSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('email', this.state.email);

        this.props.dispatch(resetPassword(formData));
    }

    render() {
        return (
            <form style={{ marginLeft: '10px', width: '300px' }}
                onSubmit={(e) => this.formSubmit(e)}>
                <legend>Reset Password</legend>
                {this.props.sending ? <Spin tip='Reseting Password...' style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                <hr />
                <p style={{ color: 'red' }}>{this.props.error}</p>
                {this.props.sent ? <p style={{ color: 'green' }}>Password reset email has been sent to {this.state.email}</p> : null}
                <Input placeholder="email" required='required' type='email'
                    prefix={<MdEmail style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'email')}
                    style={{ marginTop: '5px' }}
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
            sent: store.login.sent,
            sending: store.login.sending,
            error: store.login.error
        };
    }
)(ResetPassword);