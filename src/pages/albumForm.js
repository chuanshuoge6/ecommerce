import React, { Component } from 'react';
import '../App.css';
import { Input, Spin } from 'antd';
import { FaOpencart, FaLyft, FaSignature, FaDollarSign, FaRegShareSquare } from "react-icons/fa";
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { postAlbum } from '../redux/actions/postAlbum';
import { putAlbum } from '../redux/actions/putAlbum';
import { Redirect } from 'react-router-dom';
import { getAlbums } from '../redux/actions/getAlbums';
import { getUsers } from '../redux/actions/getUser';
import { message } from 'antd';
const image2base64 = require('image-to-base64');

class albumForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artist: '',
            album_title: '',
            genre: '',
            album_logo: null,
            mode: 'add',
            price: 0,
            imgSize: null,
            spin: false,
            spinTip: '',
        };
    }

    componentDidMount() {
        if (this.props.loggedin) {
            if (!this.props.gotUsers) {
                this.props.dispatch(getUsers(this.props.token));
            }
            if (!this.props.gotAlbums) {
                this.props.dispatch(getAlbums(this.props.token));
            }
        }

        //detecting if add or update
        const pathName = window.location.pathname.split('/');
        const albumId = pathName[pathName.length - 1];

        if (albumId == 'addAlbum') {
            //add
            this.setState({ mode: 'add' })
        } else {
            //update
            const album_id = parseInt(albumId);

            const waitGetAlbums = setInterval(() => {
                if (this.props.gotAlbums) {
                    const album = this.props.albums.filter(album => album.id == album_id)[0];

                    this.setState({
                        mode: 'update',
                        artist: album.artist,
                        album_title: album.album_title,
                        genre: album.genre,
                        album_logo: album.album_logo,
                        price: album.price,
                    })
                    clearInterval(waitGetAlbums);
                }
            }, 100)
        }
    }

    inputChange = (e, p) => {
        //album_logo save img in base64
        if (p === 'album_logo') {
            image2base64(e.target.value) // you can also to use url
                .then(
                    (response) => {
                        //quit if image is the default or too small
                        if (response.length < 2500) { return }

                        this.setState({ imgSize: response.length, album_logo: response }) //cGF0aC90by9maWxlLmpwZw==
                    }
                )
                .catch(
                    (error) => {
                        message.error(error.toString()) //Exepection error....
                    }
                )
        }
        else {
            this.setState({ [p]: e.target.value });
        }
    }

    fileChange = (e) => {
        console.log(e.target.files);
        this.setState({ album_logo: e.target.files[0] })
    }

    formSubmit = (e) => {
        e.preventDefault();
        if (!this.state.album_logo) { message.warning('wait for logo'); return }

        const formData = new FormData();
        formData.set('artist', this.state.artist);
        formData.set('album_title', this.state.album_title);
        formData.set('genre', this.state.genre);
        formData.set('author', this.props.users.filter(user => user.username == this.props.username)[0].id);
        formData.set('album_logo', this.state.album_logo);
        formData.set('price', this.state.price);

        if (this.state.mode == 'add') {
            this.props.dispatch(postAlbum(this.props.token, formData))

            //wait for 5sec, check every sec to see if post successful
            let i = 0;
            this.setState({ spin: true, spinTip: 'Adding Album...' })
            const waitPost = setInterval(() => {
                if (this.props.added) {
                    message.success('post successful')
                    clearInterval(waitPost);
                    this.setState({ spin: false })
                }
                if (i == 100) {
                    message.error('post timeout')
                    clearInterval(waitPost);
                    this.setState({ spin: false })
                }
                i++;
            }, 100)
        }
        else {
            //update
            const pathName = window.location.pathname.split('/');
            const albumId = parseInt(pathName[pathName.length - 1]);

            this.props.dispatch(putAlbum(this.props.token, albumId, formData));

            let i = 0;
            this.setState({ spin: true, spinTip: 'Updating Album...' })
            const waitUpdate = setInterval(() => {
                if (this.props.updated) {
                    message.success('post updated')
                    clearInterval(waitUpdate);
                    this.setState({ spin: false })
                }
                if (i == 100) {
                    message.error('update timeout')
                    clearInterval(waitUpdate);
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
            <form style={{ marginLeft: '10px', width: '300px' }}
                onSubmit={(e) => this.formSubmit(e)}>
                <legend>Album Form</legend>
                {this.state.spin ? <Spin tip={this.state.spinTip} style={{ width: '100%', textAlign: 'center' }}></Spin> : null}
                <hr />
                <p style={{ color: 'red' }}>{this.props.error}</p>

                <Input placeholder={this.state.mode == 'add' ? "artist" : this.state.artist}
                    required={this.state.mode == 'add' ? true : false}
                    prefix={<FaOpencart style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'artist')}
                    style={{ marginTop: '5px' }}
                />
                <Input placeholder={this.state.mode == 'add' ? "album title" : this.state.album_title}
                    required={this.state.mode == 'add' ? true : false}
                    prefix={<FaSignature style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'album_title')}
                    style={{ marginTop: '15px' }}
                />
                <Input placeholder={this.state.mode == 'add' ? "genre" : this.state.genre}
                    required={this.state.mode == 'add' ? true : false}
                    prefix={<FaLyft style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'genre')}
                    style={{ marginTop: '15px' }}
                />
                <Input type='number' step="0.01" min='0' placeholder={this.state.mode == 'add' ? "price" : this.state.price}
                    required={this.state.mode == 'add' ? true : false}
                    prefix={<FaDollarSign style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e) => this.inputChange(e, 'price')}
                    style={{ marginTop: '15px' }}
                />
                <Input type='url' placeholder={this.state.mode == 'add' ? "logo url(https://example.com/img.png)" : 'https://example.com/img.png'}
                    required={this.state.mode == 'add' ? true : false}
                    prefix={<FaRegShareSquare style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onBlur={(e) => this.inputChange(e, 'album_logo')}
                    style={{ marginTop: '15px' }}
                />
                {this.state.album_logo ? <div style={{ marginTop: '15px' }}>
                    <img src={`data:image/jpeg;base64,${this.state.album_logo}`}
                        style={{ height: '75px', width: '100px' }} />
                    {this.state.imgSize ? <span style={{ marginLeft: '10px' }}>size: {this.state.imgSize} byte</span> : null}
                </div>
                    : null}
                <Button color="success" type='submit' size='sm'
                    style={{ marginTop: '15px' }}
                >Submit</Button>
            </form>
        );
    }
}

export default connect(
    (store) => {
        return {
            token: store.login.token,
            loggedin: store.login.fetched,
            added: store.albums.added,
            gotAlbums: store.albums.fetched,
            albums: store.albums.albums,
            gotUsers: store.users.fetched,
            users: store.users.users,
            username: store.login.username,
            error: store.albums.error,
            updated: store.albums.updated,
        };
    }
)(albumForm);