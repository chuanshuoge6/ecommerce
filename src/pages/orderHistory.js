import React, { Component } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getOrderHistory } from '../redux/actions/getOrderHistory';
import { message, Collapse, Spin } from 'antd';
import OrderCollapse from '../partials/orderCollapse';

class OrderHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spin: false,
            spinTip: '',
        };
    }

    componentDidMount() {
        //start fetching database once logged in
        if (this.props.loggedin) {
            if (!this.props.gotOrders) {
                this.props.dispatch(getOrderHistory(this.props.token));
            }

            //wait for 10sec, check every 0.1s to see if orders are fetched
            let i = 0;
            this.setState({ spin: true, spinTip: 'Fetching Orders...' })
            const waitOrders = setInterval(() => {
                if (this.props.gotOrders) {

                    clearInterval(waitOrders);
                    this.setState({ spin: false })
                }
                if (i == 100) {
                    message.error('fetching order history timed out.')
                    clearInterval(waitOrders);
                    this.setState({ spin: false })
                }
                i++;
            }, 100)
        }
    }

    render() {
        if (!this.props.loggedin) {
            return <Redirect to='/login' />
        }

        return (
            <div style={{ padding: '10px', marginTop: '10px' }}>
                <legend>Order History</legend>
                {this.state.spin ? <Spin tip={this.state.spinTip} style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                <hr />

                {this.props.gotOrders ?
                    this.props.orders.sort((a, b) => { return new Date(b.date) - new Date(a.date) })
                        .map((order, index) => {
                            return <OrderCollapse header={order.date.toString()} extra={order.total.toString()}
                                orderid={order.id} key={index} />
                        })
                    : null}

            </div>
        );
    }
}

export default connect(
    (store) => {
        return {
            loggedin: store.login.fetched,
            token: store.login.token,
            gotOrders: store.orderHistory.fetched,
            orders: store.orderHistory.orders,
        };
    }
)(OrderHistory);