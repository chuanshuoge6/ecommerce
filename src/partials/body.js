import React, { Component } from 'react';
import '../App.css';
import { Switch, Route } from 'react-router-dom';
import Albums from '../pages/albums';
import Login from '../pages/login';
import Logout from '../pages/logout';
import AlbumDetail from '../pages/albumDetail';
import AlbumForm from '../pages/albumForm';
import ResetPassword from '../pages/resetPassword';
import ChangePassword from '../pages/changePassword';
import RegisterUser from '../pages/registerUser';
import ShoppingCart from '../pages/shoppingCart';
import OrderHistory from '../pages/orderHistory';

export default class Body extends Component {

    render() {
        return (
            <main className='Body-Background'>
                <Switch>
                    <Route exact path='/' component={Albums} />
                    <Route path='/login/' component={Login} />
                    <Route path='/logout/' component={Logout} />
                    <Route path='/albumDetail/' component={AlbumDetail} />
                    <Route path='/addAlbum/' component={AlbumForm} />
                    <Route path='/updateAlbum/' component={AlbumForm} />
                    <Route path='/resetPassword/' component={ResetPassword} />
                    <Route path='/changePassword/' component={ChangePassword} />
                    <Route path='/registerUser/' component={RegisterUser} />
                    <Route path='/shoppingCart/' component={ShoppingCart} />
                    <Route path='/orderHistory/' component={OrderHistory} />
                </Switch>
            </main>
        );
    }
}

