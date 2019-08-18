export default function reducer(
    state = {
        albums: [],
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        deleting: false,
        deleted: false,
        updating: false,
        updated: false,
        error: ''
    },
    action
) {
    switch (action.type) {
        case "fetch_albums_PENDING": {
            return { ...state, fetching: true, fetched: false, error: '' }
        }

        case "fetch_albums_FULFILLED": {
            return {
                ...state,
                fetching: false,
                fetched: true,
                albums: action.payload.data,
                error: ''
            }
        }

        case "fetch_albums_REJECTED": {
            return {
                ...state,
                fetching: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "add_album_PENDING": {
            return { ...state, adding: true, added: false, error: '' }
        }

        case "add_album_FULFILLED": {
            return {
                ...state,
                adding: false,
                added: true,
                albums: [...state.albums].concat(action.payload.data),
                error: ''
            }
        }

        case "add_album_REJECTED": {
            return {
                ...state,
                adding: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "delete_album_PENDING": {
            return { ...state, deleting: true, deleted: false, error: '' }
        }

        case "delete_album_FULFILLED": {
            const deleteId = action.payload.config.data;

            return {
                ...state,
                deleting: false,
                deleted: true,
                albums: [...state.albums].filter(album => album.id != deleteId),
                error: ''
            }
        }

        case "delete_album_REJECTED": {
            return {
                ...state,
                deleting: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "update_album_PENDING": {
            return { ...state, updating: true, updated: false, error: '' }
        }

        case "update_album_FULFILLED": {
            const data = action.payload.data;

            return {
                ...state,
                updating: false,
                updated: true,
                albums: [...state.albums].filter(album => album.id != data.id).concat(data),
                error: ''
            }
        }

        case "update_album_REJECTED": {
            return {
                ...state,
                updating: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "reset": {
            return {
                ...state,
                albums: [],
                fetching: false,
                fetched: false,
                adding: false,
                added: false,
                deleting: false,
                deleted: false,
                updating: false,
                updated: false,
                error: ''
            }
        }

        default:
            break;
    }
    return state;
}