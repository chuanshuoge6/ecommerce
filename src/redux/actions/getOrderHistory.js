import axios from 'axios';
const config = require('../../config');

export function getOrderHistory(token) {
    return {
        type: "fetch_orders",
        payload: axios({
            method: 'get',
            url: config.URL + 'api/order_history/',
            headers: {
                Authorization: 'Token ' + token
            },
        })
    }
}

