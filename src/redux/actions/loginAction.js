import axios from 'axios';
const config = require('../../config');

export function fetchToken(username, password) {
    return {
        type: "fetch_token",
        payload: axios({
            method: 'post',
            url: config.URL + 'api/api-token-auth/',
            data: {
                'username': username,
                "password": password
            },
        })
    }
}

