import React from "react";
const MoreButton = (props) => {
    return(
        <button 
            className={"explore_button " + props.className} 
            style={{
                "backgroundColor": "rgba(217, 217, 217, 0.35)", 
                "color": "red", 
                "boxShadow": "0px 4px 4px 0 rgba(0,0,0,.25)",
                "minWidth": "150px",
                "maxWidth": "200px",
                "padding": "10px 20px",
                "fontSize": "15px"
            }}
            onClick={props.onClick}
        >More</button>
    )
}

export default MoreButton;