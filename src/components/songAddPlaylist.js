import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer} from "react-toastify";
import { Button } from "rsuite";
import SongAddPlaylistComponent from "./songAddPlaylistComponent";

const SongAddPlaylist = (props) => {
    const [playlistItem, setPlaylistItem] = useState(null)
    const [isFetch, setFetch] = useState(false)
    const [createPlaylistClicked, setCreatePlaylistClicked] = useState(false)
    const [successCreate, setSuccessCreate] = useState(-1)
    // const [playlistNameInputs, setPlaylistNameInputs] = useState([])
    const playlistRef = useRef(null)
    const playlistInputsRef = useRef([])
    const numCreatePlaylistClicked = useRef(0)


    useEffect(()=>{
        function handlePlaylistNameInputChange(e){
            playlistInputsRef[parseInt(e.target.id, 10)] = e.target.value
        }

        async function handlePlaylistNameInputSubmit(e){
            if(e.key === "Enter"){
                e.preventDefault()
                let id = parseInt(e.target.id, 10)
                await axios.post('/.netlify/functions/addPlaylist/createPlaylist', {
                    playlist: {name: playlistInputsRef[id], id: playlistInputsRef[id]},
                    username: "empty"
                }).then(res => {
                    const response = JSON.parse(res.data)
                    toast(response.body, {
                        position: toast.POSITION.TOP_CENTER,
                    })
                    if(response.status === 200) {
                        console.log(playlistRef.current.length)
                        let tempArr = playlistRef.current
                        tempArr.splice(playlistRef.current.length - 1 - numCreatePlaylistClicked.current + id , 1, 
                            <SongAddPlaylistComponent 
                                playlistName={playlistInputsRef[id]} 
                                songName={props.songName} 
                                artistName={props.artistName} 
                                playlistId={playlistInputsRef[id]} 
                                videoId={props.videoId}
                            />
                        )
                        playlistRef.current = tempArr
                        setSuccessCreate(id)
                    }
                }).catch(err => console.log(err))
            }
        }

        function handleCreatePlaylistClick(e){
            let tempArr = playlistRef.current
            tempArr.splice(tempArr.length - 1, 0, 
                <form className="create_playlist_form_s" key={tempArr.length}>
                    <input 
                        placeholder="Enter your playlist name here..." 
                        className="playlist_name_input" 
                        id={`${numCreatePlaylistClicked.current}`}
                        onChange={(e)=>handlePlaylistNameInputChange(e)}
                        onKeyDown={(e)=>handlePlaylistNameInputSubmit(e)}
                    />
                </form>
            )
            playlistRef.current = tempArr
            setCreatePlaylistClicked(true)
            numCreatePlaylistClicked.current += 1
        }

        async function fetchPersonalPlaylist(username){
            await axios.get(`/.netlify/functions/getPlaylist/getAllPlaylists/?username=${username}`).then(res=>{
                const result = JSON.parse(res.data)
                let tempPlaylist = JSON.parse(result.body.body.body)
                let temparr = []
                tempPlaylist.forEach((playlist, i) =>{
                    temparr.push(
                        <SongAddPlaylistComponent 
                            playlistName={playlist.playlistName} 
                            songName={props.songName} 
                            artistName={props.artistName} 
                            playlistId={playlist.playlistId}
                            videoId={props.videoId}
                        />
                    )
                })
                
                temparr.push(
                <li className="playlist_item" onClick={(e) => handleCreatePlaylistClick(e)} key={temparr.length}>
                    <span>+ Create a new playlist...</span>
                </li>
            )
                setPlaylistItem(temparr)
                playlistRef.current = temparr;
                setFetch(true)
            }).catch(err => console.log(err))
        }
        
        if(!isFetch){
            fetchPersonalPlaylist("empty")
        }
        if(createPlaylistClicked){
            setPlaylistItem(playlistRef.current)
            setCreatePlaylistClicked(false)
        }

        if(successCreate !== -1){
            setPlaylistItem(playlistRef.current)
            setSuccessCreate(-1)
        }
    }, [isFetch, playlistItem, createPlaylistClicked, props.artistName, props.songName, props.videoId, successCreate])

    function handleButtonClick(e){
        const playlist = document.getElementsByClassName("song_add_playlist_container")[0]
        playlist.classList.toggle("song_add_playlist_container_show")
    }

    return(
        <div className="song_add_playlist_wrapper">
            <ToastContainer></ToastContainer>
            <div className="song_add_playlist_container">
                <ul className="song_add_playlist_list">
                    {playlistItem}
                </ul>
            </div>
            <Button className="song_add_playlist_button" onClick={(e)=>handleButtonClick(e)}>Add to playlist...</Button>
        </div>
    )
}

export default SongAddPlaylist;