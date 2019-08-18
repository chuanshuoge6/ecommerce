export default function reducer(
    state = {
        username: '',
        token: '',
        fetching: false,
        fetched: false,
        sending: false,
        sent: false,
        changing: false,
        changed: false,
        error: ''
    },
    action
) {
    switch (action.type) {
        case "fetch_token_PENDING": {
            return { ...state, fetching: true, fetched: false, error: '' }
        }

        case "fetch_token_FULFILLED": {
            return {
                ...state,
                fetching: false,
                fetched: true,
                token: action.payload.data.token,
                username: JSON.parse(action.payload.config.data).username,
                error: ''
            }
        }

        case "fetch_token_REJECTED": {
            return {
                ...state,
                fetching: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "reset": {
            return {
                ...state,
                username: '',
                token: '',
                fetching: false,
                fetched: false,
                error: ''
            }
        }

        case "reset_password_PENDING": {
            return { ...state, sending: true, sent: false, error: '' }
        }

        case "reset_password_FULFILLED": {
            return {
                ...state,
                sending: false,
                sent: true,
                error: ''
            }
        }

        case "reset_password_REJECTED": {
            return {
                ...state,
                sending: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "change_password_PENDING": {
            return { ...state, changing: true, changed: false, error: '' }
        }

        case "change_password_FULFILLED": {
            return {
                ...state,
                changing: false,
                changed: true,
                error: ''
            }
        }

        case "change_password_REJECTED": {
            return {
                ...state,
                changing: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        default:
            break;
    }
    return state;
}