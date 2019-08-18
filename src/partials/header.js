import React, { Component } from 'react';
import '../App.css';
import { Menu, Input, Badge } from 'antd';
import { Link } from 'react-router-dom'
import { FaCompactDisc, FaPlus, FaEdit, FaBarcode, FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import { GiLoveSong } from "react-icons/gi";
import { IoIosLogOut, IoIosLogIn } from "react-icons/io";
import { GoListOrdered } from "react-icons/go";
import { connect } from 'react-redux';
import { reset } from '../redux/actions/logoutAction';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menu_mode: null,
            current: 'albums',
        };
    }

    componentWillMount() {
        //change menu mode based on screen width
        const mode = window.innerWidth > 434 ? "horizontal" : "horizontal";
        this.setState({ menu_mode: mode });
    }

    handleClick = (e) => {

        this.setState({
            current: e.key,
        });
    }

    logout = () => {
        this.props.dispatch(reset())
    }

    render() {
        return (
            <div style={{ position: 'sticky', top: 0, width: '100%', zIndex: 2 }}>

                <Menu
                    style={{ backgroundColor: '#fcefe5' }}
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode={this.state.menu_mode}
                >
                    <Menu.Item key="home">
                        <Link to='/'><span className='Nav-Brand'>Django</span></Link>
                    </Menu.Item>
                    <Menu.SubMenu title={<span><FaCompactDisc /> Albums</span>}>
                        <Menu.Item key="albums">
                            <Link to='/'> <FaCompactDisc /> Get Albums</Link>
                        </Menu.Item>
                        <Menu.Item key="add">
                            <Link to='/addAlbum'> <FaPlus /> Add Album</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    {
                        this.props.loggedin ?
                            <Menu.Item key="shoppingCart" style={{ float: 'right' }}>
                                <Link to='/shoppingCart'>
                                    <span style={{ fontSize: '20px' }}><FaShoppingCart /></span>
                                    <Badge count={this.props.shoppingItems.length}></Badge></Link>
                            </Menu.Item>
                            :
                            null
                    }
                    {
                        this.props.loggedin ?
                            <Menu.SubMenu title={<span><FaUser /> {this.props.username}</span>} style={{ float: 'right' }}>
                                <Menu.Item key="1" >
                                    <Link to='/orderHistory/'> <GoListOrdered /> My Orders</Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to='/changePassword/'> <FaBarcode /> Change Password</Link>
                                </Menu.Item>
                                <Menu.Item key="3" onClick={() => this.logout()}>
                                    <Link to='/logout'> <IoIosLogOut /> Logout</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                            :
                            <Menu.Item key="login" style={{ float: 'right' }}>
                                <Link to='/login'> <IoIosLogIn /> Login</Link>
                            </Menu.Item>
                    }
                </Menu>
            </div>
        );
    }
}

export default connect(
    (store) => {
        return {
            username: store.login.username,
            token: store.login.token,
            loggingin: store.login.fetching,
            loggedin: store.login.fetched,
            shoppingItems: store.shoppingItems.shoppingItems,
        };
    }
)(Header);