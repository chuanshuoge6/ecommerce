import axios from 'axios';
const config = require('../../config');

export function postAlbum(token, data) {
    return {
        type: "add_album",
        payload: axios({
            method: 'post',
            url: config.URL + 'api/album_list/',
            headers: {
                Authorization: 'Token ' + token,
            },
            data: data,
        })
    }
}

