import axios from 'axios';
const config = require('../../config');

export function resetPassword(data) {
    return {
        type: "reset_password",
        payload: axios({
            method: 'post',
            url: config.URL + 'rest-auth/password/reset/',
            data: data,
        })
    }
}

