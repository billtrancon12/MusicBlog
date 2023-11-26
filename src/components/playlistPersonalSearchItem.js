import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import '../css/playlistPersonalSearch.css'

const PlaylistPersonalSearchItem = (props) => {
    return(
        <li className="playlist_personal_search_item_wrapper" onClick={(e) => props.onClick(e)} value={props.playlistName}>
            <div className="playlist_personal_search_item" value={props.playlistName}>
                <div className="playlist_personal_icon" value={props.playlistName}>
                    <PlaylistPlayIcon style={{'width': '100%', 'height': '40px'}} value={props.playlistName}></PlaylistPlayIcon>
                </div>
                <div className='playlist_personal_search_item_content' value={props.playlistName}>
                    <div className='playlist_personal_search_item_name' value={props.playlistName}>{props.playlistName}</div>
                    <div className='playlist_personal_search_item_count' value={props.playlistName}>{props.songs.length} song{(props.songs.length > 1) ? "s" : ""}</div>
                </div>
            </div>
        </li>
    )
}

export default PlaylistPersonalSearchItem;