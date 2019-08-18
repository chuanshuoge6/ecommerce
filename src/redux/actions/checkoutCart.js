import axios from 'axios';
const config = require('../../config');

export function checkoutCart(token, data) {
    return {
        type: "checkout_cart",
        payload: axios({
            method: 'post',
            url: config.URL + 'api/cart_checkout/',
            headers: {
                Authorization: 'Token ' + token,
            },
            data: data,
        })
    }
}

