import axios from 'axios';
const config = require('../../config');

export function getOrderDetail(token, id) {
    return {
        type: "get_orderDetail",
        payload: axios({
            method: 'get',
            url: config.URL + 'api/orderDetail/' + id.toString() + '/',
            headers: {
                Authorization: 'Token ' + token,
            },
        })
    }
}

