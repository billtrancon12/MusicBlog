import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SongSearchNavWrapper = (props) =>{
    const [navItems, setNavItems] = useState(null)

    useEffect(()=>{
        const songs = props.data
        let tempArr = []

        songs.forEach((song, id)=>{
            const songNameBeforeParse = song.name.split(' ')
            let songNameAfterParse = ""
            songNameBeforeParse.forEach(str => songNameAfterParse += str + "+")
            songNameAfterParse = songNameAfterParse.slice(0, -1)
    
            let authorNameBeforeParse, authorNameAfterParse = "";
            if(song.artists[0] !== undefined){
                authorNameBeforeParse = song.artists[0].name.split(' ')
                authorNameAfterParse = ""
                authorNameBeforeParse.forEach(str => authorNameAfterParse += str + "+")
                authorNameAfterParse = authorNameAfterParse.slice(0, -1)
            }
            
            tempArr.push(
                <li className="song_search_nav_item" key={id}>
                    <Link to={`${songNameAfterParse.toLowerCase()}/${authorNameAfterParse}`}>
                        <div>
                            <img className="song_search_nav_item_thumbnail" src={song.thumbnails[0].url} alt="song_thumbnail"></img>
                            <span className="song_search_nav_item_name">{song.name}</span>
                            <span className="song_search_nav_item_duration">{song.duration}</span>
                            <span className="song_search_nav_item_artist">{authorNameAfterParse}</span>
                        </div>
                    </Link>
                </li>
            )
        })
        setNavItems(tempArr)
    }, [props.data])

    return (
        <div className={"song_search_nav_wrapper " + props.className}>
            <ul className="song_search_nav_list" style={{"listStyleType": "none"}}>
                {navItems}
            </ul>
        </div>
    )
}

export default SongSearchNavWrapper;