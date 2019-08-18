import axios from 'axios';
const config = require('../../config');

export function postShoppingItem(token, data) {
    return {
        type: "add_shoppingItem",
        payload: axios({
            method: 'post',
            url: config.URL + 'api/shoppingItems/',
            headers: {
                Authorization: 'Token ' + token,
            },
            data: data,
        })
    }
}

