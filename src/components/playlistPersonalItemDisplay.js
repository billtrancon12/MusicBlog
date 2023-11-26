import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import '../css/playlistPersonalDisplay.css'
import { CircularProgress } from '@mui/material';
import { Button } from 'rsuite';

const PlaylistPersonalItemDisplay = (props) =>{
    const [displayItems, setDisplayItems] = useState(null)
    const [fetchFinishCount, setFetchFinishCount] = useState(0)
    const [isFetch, setFetch] = useState(false)
    const [isFetchAll, setFetchAll] = useState(false)
    const playlist = useRef([])

    useEffect(()=>{
        async function fetchSong(videoId){
            await axios.get(`/.netlify/functions/ytmusic_api/song/?videoId=${videoId}`).then(res =>{
                const response = JSON.parse(res.data)
                let artistName = (response.body.artists)
                playlist.current.push({
                    artistName: (artistName !== null && artistName.length !== 0) ? artistName[0].name : "N/A",
                    songName: response.body.name,
                    thumbnail: response.body.thumbnails[0].url,
                    videoId: response.body.videoId
                })
                setFetchFinishCount(playlist.current.length)
            }).catch(err => console.log(err))
        }
        if(!isFetch){
            const songs = props.songs
            songs.forEach(song =>{
                console.log("t",song)
                fetchSong(song.videoId)
            })
            setFetch(true)
        }
        if(isFetch && playlist.current.length === props.songs.length){
            let temp = []
            playlist.current.forEach((song, id) => {
                temp.push(
                    <li className='playlist_personal_item_display_item' key={id}>
                        <Link to={`song/videoId/${song.videoId}`} state={{song: song}}>
                            <div className='playlist_personal_item_display_thumbnail_wrapper'>
                                <img className='playlist_personal_item_display_thumbnail' src={song.thumbnail} alt={'display_thumbnail'}></img>
                            </div>
                            <div className='playlist_personal_item_display_song_name_wrapper'>
                                <span className='playlist_personal_item_display_song_name'>{song.songName}</span>
                            </div>
                            <div className='playlist_personal_item_display_artist_name_wrapper'>
                                <span className='playlist_personal_item_display_artist_name'>{song.artistName}</span>
                            </div>
                        </Link>
                    </li>
                )
            })
            setDisplayItems(temp)
            setFetchAll(true)
        }

        if(props.refresh === true){
            setFetch(false)
            setFetchAll(false)
            setDisplayItems(null)
            playlist.current = []
        }
    }, [isFetch, isFetchAll, fetchFinishCount, props.videoId, props.songs, props.refresh])

    return (
        <div className='playlist_personal_item_display_wrapper'>
            <div className='playlist_personal_item_display_heading_wrapper'>
                <div className='playlist_personal_item_display_playlist_name_wrapper'>
                    <span className='playlist_personal_item_display_playlist_name'>{props.playlistName}</span>
                </div>
                <div className='playlist_personal_item_close'>
                    <CloseIcon style={{'width': '100%', 'height': '30px'}} onClick={()=>props.onClick()}></CloseIcon>
                </div>
            </div>
            <div className='playlist_personal_item_display_content_wrapper'>
                <ul className='playlist_personal_item_display_list'>
                    {(isFetchAll) ? displayItems : <CircularProgress />}
                </ul>
            </div>
            <div className='playlist_personal_item_display_button_wrapper'>
                {/* <Link to={}></Link> */}
                <Button className='playlist_personal_item_display_button'>Play All</Button>
            </div>
        </div>
    )
}

export default PlaylistPersonalItemDisplay;