import axios from 'axios';
const config = require('../../config');

export function putShoppingItem(token, id, data) {
    return {
        type: "update_shoppingItem",
        payload: axios({
            method: 'put',
            url: config.URL + 'api/shoppingItem/' + id.toString() + '/',
            headers: {
                Authorization: 'Token ' + token,
            },
            data: data,
        })
    }
}

