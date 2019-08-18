import axios from 'axios';
const config = require('../../config');

export function getSongs(token) {
    return {
        type: "fetch_songs",
        payload: axios({
            method: 'get',
            url: config.URL + 'api/song_list/',
            headers: {
                Authorization: 'Token ' + token
            },
        })
    }
}

