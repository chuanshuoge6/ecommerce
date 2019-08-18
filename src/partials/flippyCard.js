import React, { Component } from 'react';
import '../App.css';
import { FaPenNib } from "react-icons/fa";
import { Button } from 'reactstrap';
import { MdEdit, MdDelete, MdFlip, MdAddShoppingCart, MdExposureNeg1, MdExposurePlus1 } from "react-icons/md";
import { Link } from 'react-router-dom';
import { Popconfirm, Popover, Input } from 'antd';

export default class FlippyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            qty: 0,
            qty_input: null,
        };
        this.myRef = React.createRef();
    }

    flipClick = () => {
        this.myRef.current.classList.toggle('manu-flip');
        console.log('Album: ', this.props.data.album_title, ' DOM class: ', this.myRef.current.classList);
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleVisibleChange = visible => {
        this.setState({ visible, qty_input: null, qty: 0 });
        this.flipClick();
    };

    add = async () => {
        await this.setState({ qty_input: null });
        this.setState(prevState => { return { qty: prevState.qty + 1 } })
    }

    subtract = async () => {
        await this.setState({ qty_input: null });
        if (this.state.qty > 0) {
            this.setState(prevState => { return { qty: prevState.qty - 1 } })
        }
    }

    inputChange = (e) => {
        this.setState({ qty_input: parseInt(e.target.value), qty: parseInt(e.target.value) })
    }

    render() {
        const imgSrc = this.props.data.album_logo;
        const detailLink = '/albumDetail/' + this.props.data.id;
        const updateLink = '/updateAlbum/' + this.props.data.id;

        return (
            <div className="flip-container" ref={this.myRef} onTouchStart={() => this.flipClick()} style={{ margin: '10px' }}>
                <div className="flipper">
                    <div className="front" style={{ backgroundColor: 'white' }}>
                        <img src={`data:image/jpeg;base64,${imgSrc}`}
                            style={{ height: '150px', width: '100%' }} />
                        <div style={{ height: '60px' }}>
                            <h6 style={{ textAlign: 'center', marginTop: '10px' }}>{this.props.data.album_title}</h6>
                        </div>
                        <div style={{ backgroundColor: '#F4F6F6', height: '30px', paddingLeft: '5px' }}>
                            <FaPenNib /> <span>{this.props.data.author}</span>
                        </div>
                        <MdFlip className='flip-button' onClick={() => this.flipClick()} />
                    </div>
                    <div className="back" style={{ backgroundColor: 'white' }}>
                        <div style={{ textAlign: 'center', height: '220px', paddingTop: '10px' }}>
                            <p>Artist: {this.props.data.artist}</p>
                            <p>Genre: {this.props.data.genre}</p>
                            <p>Price: ${this.props.data.price}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft: '5px', marginRight: '5px' }}>
                                <Link to={detailLink}><Button color='primary' size='sm'>View Detail</Button></Link>
                                <Link to={updateLink}><Button outline size='sm'><MdEdit /></Button></Link>
                                <Popconfirm
                                    title="Are you sure to delete?"
                                    onConfirm={() => this.props.confirmDelete(this.props.data.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button outline size='sm'><MdDelete /></Button>
                                </Popconfirm>
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#F4F6F6', height: '30px', paddingLeft: '5px' }}>
                            <FaPenNib /> <span>{this.props.data.date_posted.split('.')[0].replace('T', ' ')}</span>
                        </div>
                        <MdFlip className='flip-button' onClick={() => this.flipClick()} />
                        <Popover
                            content={
                                <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#D5F5E3' }}>
                                    <a onClick={() => this.props.addShoppingItem(this.props.data.id, this.state.qty)}>Add to Cart</a>
                                    <span>|</span>
                                    <a onClick={this.hide}>Cancel</a>
                                </div>
                            }
                            title={

                                <Input
                                    type='number'
                                    onChange={(e) => { this.inputChange(e) }}
                                    style={{ width: '150px' }}
                                    addonBefore={<MdExposureNeg1 onClick={() => this.subtract()} style={{ cursor: 'pointer', fontSize: '20px' }} />}
                                    addonAfter={<MdExposurePlus1 onClick={() => this.add()} style={{ cursor: 'pointer', fontSize: '20px' }} />}
                                    value={this.state.qty_input || this.state.qty}
                                />
                            }
                            trigger="click"
                            visible={this.state.visible}
                            onVisibleChange={this.handleVisibleChange}
                        >
                            <MdAddShoppingCart className='shopping-cart' />
                        </Popover>
                    </div>
                </div>
            </div>
        );
    }
}
