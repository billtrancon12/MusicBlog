import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import LoadingPage from "./loading";
import PlaylistPersonalSearchItem from "../components/playlistPersonalSearchItem";
import PlaylistPersonalItemDisplay from "../components/playlistPersonalItemDisplay";

const PlaylistPersonalSearchPage = (props) =>{
    const [playlists, setPlaylists] = useState(null)
    const [playlistItems, setPlaylistItems] = useState(null)
    const [playlistItem, setPlaylistItem] = useState(null)
    const [isFetch, setFetch] = useState(false)
    const [fetchedContentCount, setFetchContentCount] = useState(0)
    const [isFetchAll, setFetchAll] = useState(false)
    const [isPlaylistClicked, setClickedPlaylist] = useState(false)
    const playlistContents = useRef(new Map())


    useEffect(()=>{
        async function fetchPersonalPlaylists(username){
            let playlistsTemp = []
            await axios.get(`/.netlify/functions/getPlaylist/getAllPlaylists/?username=${username}`).then(res =>{
                const response = JSON.parse(res.data)
                playlistsTemp = JSON.parse(response.body.body.body)
                setPlaylists(playlistsTemp)
            }).catch(err => console.log(err))
            return playlistsTemp
        }

        async function fetchPersonalPlaylistContent(playlistName, playlistId){
            await axios.get(`/.netlify/functions/getPlaylist/getPlaylistContent/?playlistName=${playlistName}&playlistId=${playlistId}`)
            .then(res =>{
                const response = JSON.parse(res.data)
                const playlist = JSON.parse(response.body.body.body)
                playlistContents.current.set(playlist.playlistName, playlist.songs)
                setFetchContentCount(playlistContents.current.size)

            }).catch(err => console.log(err))
        }

        async function fetchData(username){
            let playlistsTemp = await fetchPersonalPlaylists(username)
            playlistsTemp.forEach(playlist => {
                fetchPersonalPlaylistContent(playlist.playlistName, playlist.playlistId)
            })
            setFetch(true)
        }

        function handleClickPlaylist(e){
            const clickedPlaylist = e.target
            let playlistName = clickedPlaylist.getAttribute('value')
            let temp = {
                playlistName: playlistName,
                songs: playlistContents.current.get(playlistName)
            }
            setPlaylistItem(temp)
            setClickedPlaylist(true)
        }

        if(!isFetch){
            fetchData(props.username)
        }

        if(isFetch && fetchedContentCount === playlists.length){
            let temp = []
            playlists.forEach((playlist, id) => {
                const contents = playlistContents.current.get(playlist.playlistName)
                temp.push(<PlaylistPersonalSearchItem playlistName={playlist.playlistName} songs={contents} key={id} onClick={handleClickPlaylist}></PlaylistPersonalSearchItem>)
            })
            setPlaylistItems(temp)
            setFetchAll(true)
        }

        if(isPlaylistClicked){
            setClickedPlaylist(false)
        }
    }, [isFetch, playlists, fetchedContentCount, isFetchAll, playlistItem, isPlaylistClicked, props.username])

    function handleClickedClosePlaylist(){
        setPlaylistItem(null)
    }

    if(!isFetchAll){
        return <LoadingPage></LoadingPage>
    }
    else{
        return (
            <div className="playlist_personal_search_wrapper">
                <ul className="playlist_personal_search_list">
                    {playlistItems}
                </ul>
                {(playlistItem !== null) ? 
                    <PlaylistPersonalItemDisplay 
                        refresh={isPlaylistClicked} 
                        playlistName={playlistItem.playlistName}
                        playlistId={playlistItem.playlistId} 
                        songs={playlistItem.songs} 
                        onClick={handleClickedClosePlaylist}>
                    </PlaylistPersonalItemDisplay>
                    : ""
                }
            </div>
        )
    }
    
}

export default PlaylistPersonalSearchPage;