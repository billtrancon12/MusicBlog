import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const PlaylistSearchNavWrapper = (props) =>{
    const [navItems, setNavItems] = useState(null)

    function isEnglish(keys){
        let ret = true
        keys.forEach(key =>{
            if(key !== ""){
                for(let i = 0; i < key.length; i++){
                    if(!Number.isInteger(key[i]) && !(key[i] >= "a" && key[i] <= "z") && !(key[i] >= "A" && key[i] <= "Z")){
                        ret = false
                        break
                    }
                }
            }
        })
        return ret
    }
    
    useEffect(()=>{
        const playlists = props.data
        let tempArr = []

        playlists.forEach((playlist, id)=>{
            const playlistNameBeforeParse = playlist.name.split(' ')
            let playlistMatched = false
                        
            // Filter out the data, only show the matched query
            playlistNameBeforeParse.forEach(key =>{
                let playlistName = props.playlistName.split(' ')
                playlistName.forEach(name => {
                    if(key.toLowerCase() === name.toLowerCase()) playlistMatched = true
                })
            })
            
            // Just show all the results if the query is not in english
            playlistMatched = (isEnglish(props.playlistName.split(" ")) === false) ? true : playlistMatched;

            if(playlist.artist !== undefined && playlistMatched){
                const playlistId = playlist.playlistId
                tempArr.push(
                    <li className="playlist_search_nav_item" key={id}>
                        <Link to={`${playlistId}/0`}>
                            <div className="playlist_search_nav_item_wrapper">
                                <img className="playlist_search_nav_item_thumbnail" src={playlist.thumbnails[0].url} alt="playlist_thumbnail"></img>
                                <div className="playlist_search_nav_item_name"><span>{playlist.name}</span></div>
                                <div className="playlist_search_nav_item_artist"><span>{(playlist.artist === undefined) ? "" : playlist.artist.name}</span></div>                                
                            </div>
                        </Link>
                    </li>
                )
            }
        })
        setNavItems((tempArr.length === 0) ? 
            <li style={{"textAlign": "center", "width": "100%", "position": "relative"}}>
                <span className="playlist_search_nav_no_result">No results found!</span>
            </li> 
        : tempArr)
    }, [props.data, props.playlistName])

    return (
        <div className={"playlist_search_nav_container" + props.className}>
            <ul className="playlist_search_nav_list" style={{"listStyleType": "none", "padding": "0"}}>
                {navItems}
            </ul>
        </div>
    )
}

PlaylistSearchNavWrapper.defaultProps = {
    className: ""
}

export default PlaylistSearchNavWrapper;