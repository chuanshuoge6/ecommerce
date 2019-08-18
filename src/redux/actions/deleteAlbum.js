import axios from 'axios';
const config = require('../../config');

export function deleteAlbum(token, id) {
    return {
        type: "delete_album",
        payload: axios({
            method: 'delete',
            url: config.URL + 'api/album_detail/' + id.toString() + '/',
            headers: {
                Authorization: 'Token ' + token
            },
            data: id,
        })
    }
}

