export default function reducer(
    state = {
        users: [],
        fetching: false,
        fetched: false,
        registering: false,
        registered: false,
        error: ''
    },
    action
) {
    switch (action.type) {
        case "fetch_users_PENDING": {
            return { ...state, fetching: true, fetched: false }
        }

        case "fetch_users_FULFILLED": {
            return {
                ...state,
                fetching: false,
                fetched: true,
                users: action.payload.data,
                error: ''
            }
        }

        case "fetch_users_REJECTED": {
            return {
                ...state,
                fetching: false,
                error: action.payload.toString()
            }
        }

        case "register_user_PENDING": {
            return { ...state, registering: true, registered: false, error: '' }
        }

        case "register_user_FULFILLED": {
            return {
                ...state,
                registering: false,
                registered: true,
                error: ''
            }
        }

        case "register_user_REJECTED": {
            return {
                ...state,
                registering: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        default:
            break;
    }
    return state;
}