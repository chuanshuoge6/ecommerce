import axios from 'axios';
const config = require('../../config');

export function deleteCart(token, id) {
    return {
        type: "delete_cart",
        payload: axios({
            method: 'delete',
            url: config.URL + 'api/shoppingItems/',
            headers: {
                Authorization: 'Token ' + token
            },
        })
    }
}

