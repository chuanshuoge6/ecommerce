export default function reducer(
    state = {
        songs: [],
        fetching: false,
        fetched: false,
        error: ''
    },
    action
) {
    switch (action.type) {
        case "fetch_songs_PENDING": {
            return { ...state, fetching: true, fetched: false }
        }

        case "fetch_songs_FULFILLED": {
            return {
                ...state,
                fetching: false,
                fetched: true,
                songs: action.payload.data,
                error: ''
            }
        }

        case "fetch_songs_REJECTED": {
            return {
                ...state,
                fetching: false,
                error: action.payload.toString()
            }
        }

        default:
            break;
    }
    return state;
}