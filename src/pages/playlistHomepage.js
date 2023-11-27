import { useState } from "react";
import PlaylistSearchPage from "./playlistSearch";
import PlaylistPersonalSearchPage from "./playlistPersonalSearch";
import { useEffect } from "react";
import '../css/playlistHomepage.css'

const PlaylistHomepage = () =>{
    const [isPersonal, setPersonal] = useState(true)
    
    useEffect(() =>{},[isPersonal])

    function handleMenuClick(e){
        if(e.target.childNodes[0].innerHTML === "My Playlist" || e.target.childNodes[0].data === "My Playlist"){
            setPersonal(true)
        }
        else if(e.target.childNodes[0].innerHTML === "Search Online Playlist" || e.target.childNodes[0].data === "Search Online Playlist"){
            setPersonal(false)
        }
    }

    return(
        <div className="playlist_homepage">
            <div className="playlist_menu_homepage_wrapper">
                <div className={`playlist_menu_personal_wrapper ${(isPersonal) ? "playlist_menu_homepage_chosen" : ""}`} onClick={(e)=>handleMenuClick(e)}>
                    <span className="playlist_menu_personal">My Playlist</span>
                </div>
                <div className={`playlist_menu_search_wrapper ${(isPersonal) ? "" : "playlist_menu_homepage_chosen"}`} onClick={(e)=>handleMenuClick(e)}>
                    <span className="playlist_menu_search">Search Online Playlist</span>
                </div>
            </div>
            {(isPersonal) ? <PlaylistPersonalSearchPage username={'empty'}></PlaylistPersonalSearchPage> : <PlaylistSearchPage></PlaylistSearchPage>}
        </div>
    )
}

export default PlaylistHomepage;