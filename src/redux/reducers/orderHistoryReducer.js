export default function reducer(
    state = {
        orders: [],
        fetching: false,
        fetched: false,
        adding: false,
        added: false,
        deleting: false,
        deleted: false,
        updating: false,
        updated: false,
        gettingDetail: false,
        gotDetail: false,
        detail: null,
        error: ''
    },
    action
) {
    switch (action.type) {
        case "fetch_orders_PENDING": {
            return { ...state, fetching: true, fetched: false, error: '' }
        }

        case "fetch_orders_FULFILLED": {
            return {
                ...state,
                fetching: false,
                fetched: true,
                orders: action.payload.data,
                error: ''
            }
        }

        case "fetch_orders_REJECTED": {
            return {
                ...state,
                fetching: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "get_orderDetail_PENDING": {
            return { ...state, gettingDetail: true, gotDetail: false, error: '' }
        }

        case "get_orderDetail_FULFILLED": {
            return {
                ...state,
                gettingDetail: false,
                gotDetail: true,
                detail: action.payload.data,
                error: ''
            }
        }

        case "get_orderDetail_REJECTED": {
            return {
                ...state,
                gettingDetail: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "add_order_PENDING": {
            return { ...state, adding: true, added: false, error: '' }
        }

        case "add_order_FULFILLED": {
            return {
                ...state,
                adding: false,
                added: true,
                orders: [...state.orders].concat(action.payload.data),
                error: ''
            }
        }

        case "add_order_REJECTED": {
            return {
                ...state,
                adding: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "delete_order_PENDING": {
            return { ...state, deleting: true, deleted: false, error: '' }
        }

        case "delete_order_FULFILLED": {
            const deleteId = action.payload.config.data;

            return {
                ...state,
                deleting: false,
                deleted: true,
                orders: [...state.orders].filter(order => order.id != deleteId),
                error: ''
            }
        }

        case "delete_order_REJECTED": {
            return {
                ...state,
                deleting: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "reset": {
            return {
                ...state,
                orders: [],
                fetching: false,
                fetched: false,
                adding: false,
                added: false,
                deleting: false,
                deleted: false,
                updating: false,
                updated: false,
                gettingDetail: false,
                gotDetail: false,
                detail: null,
                error: ''
            }
        }

        case "update_order_PENDING": {
            return { ...state, updating: true, updated: false, error: '' }
        }

        case "update_order_FULFILLED": {
            const data = action.payload.data;

            return {
                ...state,
                updating: false,
                updated: true,
                orders: [...state.orders].filter(order => order.id != data.id).concat(data),
                error: ''
            }
        }

        case "update_order_REJECTED": {
            return {
                ...state,
                updating: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        default:
            break;
    }
    return state;
}