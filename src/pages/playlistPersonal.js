import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import SongWrapper from "../components/songWrapper";
import ArtistWrapper from "../components/artistWrapper";
import '../css/playlist.css'
import LoadingPage from "./loading";

const PlaylistPersonalPage = () =>{
    const [videoSize, setVideoSize] = useState(window.innerWidth * 0.5)
    const [isNextSong, setNextSong] = useState(false)
    const [menuSectionClicked, setMenuSectionClicked] = useState("Up Next")
    const [isFetchSongs, setFetchSongs] = useState(false)
    const [isFetchLyrics, setFetchLyrics] = useState(false)
    const [isFetchArtist, setFetchArtist] = useState(false)
    const [lyrics, setLyrics] =  useState("")
    const [artist_name, setArtistName] = useState("")
    const [artist_thumbnail, setArtistThumbnail] = useState("")
    const [songName, setSongName] = useState("")
    const [songURL, setSongURL] = useState("")
    const [playlistMenu, setPlaylistMenu] = useState(null)
    const [upNext, setUpNext] = useState(null)
    const {playlistId} = useParams()
    const {playlistIndex} = useParams()
    const location = useLocation()
    const {playlist} = (location.state === null || location.state === undefined) ? "" : location.state
    const navigate = useNavigate()

    useEffect(()=>{
        async function fetchSongs(playlistId){
            let ret;
            await axios.get(`/.netlify/functions/getPlaylist/getPlaylistContent/?playlistName=${playlistId}&playlistId=${playlistId}`)
            .then(res => {
                const response = JSON.parse(res.data)
                let playlistData = JSON.parse(response.body.body.body)

                // const tempArr = []
                // data.items.forEach(item => {
                //     tempArr.push(item.snippet)
                // }
                setFetchSongs(true)
                ret =  playlistData
            }).catch(err => console.log(err))
            return ret;
        }

        async function fethcSongLyrics(songName, authorName){
            await axios.get(`/.netlify/functions/ytmusic_api/lyrics/?songName=${songName}&authorName=${authorName}`).then(res =>{
                const response = JSON.parse(res.data)
                if(response.status === 200){
                    const responseData = JSON.parse(response.body)
                    const lyrics = responseData.lyrics.lines;
                    const temp = [];
                    lyrics.forEach((el, id)=>{
                        const lyric = <p key={id}>{el.words}</p>
                        temp.push(lyric)
                    })
                    setLyrics(temp);
                }
                setFetchLyrics(true)
            }).catch(err => console.log(err))
        }

        async function fetchArtist(name){
            await axios.get(`/.netlify/functions/ytmusic_api/artist/?name=${name}`).then(res =>{
                const response = JSON.parse(res.data)
                response.body.forEach(artist => {
                    if(artist.name.replace('+', ' ').toLowerCase() === name.replace('+',' ').toLowerCase()){
                        setArtistThumbnail(artist.thumbnails[0].url)
                        setArtistName(artist.name)
                    }
                })
            }).catch(err => console.log(err))
            setFetchArtist(true)
        }

        async function fetchData(){
            let playlistData
            if(playlist === undefined) {
                playlistData = await fetchSongs(playlistId)
                playlistData = playlistData.songs
            }
            else {
                playlistData = playlist
                setFetchSongs(true)
            }

            let songs = playlistData
            let song = songs[(playlistIndex === undefined) ? 0 : playlistIndex]
            let index = (playlistIndex === undefined) ? 0 : playlistIndex
            let songName = (playlist === undefined) ? song.name : song.songName
            setSongName(songName)
            setSongURL(song.videoId)
            fetchArtist(song.artistName)
            fethcSongLyrics(songName, song.artistName)

            let tempArr = []
            songs.forEach((item, id) => {
                tempArr.push(
                    <li className={"up_next_item " + ((id === parseInt(index, 10)) ? "playlist_song_chosen" : "")} id={"playlist_song_id " + id} key={id} onClick={()=>reload()}>
                        <Link to={`/playlist/personal/${playlistId}/${id}`} state={{playlist: playlist}}>
                        <div className="up_next_song_wrapper">
                                <img className="up_next_song_thumbnail" src={item.thumbnail} alt="song_thumbnail" style={{'width': '60px', 'height': '60px'}}></img>
                                <div className="up_next_song_name"><span>{condenseText((playlist === undefined) ? item.name : item.songName, 25)}</span></div>
                                <div className="up_next_song_artist"><span>{item.artistName}</span></div>                                
                            </div>
                        </Link>
                    </li>
                )
            })
            setPlaylistMenu(tempArr)
            setUpNext(tempArr)
        }

        function reload(){
            setFetchArtist(false)
            setFetchLyrics(false)
            setFetchSongs(false)
        }

        if(!isFetchArtist && !isFetchLyrics && !isFetchSongs){
            fetchData()
        }
        if(isNextSong){
            let index = (playlistIndex === undefined) ? 0 : parseInt(playlistIndex, 10) 
            // Go back to the beginning of the playlist if play all the songs
            let nextSongIndex = (index + 1 === playlistMenu.length) ? 0 : index + 1
            reload()
            setNextSong(false)
            navigate(`/playlist/personal/${playlistId}/${nextSongIndex}`,{
                state: {
                    playlist: playlist
                }
            })
        }
    }, [isFetchArtist, isFetchLyrics, isFetchSongs, playlistId, playlistIndex, isNextSong, playlistMenu, playlist, navigate])

    useLayoutEffect(()=>{
        function handleResize(){
            if(window.innerWidth >= 1000)
                setVideoSize(window.innerWidth * 0.55)
            else if(window.innerWidth >= 800)
                setVideoSize(window.innerWidth * 0.65)
            else if(window.innerWidth >= 600)
                setVideoSize(window.innerWidth * 0.75)
            else
                setVideoSize(window.innerWidth * 0.9)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [videoSize])

    function condenseText(text, maxLength){
        var tempText = text
        if(tempText === undefined) return
        text = ""
        for(let i = 0; i < maxLength && i < tempText.length; i++){
            text += tempText[i]
        }
        text += (tempText.length >= maxLength) ? "..." : ""
        return text
    }

    function handleSectionClick(e){
        if(e.target.childNodes[0].innerHTML === "Up Next" || e.target.childNodes[0].data === "Up Next"){
            setPlaylistMenu(upNext)
        }
        else if(e.target.childNodes[0].innerHTML === "Lyrics" || e.target.childNodes[0].data === "Lyrics"){
            setPlaylistMenu(lyrics)
        }
        else{
            setPlaylistMenu(upNext)
        }
        setMenuSectionClicked((e.target.childNodes[0].innerHTML !== undefined) ? e.target.childNodes[0].innerHTML : e.target.childNodes[0].data)
    }

    function nextSong(){
        setNextSong(true)
    }

    if(isFetchArtist && isFetchLyrics && isFetchSongs){
        return (
            <div className="playlist_content_wrapper">
                <div className="playlist_song_title_wrapper">
                    <h3 className="song_title">{songName}</h3>
                </div>
                <div className="playlist_wrapper">
                    <SongWrapper url={songURL} className="playlist_song_wrapper" width={videoSize} height={videoSize * 0.5} onEnded={()=>nextSong()}></SongWrapper>
                    <div className="playlist_song_list_wrapper" style={{'maxHeight': `${(window.innerWidth >= 1000) ? videoSize * 0.5 : 300}px`}}>
                        <div className="playlist_song_list_menu">
                            <div className={"playlist_song_list_menu_section" + ((menuSectionClicked === "Up Next") ? " section_clicked" : "")} onClick={(e)=>handleSectionClick(e)}>
                                <span className="playlist_song_list_menu_title">Up Next</span>
                            </div>
                            <div className={"playlist_song_list_menu_section" + ((menuSectionClicked === "Lyrics") ? " section_clicked" : "")} onClick={(e)=>handleSectionClick(e)}>
                                <span className="playlist_song_list_menu_title">Lyrics</span>
                            </div>
                        </div>
                        <ul className="playlist_song_list">
                            {playlistMenu}
                        </ul>
                    </div>
                </div>
                <ArtistWrapper artistName={artist_name} src={artist_thumbnail} artistQuery={artist_name.replace(' ', '+')}></ArtistWrapper>
            </div>
        )
    }
    else{
        return(
            <LoadingPage></LoadingPage>
        )
    }
}

export default PlaylistPersonalPage;