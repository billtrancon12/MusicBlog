import React from "react";

const ExploreButton = () =>{

    return(
        <React.StrictMode>
            <button className="explore_button" style={{
                "backgroundColor": "#AC5648", 
                "color": "white", 
                "boxShadow": "0px 4px 4px 0 rgba(0,0,0,.25)",
                "minWidth": "150px",
                "maxWidth": "200px",
                "padding": "10px 20px"}}>Explore!</button>
        </React.StrictMode>
    )
}

export default ExploreButton;