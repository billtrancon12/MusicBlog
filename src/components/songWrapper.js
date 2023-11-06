import ReactPlayer from "react-player"

const SongWrapper = (props) =>{
    return(
        <div className={props.className}>
            <ReactPlayer
                url={`https://www.youtube.com/watch?v=${props.url}`}
                playing={true}
                width={props.width}
                height={props.height}
                controls={true}
                onEnded={props.onEnded}
            />
        </div>
    )
}

export default SongWrapper;