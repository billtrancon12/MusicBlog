import ReactPlayer from "react-player"

const PlaylistWrapper = (props) =>{
    return(
        <div style={{
            "textAlign": "center", 
            "width": "100%", 
            "display": "flex", 
            "justifyContent": "center", 
            "alignItems": "center",
            "margin": "15px 0px 0px"}}>
            <ReactPlayer
                url={`https://www.youtube.com/playlist?list=${props.url}`}
                playing={true}
                width={props.width}
                height={props.height}
                controls={true}
            />
        </div>
    )
}

export default PlaylistWrapper;