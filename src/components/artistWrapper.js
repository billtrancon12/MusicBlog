import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { Link } from 'react-router-dom';
import "../css/artistWrapper.css"

const ArtistWrapper = (props) =>{
    return (
        <div className="artist_wrapper">
            <Link className='artist_link_wrapper' to={`/artist/${props.artistQuery}`} style={{"textDecoration": "none", "color": "black"}}>
                <div className="artist_thumbnail_wrapper">
                    <img src={props.src} alt="artist_thumbnail" className='artist_thumbnail'></img>
                </div>
                <div className="artist_name_wrapper">
                    <span className="artist_name">{props.artistName}</span>
                </div>
            </Link>
        </div>
    )
}

ArtistWrapper.defaultProps = {
    src: NotInterestedIcon,
    artistName: "",
    artistQuery: ""
}

export default ArtistWrapper;