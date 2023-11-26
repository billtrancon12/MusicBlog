import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SongAddPlaylistComponent = (props) => {
    const [isFetch, setFetch] = useState(false)
    const [songs, setSongs] = useState([])
    const [isUpdate, setUpdate] = useState(false)

    useEffect(()=>{
        async function fetchPlaylistContent(playlistName, playlistId){
            await axios.get(`/.netlify/functions/getPlaylist/getPlaylistContent/?playlistName=${playlistName}&playlistId=${playlistId}`).then(res=>{
                const response = JSON.parse(res.data)
                setSongs(JSON.parse(response.body.body.body).songs)
                setFetch(true)
            }).catch(err => console.log(err))
        }

        async function updatePlaylist(playlistName, playlistId, songs){
            await axios.post(`/.netlify/functions/addPlaylist/updatePlaylist`, {
                playlistId: playlistId,
                playlistName: playlistName,
                songs: songs
            }).then(res => {
                const response = JSON.parse(res.data)
                if(response.body.status === true){
                    toast('Update playlist successfully!', {
                        position: toast.POSITION.BOTTOM_LEFT
                    })
                }
                setUpdate(false)
            }).catch(err => console.log(err))
        }

        if(!isFetch){
            fetchPlaylistContent(props.playlistName, props.playlistId)
        }
        if(isUpdate) {
            updatePlaylist(props.playlistName, props.playlistId, songs)
        }
    }, [isUpdate, isFetch, props.playlistName, props.playlistId, songs])

    function isSongAdded(){
        for(let i = 0; i < songs.length; i++){
            let songName = songs[i].name
            let artistName = songs[i].artistName
            if(songName === props.songName.toLowerCase() && artistName === props.artistName.toLowerCase()) return true
        }
        return false
    }

    function handleCheckboxChange(e){
        if(e.target.value === "unchosen"){
            let tempArr = songs
            tempArr.push({
                name: props.songName.toLowerCase(),
                artistName: props.artistName.toLowerCase(),
                videoId: props.videoId
            })
            setSongs(tempArr)
            setUpdate(true)
        }
        else if(e.target.value === "chosen"){
            let tempArr = songs
            for(let i = 0; i < tempArr.length; i++){
                let songName = songs[i].name
                let artistName = songs[i].artistName
                if(songName === props.songName.toLowerCase() && artistName === props.artistName.toLowerCase()){
                    tempArr.splice(i, 1)
                }
            }
            setSongs(tempArr)
            setUpdate(true)
        }
    }

    if(isFetch){
        return(
            <li className="playlist_item">
                <input 
                    type="checkbox" 
                    value={(isSongAdded() ? "chosen" : "unchosen")} 
                    className="song_add_playlist_checkbox" 
                    checked={(isSongAdded()) ? true : false}
                    onChange={(e)=>handleCheckboxChange(e)}
                    disabled={(!isUpdate) ? false : true}
                    />
                <span className="song_add_playlist_name">{props.playlistName}</span>
            </li>
        )
    }
    else{
        return(
            <Box sx={{ 
                alignItems: "center", 
                width: "100%", 
                justifyContent:"center",
                zIndex: "2",
            }}>
              <CircularProgress />
            </Box>
        )
    }
}

export default SongAddPlaylistComponent;