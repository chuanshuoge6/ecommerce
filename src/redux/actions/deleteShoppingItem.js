import axios from 'axios';
const config = require('../../config');

export function deleteShoppingItem(token, id) {
    return {
        type: "delete_shoppingItem",
        payload: axios({
            method: 'delete',
            url: config.URL + 'api/shoppingItem/' + id.toString() + '/',
            headers: {
                Authorization: 'Token ' + token
            },
            data: id,
        })
    }
}

