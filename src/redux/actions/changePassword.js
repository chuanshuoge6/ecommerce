import axios from 'axios';
const config = require('../../config');

export function changePassword(token, data) {
    return {
        type: "change_password",
        payload: axios({
            method: 'post',
            url: config.URL + 'rest-auth/password/change/',
            headers: {
                Authorization: 'Token ' + token,
            },
            data: data,
        })
    }
}

