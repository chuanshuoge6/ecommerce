import { combineReducers } from 'redux';
import login from "./loginReduder";
import albums from "./albumReducer";
import users from "./userReducer";
import songs from "./songReducer";
import shoppingItems from "./shoppingItemReducer";
import orderHistory from "./orderHistoryReducer"

export default combineReducers(
    {
        login, albums, users, songs, shoppingItems, orderHistory
    })