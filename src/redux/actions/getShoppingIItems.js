import axios from 'axios';
const config = require('../../config');

export function getShoppingItems(token) {
    return {
        type: "fetch_shoppingItems",
        payload: axios({
            method: 'get',
            url: config.URL + 'api/shoppingItems/',
            headers: {
                Authorization: 'Token ' + token
            },
        })
    }
}

