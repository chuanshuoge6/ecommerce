import axios from 'axios';
const config = require('../../config');

export function registerUser(data) {
    return {
        type: "register_user",
        payload: axios({
            method: 'post',
            url: config.URL + 'api/user_register/',
            data: data,
        })
    }
}

