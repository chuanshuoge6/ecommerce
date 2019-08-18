import React, { Component } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getShoppingItems } from '../redux/actions/getShoppingIItems';
import { getAlbums } from '../redux/actions/getAlbums';
import { getUsers } from '../redux/actions/getUser';
import { putShoppingItem } from '../redux/actions/putShoppingItem';
import { deleteShoppingItem } from '../redux/actions/deleteShoppingItem'
import { checkoutCart } from '../redux/actions/checkoutCart'
import { postOrderHistory } from '../redux/actions/postOrderHistory'
import { Input, message, Tag, Spin } from 'antd';
import { Button } from 'reactstrap';
import { MdExposureNeg1, MdExposurePlus1 } from "react-icons/md";
import Stripecheckout from 'react-stripe-checkout';

class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            qty: [],
            qty_input: [],
            qty_loaded: false,
            spin: false,
            spinTip: '',
        };
    }

    componentDidMount() {

        //start fetching database once logged in
        if (this.props.loggedin) {
            if (!this.props.gotAlbums) {
                this.props.dispatch(getAlbums(this.props.token));
            }
            if (!this.props.gotUsers) {
                this.props.dispatch(getUsers(this.props.token));
            }
            if (!this.props.gotShoppingItems) {
                this.props.dispatch(getShoppingItems(this.props.token));
            }

            //wait for 5sec, check every 0.1s to see if shoppingItems are fetched
            let i = 0;
            this.setState({ spin: true, spinTip: 'Loading ShoppingItem...' })
            const waitShoppingItem = setInterval(async () => {
                if (this.props.gotShoppingItems) {
                    await this.setState({ qty: [], qty_input: [], qty_loaded: false })

                    this.props.shoppingItems.map(async (item, index) => {
                        await this.setState(prevState => {
                            return {
                                qty: prevState.qty.concat({ album_id: item.album, qty: item.quantity }),
                                qty_input: prevState.qty_input.concat({ album_id: item.album, qty: null })
                            }
                        })

                        if (this.state.qty.length === this.props.shoppingItems.length) { this.setState({ qty_loaded: true }) }
                    })

                    clearInterval(waitShoppingItem);
                    this.setState({ spin: false })
                }
                if (i == 50) {
                    message.error('fetching shopping items timed out.')
                    clearInterval(waitShoppingItem);
                    this.setState({ spin: false })
                }
                i++;
            }, 100)
        }
    }

    add = async (album_id) => {
        await this.setState(prevState => { return { qty_input: prevState.qty_input.filter(item => item.album_id !== album_id).concat({ album_id: album_id, qty: null }) } });
        this.setState(prevState => { return { qty: prevState.qty.filter(item => item.album_id !== album_id).concat({ album_id: album_id, qty: prevState.qty.find(item => item.album_id === album_id).qty + 1 }) } })
    }

    subtract = async (album_id) => {
        await this.setState(prevState => { return { qty_input: prevState.qty_input.filter(item => item.album_id !== album_id).concat({ album_id: album_id, qty: null }) } });
        if (this.state.qty.find(item => item.album_id === album_id).qty > 1) {
            this.setState(prevState => { return { qty: prevState.qty.filter(item => item.album_id !== album_id).concat({ album_id: album_id, qty: prevState.qty.find(item => item.album_id === album_id).qty - 1 }) } })
        }
    }

    inputChange = (e, album_id) => {
        if (e.target.value > 0) {
            const newQty = parseInt(e.target.value)
            this.setState(prevState => { return { qty: prevState.qty.filter(item => item.album_id !== album_id).concat({ album_id: album_id, qty: newQty }) } })
            this.setState(prevState => { return { qty_input: prevState.qty_input.filter(item => item.album_id !== album_id).concat({ album_id: album_id, qty: newQty }) } })
        } else {
            message.error('entered invalid value')
        }
    }

    deleteItem = (id) => {
        this.props.dispatch(deleteShoppingItem(this.props.token, id));

        //wait for 5sec, check every sec to see if delete successful
        let i = 0;
        this.setState({ spin: true, spinTip: 'Deleting item...' })
        const waitDelete = setInterval(() => {

            if (this.props.shoppingItemDeleted) {

                clearInterval(waitDelete);
                this.setState({ spin: false })
            }
            if (i == 100) {
                message.error('connection timed out.')
                clearInterval(waitDelete);
                this.setState({ spin: false })
            }
            i++;
        }, 100)
    }

    updateCart = () => {

        this.state.qty.map((item, index) => {
            //only update items with qty changed
            const oldItem = this.props.shoppingItems.find(i => i.album === item.album_id)
            if (item.qty !== oldItem.quantity) {
                const formData = new FormData();
                formData.set('shopper', this.props.users.find(user => user.username === this.props.username).id);
                formData.set('album', item.album_id);
                formData.set('quantity', item.qty);

                this.props.dispatch(putShoppingItem(this.props.token, oldItem.id, formData));

                //wait for 5sec, check every sec to see if updateShoppingItem successful
                let i = 0;
                this.setState({ spin: true, spinTip: 'Updating Cart...' })
                const waitUpdate = setInterval(() => {
                    const newItem = this.props.shoppingItems.find(i => i.album === item.album_id)
                    if (newItem.quantity === item.qty) {
                        message.success('Updated quantity of ' + this.props.albums.filter(album => album.id === item.album_id)[0].album_title + ' to ' + item.qty)

                        clearInterval(waitUpdate);
                        this.setState({ spin: false })
                    }
                    if (i == 100) {
                        message.error('connection timed out.')
                        clearInterval(waitUpdate);
                        this.setState({ spin: false })
                    }
                    i++;
                }, 100)
            }
        })
    }

    checkout = (token) => {
        let total = 0
        if (this.state.qty_loaded) {
            let i = 0, items = {}
            this.props.shoppingItems.map((item, index) => {
                const album = this.props.albums.find(album => album.id === item.album)
                total = total + album.price * item.quantity
                i++
                items['item' + i.toString()] = album.album_title + ' $' + album.price + ' x ' + item.quantity
            })

            const cartName = this.props.username + "'s Cart"
            const cart = { name: cartName, price: total, items: items }
            this.props.dispatch(checkoutCart(this.props.token, { token, cart }))
        }
        else {
            message.error('please wait for cart info been retrieved')
        }

        //wait for 5sec, check every sec to see if checkout successful
        let i = 0;
        this.setState({ spin: true, spinTip: 'Checking Out...' })
        const waitCheckout = setInterval(() => {

            if (this.props.checkedout) {
                message.success('payment received')
                //save order to history
                const formData = new FormData();
                formData.set('shopper', this.props.users.find(user => user.username === this.props.username).id);
                formData.set('order', this.props.orderid);
                formData.set('total', total);
                this.props.dispatch(postOrderHistory(this.props.token, formData))

                //wait for 5sec, check every sec to see if postOrderHistory successful
                let j = 0;
                const waitAdd = setInterval(() => {
                    if (this.props.orderPosted) {
                        message.success('order posted')
                        //empty cart
                        this.emptyCart()
                        //display receipt
                        window.open(this.props.receipt, '_blank')
                        clearInterval(waitAdd);
                    }
                    if (j == 100) {
                        message.error('connection timed out to post order.')
                        clearInterval(waitAdd);
                    }
                    j++;
                }, 100)

                clearInterval(waitCheckout);
                this.setState({ spin: false })
            }
            if (i == 100) {
                message.error('connection timed out.')
                clearInterval(waitCheckout);
                this.setState({ spin: false })
            }
            i++;
        }, 100)
    }

    emptyCart = () => {
        this.props.shoppingItems.map((item, index) => {
            this.deleteItem(item.id)
        })
    }

    render() {
        if (!this.props.loggedin) {
            return <Redirect to='/login' />
        }

        let total = 0
        return (
            <div style={{ padding: '10px', marginTop: '10px' }}>
                <legend>Shopping Cart</legend>
                {this.state.spin ? <Spin tip={this.state.spinTip} style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                <hr />
                <div style={{ color: 'red' }}>{this.props.errorShoppingItem} {this.props.errorAlbum}</div>
                {
                    this.state.qty_loaded ?
                        this.props.shoppingItems
                            .sort((a, b) => { return this.props.albums.find(album => album.id === a.album).album_title.toUpperCase().localeCompare(this.props.albums.find(album => album.id === b.album).album_title.toUpperCase()) })
                            .map((item, index) => {
                                const album = this.props.albums.find(album => album.id === item.album)
                                total = total + album.price * item.quantity

                                return <div key={index}>
                                    <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>

                                            <span style={{ fontStyle: 'italic' }}>{album.album_title} <Tag color='geekblue'>${album.price}</Tag></span>
                                            <Input
                                                type='number'
                                                onChange={(e) => { this.inputChange(e, item.album) }}
                                                style={{ width: '150px' }}
                                                addonBefore={<MdExposureNeg1 onClick={() => this.subtract(item.album)} style={{ cursor: 'pointer', fontSize: '20px' }} />}
                                                addonAfter={<MdExposurePlus1 onClick={() => this.add(item.album)} style={{ cursor: 'pointer', fontSize: '20px' }} />}
                                                value={this.state.qty_input.find(i => i.album_id === item.album).qty || this.state.qty.find(i => i.album_id === item.album).qty}
                                            />

                                        </div>
                                        <b style={{ textAlign: 'right' }} onClick={() => this.deleteItem(item.id)} style={{ cursor: 'pointer' }}>X</b>
                                    </div>
                                    <hr />
                                </div>
                            })
                        : null
                }
                <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total: <Tag color='geekblue'>${total}</Tag></span>
                    <div>
                        <Button color='success' size='sm' onClick={() => this.updateCart()} style={{ marginRight: '15px' }}>Update</Button>
                        <Stripecheckout
                            stripeKey='pk_test_i8PD1nMcLZvtkCghkFKU1r0d00P9v7L9wg'
                            token={this.checkout}
                            billingAddress
                            shippingAddress
                            amount={total * 100}
                            name={this.props.username + "'s Cart"}
                            currency='CAD'
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (store) => {
        return {
            loggedin: store.login.fetched,
            gotShoppingItems: store.shoppingItems.fetched,
            shoppingItems: store.shoppingItems.shoppingItems,
            errorShoppingItem: store.shoppingItems.error,
            shoppingItemUpdated: store.shoppingItems.updated,
            shoppingItemDeleted: store.shoppingItems.deleted,
            albums: store.albums.albums,
            gotAlbums: store.albums.fetched,
            errorAlbum: store.albums.error,
            users: store.users.users,
            gotUsers: store.users.fetched,
            errorUser: store.users.error,
            username: store.login.username,
            token: store.login.token,
            checkedout: store.shoppingItems.checkedOut,
            receipt: store.shoppingItems.receipt,
            orderid: store.shoppingItems.orderid,
            orderPosted: store.orderHistory.added,
        };
    }
)(ShoppingCart);