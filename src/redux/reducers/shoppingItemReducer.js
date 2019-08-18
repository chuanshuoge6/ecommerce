export default function reducer(
    state = {
        shoppingItems: [],
        fetching: false,
        fetched: false,
        deleting: false,
        deleted: false,
        updating: false,
        updated: false,
        adding: false,
        added: false,
        checkingOut: false,
        checkedOut: false,
        receipt: '',
        orderid: '',
        error: ''
    },
    action
) {
    switch (action.type) {
        case "fetch_shoppingItems_PENDING": {
            return { ...state, fetching: true, fetched: false, error: '' }
        }

        case "fetch_shoppingItems_FULFILLED": {
            return {
                ...state,
                fetching: false,
                fetched: true,
                shoppingItems: action.payload.data,
                error: ''
            }
        }

        case "fetch_shoppingItems_REJECTED": {
            return {
                ...state,
                fetching: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "delete_shoppingItem_PENDING": {
            return { ...state, deleting: true, deleted: false, error: '' }
        }

        case "delete_shoppingItem_FULFILLED": {
            const deleteId = action.payload.config.data;

            return {
                ...state,
                deleting: false,
                deleted: true,
                shoppingItems: [...state.shoppingItems].filter(item => item.id != deleteId),
                error: ''
            }
        }

        case "delete_shoppingItem_REJECTED": {
            return {
                ...state,
                deleting: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "add_shoppingItem_PENDING": {
            return { ...state, adding: true, added: false, error: '' }
        }

        case "add_shoppingItem_FULFILLED": {
            const data = action.payload.data;

            //check if shopper has item in cart
            const itemInCart = [...state.shoppingItems].filter(item => item.shopper == data.shopper && item.album == data.album)

            //not in cart, create new
            if (itemInCart.length === 0) {
                return {
                    ...state,
                    adding: false,
                    added: true,
                    shoppingItems: [...state.shoppingItems].concat(data),
                    error: ''
                }
            }
            //in cart, update 
            else {
                const repurchasedItem = {
                    shopper: data.shopper,
                    album: data.album,
                    quantity: data.quantity,
                }

                return {
                    ...state,
                    adding: false,
                    added: true,
                    shoppingItems: [...state.shoppingItems].filter(item => item.album != data.album || item.shopper != data.shopper).concat(repurchasedItem),
                    error: ''
                }
            }
        }

        case "add_shoppingItem_REJECTED": {
            return {
                ...state,
                adding: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "update_shoppingItem_PENDING": {
            return { ...state, updating: true, updated: false, error: '' }
        }

        case "update_shoppingItem_FULFILLED": {
            const data = action.payload.data;

            return {
                ...state,
                updating: false,
                updated: true,
                shoppingItems: [...state.shoppingItems].filter(item => item.album != data.album || item.shopper != data.shopper).concat(data),
                error: ''
            }
        }

        case "update_shoppingItem_REJECTED": {
            return {
                ...state,
                updating: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        case "reset": {
            return {
                ...state,
                shoppingItems: [],
                fetching: false,
                fetched: false,
                deleting: false,
                deleted: false,
                updating: false,
                updated: false,
                error: ''
            }
        }

        case "checkout_cart_PENDING": {
            return { ...state, checkingOut: true, checkedOut: false, error: '' }
        }

        case "checkout_cart_FULFILLED": {
            return {
                ...state,
                checkingOut: false,
                checkedOut: true,
                receipt: action.payload.data.receipt_url,
                orderid: action.payload.data.id,
                error: ''
            }
        }

        case "checkout_cart_REJECTED": {
            return {
                ...state,
                checkingOut: false,
                error: JSON.stringify(action.payload.response.data),
            }
        }

        default:
            break;
    }
    return state;
}