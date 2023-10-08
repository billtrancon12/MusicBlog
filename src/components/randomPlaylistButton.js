import React from "react";

const RandomPlaylistButton = () =>{

    return(
        <React.StrictMode>
            <button className="explore_button" style={{
                "backgroundColor": "#DC906D", 
                "color": "white", 
                "boxShadow": "0px 4px 4px 0 rgba(0,0,0,.25)",
                "minWidth": "150px",
                "maxWidth": "200px",
                "padding": "10px 20px"}}>Random Playlist</button>
        </React.StrictMode>
    )
}

export default RandomPlaylistButton;