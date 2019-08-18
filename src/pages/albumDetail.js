import React, { Component } from 'react';
import '../App.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAlbums } from '../redux/actions/getAlbums';
import { getUsers } from '../redux/actions/getUser';
import { getSongs } from '../redux/actions/getSongs';
import { FaHeart, FaPlus } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { Spin } from 'antd';

class AlbumDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {

        //load database if not already loaded
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
        }
    }

    render() {
        if (!this.props.loggedin) {
            return <Redirect to='/login' />
        }

        const pathName = window.location.pathname.split('/');
        const albumId = parseInt(pathName[pathName.length - 1]);
        const album = this.props.albums.filter(album => album.id == albumId)[0];
        const albumTitle = album.album_title;
        const albumLogo = album.album_logo;
        const songs = this.props.songs.filter(song => song.album == albumId)
        const songList = []
        songs.map((item, index) => {
            const songItem =
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%' }} key={index}>
                        <span>
                            <b>{item.song_title}</b>{' '}
                            {item.is_favorite ? <FaHeart /> : ''}
                        </span>
                        <div>
                            <MdEdit style={{ marginRight: '10px', cursor: 'pointer' }} />
                            <MdDelete style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                    <hr />
                </div>
            songList.push(songItem);
        })
        const artist = album.artist;

        return (
            <div style={{ padding: '10px', marginTop: '10px' }}>
                {this.props.errorAlbum} {this.props.errorSong} {this.props.errorUser}

                {this.props.gotAlbums && this.props.gotSongs ?
                    <div>
                        <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
                            <h4>{albumTitle}</h4>
                            <img src={`data:image/jpeg;base64,${albumLogo}`}
                                style={{ height: '30px', width: '40px' }} />
                        </div>
                        <hr />
                        <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontStyle: 'italic' }}>by {artist}</span>
                            <FaPlus style={{ cursor: 'pointer' }} />
                        </div>
                        <hr />
                        {songList}
                    </div>
                    :
                    <Spin tip='Loading Songs' style={{ width: '100%', textAlign: 'center' }}></Spin>
                }
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
        };
    }
)(AlbumDetail);