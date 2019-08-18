import axios from 'axios';
const config = require('../../config');

export function postOrderHistory(token, data) {
    return {
        type: "add_order",
        payload: axios({
            method: 'post',
            url: config.URL + 'api/order_history/',
            headers: {
                Authorization: 'Token ' + token,
            },
            data: data,
        })
    }
}

