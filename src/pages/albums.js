import React, { Component } from 'react';
import '../App.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FlippyCard from '../partials/flippyCard';
import { Row, Col } from 'reactstrap'
import { getAlbums } from '../redux/actions/getAlbums';
import { getUsers } from '../redux/actions/getUser';
import { getSongs } from '../redux/actions/getSongs';
import { deleteAlbum } from '../redux/actions/deleteAlbum';
import { postShoppingItem } from '../redux/actions/postShoppingItem';
import { getShoppingItems } from '../redux/actions/getShoppingIItems';
import { message, Spin } from 'antd';
import { Button } from 'reactstrap';

class Albums extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AlbumAuthorData: [],
            AlbumAuthorIntegrated: false,
            postsPerPage: 4,
            currentPage: 1,
            spin: false,
            spinTip: '',
        };
    }

    componentDidMount() {

        //start fetching database once logged in
        if (this.props.loggedin) {
            if (!this.props.gotUsers) {
                this.props.dispatch(getUsers(this.props.token));
            }
            if (!this.props.gotAlbums) {
                this.props.dispatch(getAlbums(this.props.token));
            }
            if (!this.props.gotSongs) {
                this.props.dispatch(getSongs(this.props.token));
            }
            if (!this.props.gotShoppingItems) {
                this.props.dispatch(getShoppingItems(this.props.token));
            }
            this.RefreshAlbum();
        }
    }

    RefreshAlbum = () => {
        //check every 1 second to see if albums are fetched. If so, start integrating Albums and Authors
        let i = 0;
        const waitGetAlbums = setInterval(() => {
            if (this.props.gotAlbums && this.props.gotUsers) {
                let newAlbums = []

                this.props.albums
                    .sort((a, b) => { return a.id - b.id })
                    .map((album, index) => {
                        const newAlbum = {
                            'id': album.id,
                            'album_title': album.album_title,
                            'artist': album.artist,
                            'genre': album.genre,
                            'date_posted': album.date_posted,
                            'author': this.props.users.filter(author => author.id == album.author)[0].username,
                            'album_logo': album.album_logo,
                            'price': album.price
                        }

                        newAlbums.push(newAlbum);
                    });

                this.setState({ AlbumAuthorData: newAlbums, AlbumAuthorIntegrated: true });
                clearInterval(waitGetAlbums);
            }
            if (i == 100) {
                message.error('connection timed out.')
                clearInterval(waitGetAlbums);
            }
            i++;
        }, 100)
    }

    confirmDelete = (id) => {
        this.props.dispatch(deleteAlbum(this.props.token, id));

        //wait for 5sec, check every sec to see if delete successful
        let i = 0;
        this.setState({ spin: true, spinTip: 'Deleting Item...' })
        const waitDelete = setInterval(() => {
            if (this.props.albumDeleted) {
                message.success('Album deleted.')
                //refresh database
                this.RefreshAlbum();

                clearInterval(waitDelete);
                this.setState({ spin: false })
            }
            if (i == 50) {
                message.error(this.props.errorAlbum + ' timed out.')
                clearInterval(waitDelete);
                this.setState({ spin: false })
            }
            i++;
        }, 100)
    }

    changePostPerPage = (e) => {
        this.setState({ currentPage: 1, postsPerPage: parseInt(e.target.value) });
    }

    previousClick = () => {
        this.setState((prevState) => {
            const { currentPage } = prevState;
            return { currentPage: currentPage <= 1 ? 1 : currentPage - 1 }
        })
    }

    nextClick = () => {
        this.setState((prevState) => {
            const { currentPage, AlbumAuthorData, postsPerPage } = prevState;
            return {
                currentPage: currentPage * postsPerPage >= AlbumAuthorData.length ? currentPage : currentPage + 1
            }
        })
    }

    firstClick = () => {
        this.setState({ currentPage: 1 })
    }

    lastClick = () => {
        const { AlbumAuthorData, postsPerPage } = this.state;
        const lastPage = parseInt(AlbumAuthorData.length / postsPerPage) + 1;
        this.setState({ currentPage: lastPage })
    }

    pageClick = (page) => {
        this.setState({ currentPage: page })
    }

    addShoppingItem = (album_id, qty) => {
        if (qty === 0) { message.error('quantity entered 0'); return }

        const formData = new FormData();
        formData.set('shopper', this.props.users.filter(user => user.username === this.props.username)[0].id);
        formData.set('album', album_id);
        formData.set('quantity', qty);

        this.props.dispatch(postShoppingItem(this.props.token, formData));

        //wait for 5sec, check every sec to see if addShoppingItem successful
        let i = 0;
        this.setState({ spin: true, spinTip: 'Adding Item...' })
        const waitAdd = setInterval(() => {
            if (this.props.shoppingItemAdded) {
                message.success('Added ' + qty + ' ' + this.props.albums.filter(album => album.id === album_id)[0].album_title)

                clearInterval(waitAdd);
                this.setState({ spin: false })
            }
            if (i == 50) {
                message.error('connection timed out.')
                clearInterval(waitAdd);
                this.setState({ spin: false })
            }
            i++;
        }, 100)
    }

    render() {
        if (!this.props.loggedin) {
            return <Redirect to='/login' />
        }

        const cards = [];

        if (this.state.AlbumAuthorIntegrated) {
            this.state.AlbumAuthorData.map((item, index) => {
                const card = <Col key={index}>
                    <FlippyCard data={item}
                        confirmDelete={(id) => this.confirmDelete(id)}
                        addShoppingItem={(id, qty) => this.addShoppingItem(id, qty)}></FlippyCard>
                </Col>

                cards.push(card);
            })
        }

        const { currentPage, postsPerPage, AlbumAuthorData } = this.state;
        const arrayStart = (currentPage - 1) * postsPerPage;
        const arrayEnd = arrayStart + postsPerPage < cards.length ? arrayStart + postsPerPage : cards.length;
        const cardsPagination = cards.slice(arrayStart, arrayEnd);

        return (
            <div style={{ marginTop: '20px' }}>
                {this.props.errorAlbum} {this.props.errorSong} {this.props.errorUser}{this.props.errorShoppingItem}
                {this.state.spin ? <Spin tip={this.state.spinTip} style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                {
                    this.state.AlbumAuthorIntegrated ?
                        <Row>
                            {cardsPagination}
                        </Row>
                        : <Spin tip='Integrating Author and Albums...' style={{ width: '100%', textAlign: 'center' }}></Spin>
                }

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button onClick={() => this.firstClick()} color='secondary' style={{ marginRight: '5px' }} size='sm'>{'<<'}</Button>
                    <Button onClick={() => this.previousClick()} color='secondary' style={{ marginRight: '5px' }} size='sm'>{'<'}</Button>
                    {currentPage >= 3 ? <Button onClick={() => this.pageClick(currentPage - 2)} color='secondary' style={{ marginRight: '5px' }} size='sm'>{this.state.currentPage - 2}</Button> : null}
                    {currentPage >= 2 ? <Button onClick={() => this.pageClick(currentPage - 1)} color='secondary' style={{ marginRight: '5px' }} size='sm'>{this.state.currentPage - 1}</Button> : null}
                    <Button color='primary' style={{ marginRight: '5px' }} size='sm'>{this.state.currentPage}</Button>
                    {currentPage * postsPerPage < AlbumAuthorData.length ? <Button onClick={() => this.pageClick(currentPage + 1)} color='secondary' style={{ marginRight: '5px' }} size='sm'>{this.state.currentPage + 1}</Button> : null}
                    {(currentPage + 1) * postsPerPage < AlbumAuthorData.length ? <Button onClick={() => this.pageClick(currentPage + 2)} color='secondary' style={{ marginRight: '5px' }} size='sm'>{this.state.currentPage + 2}</Button> : null}
                    <Button onClick={() => this.nextClick()} color='secondary' style={{ marginRight: '5px' }} size='sm'>{'>'}</Button>
                    <Button onClick={() => this.lastClick()} color='secondary' style={{ marginRight: '5px' }} size='sm'>{'>>'}</Button>

                    <div style={{ display: 'flex' }}>
                        <select style={{ marginRight: '5px' }} onChange={(e) => this.changePostPerPage(e)}>
                            <option value={2}>2 Posts/Page</option>
                            <option value={3}>3 Posts/Page</option>
                            <option value={4} selected>4 Posts/Page</option>
                            <option value={6}>6 Posts/Page</option>
                            <option value={8}>8 Posts/Page</option>
                            <option value={10}>10 Posts/Page</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (store) => {
        return {
            token: store.login.token,
            loggedin: store.login.fetched,
            errorAlbum: store.albums.error,
            errorSong: store.songs.error,
            errorUser: store.users.error,
            albums: store.albums.albums,
            gotAlbums: store.albums.fetched,
            songs: store.songs.songs,
            gotSongs: store.songs.fetched,
            users: store.users.users,
            gotUsers: store.users.fetched,
            albumDeleted: store.albums.deleted,
            username: store.login.username,
            errorShoppingItem: store.shoppingItems.error,
            shoppingItemAdded: store.shoppingItems.added,
            gotShoppingItems: store.shoppingItems.fetched,
            shoppingItems: store.shoppingItems.shoppingItems,
        };
    }
)(Albums);