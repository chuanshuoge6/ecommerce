import axios from 'axios';
const config = require('../../config');

export function getUsers(token) {
    return {
        type: "fetch_users",
        payload: axios({
            method: 'get',
            url: config.URL + 'api/user_list/',
            headers: {
                Authorization: 'Token ' + token
            },
        })
    }
}

