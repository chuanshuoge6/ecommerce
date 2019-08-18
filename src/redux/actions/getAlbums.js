import axios from 'axios';
const config = require('../../config');

export function getAlbums(token) {
    return {
        type: "fetch_albums",
        payload: axios({
            method: 'get',
            url: config.URL + 'api/album_list/',
            headers: {
                Authorization: 'Token ' + token
            },
        })
    }
}

