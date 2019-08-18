import React, { Component } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { getOrderDetail } from '../redux/actions/getOrderDetail';
import { message, Collapse } from 'antd';

class OrderCollapse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            content: null,
        };
    }

    jsonToArray = (jsonText) => {
        return JSON.stringify(jsonText).replace('{', '').replace('}', '').replace(/"/g, '').split(',')
    }

    orderDetail = async (orderid) => {
        await this.setState(prevState => { return { open: !prevState.open } })
        if (this.state.open) {
            this.props.dispatch(getOrderDetail(this.props.token, orderid));

            //wait for 5sec, check every 0.1s to see if order detail is fetched
            let i = 0;
            const waitOrderDetail = setInterval(() => {
                if (this.props.gotOrderDetail) {
                    const sales = this.jsonToArray(this.props.orderDetail.metadata)
                    const address = this.jsonToArray(this.props.orderDetail.billing_details.address)
                    const cardFull = this.props.orderDetail.payment_method_details.card
                    delete cardFull.checks
                    const card = this.jsonToArray(cardFull)
                    const content = <div>
                        {sales.map((sale, index) => { return <div key={'s' + index.toString()}>{sale.replace(':', ': ')}</div> })}
                        <Collapse bordered={false} style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                            <Collapse.Panel header={'billing address'} >
                                {address.map((addr, index) => { return <div key={'a' + index.toString()}>{addr.replace(':', ': ')}</div> })}
                            </Collapse.Panel>
                        </Collapse>
                        <Collapse bordered={false} style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                            <Collapse.Panel header={'payment card'} >
                                {card.map((c, index) => { return <div key={'c' + index.toString()}>{c.replace(':', ': ')}</div> })}
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                    this.setState({ content: content })
                    clearInterval(waitOrderDetail);
                }
                if (i == 50) {
                    message.error('fetching order detail timed out.')
                    clearInterval(waitOrderDetail);
                }
                i++;
            }, 100)
        }
    }

    render() {
        const { Panel } = Collapse;

        return (
            <Collapse bordered={false} onChange={() => this.orderDetail(this.props.orderid)}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                <Panel header={this.props.header} extra={'$' + this.props.extra}>
                    {this.state.content ? this.state.content : 'fetching details'}
                </Panel>
            </Collapse>
        );
    }
}

export default connect(
    (store) => {
        return {
            token: store.login.token,
            gotOrderDetail: store.orderHistory.gotDetail,
            orderDetail: store.orderHistory.detail,
        };
    }
)(OrderCollapse);