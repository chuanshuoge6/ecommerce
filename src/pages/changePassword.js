import React, { Component } from 'react';
import '../App.css';
import { changePassword } from '../redux/actions/changePassword';
import { connect } from 'react-redux';
import { Input, Spin } from 'antd';
import { Button } from 'reactstrap';
import { Fa500Px } from "react-icons/fa";
import { Redirect } from 'react-router-dom';

class ChangePassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            old: '',
            new1: '',
            new2: '',
        };
    }

    inputChange = (e, p) => {
        this.setState({ [p]: e.target.value });
    }

    formSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('old_password', this.state.old);
        formData.set('new_password1', this.state.new1);
        formData.set('new_password2', this.state.new2);

        this.props.dispatch(changePassword(this.props.token, formData));
    }

    render() {
        if (!this.props.loggedin) {
            return <Redirect to='/login' />
        }

        return (
            <form style={{ marginLeft: '10px', width: '300px' }}
                onSubmit={(e) => this.formSubmit(e)}>
                <legend>Reset Password</legend>
                {this.props.changing ? <Spin tip='Changing Passwrod...' style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                <hr />
                <p style={{ color: 'red' }}>{this.props.error}</p>
                {this.props.changed ? <p style={{ color: 'green' }}>Password has been changed.</p> : null}
                <Input.Password placeholder="Old Password" required='required'
                    prefix={<Fa500Px style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'old')}
                    style={{ marginTop: '5px' }}
                />
                <Input.Password placeholder="New Password" required='required'
                    prefix={<Fa500Px style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'new1')}
                    style={{ marginTop: '15px' }}
                />
                <Input.Password placeholder="Confirm Password" required='required'
                    prefix={<Fa500Px style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'new2')}
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
            token: store.login.token,
            loggedin: store.login.fetched,
            changed: store.login.changed,
            changing: store.login.changing,
            error: store.login.error
        };
    }
)(ChangePassword);