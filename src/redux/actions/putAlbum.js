import axios from 'axios';
const config = require('../../config');

export function putAlbum(token, id, data) {
    return {
        type: "update_album",
        payload: axios({
            method: 'put',
            url: config.URL + 'api/album_detail/' + id.toString() + '/',
            headers: {
                Authorization: 'Token ' + token,
            },
            data: data,
        })
    }
}

