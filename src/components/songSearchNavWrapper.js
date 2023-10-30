import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SongSearchNavWrapper = (props) =>{
    const [navItems, setNavItems] = useState(null)

    function getMinutesAndSeconds(secs){
        let mins, remainder;
        mins = Math.floor(secs / 60)
        remainder = secs % 60;
        
        if(remainder >= 10)
            return mins + ":" + remainder
        return mins + ":0" + remainder
    }

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
        const songs = props.data
        let tempArr = []

        songs.forEach((song, id)=>{
            const songNameBeforeParse = song.name.split(' ')
            let songMatched = false
                        
            // Filter out the data, only show the matched query
            songNameBeforeParse.forEach(key =>{
                if(key.toLowerCase() === props.songName.toLowerCase()) songMatched = true
            })
            
            // Just show all the results if the query is not in english
            songMatched = (isEnglish(props.songName.split(" ")) === false) ? true : songMatched;

            let songNameAfterParse = ""
            songNameBeforeParse.forEach(str => songNameAfterParse += str + "+")
            songNameAfterParse = songNameAfterParse.slice(0, -1)
    
            if(song.artists[0] !== undefined && songMatched){
                const authorNameBeforeParse = song.artists[0].name.split(' ')
                let authorNameAfterParse = ""
                authorNameBeforeParse.forEach(str => authorNameAfterParse += str + "+")
                authorNameAfterParse = authorNameAfterParse.slice(0, -1)
                tempArr.push(
                    <li className="song_search_nav_item" key={id}>
                        <Link to={`${songNameAfterParse.toLowerCase()}/${authorNameAfterParse}`}>
                            <div className="song_search_nav_item_wrapper">
                                <img className="song_search_nav_item_thumbnail" src={song.thumbnails[0].url} alt="song_thumbnail"></img>
                                <div className="song_search_nav_item_name"><span>{song.name}</span></div>
                                <div className="song_search_nav_item_artist"><span>{(song.artists[0] === undefined) ? "" : song.artists[0].name}</span></div>                                
                                <div className="song_search_nav_item_duration"><span>{getMinutesAndSeconds(song.duration)}</span></div>
                            </div>
                        </Link>
                    </li>
                )
            }
        })
        setNavItems((tempArr.length === 0) ? 
            <li style={{"textAlign": "center", "width": "100%", "position": "relative"}}>
                <span className="song_search_nav_no_result">No results found!</span>
            </li> 
        : tempArr)
    }, [props.data, props.songName])

    return (
        <div className={"song_search_nav_container" + props.className}>
            <ul className="song_search_nav_list" style={{"listStyleType": "none", "padding": "0"}}>
                {navItems}
            </ul>
        </div>
    )
}

SongSearchNavWrapper.defaultProps = {
    className: ""
}

export default SongSearchNavWrapper;