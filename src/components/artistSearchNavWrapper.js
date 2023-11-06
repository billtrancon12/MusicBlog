import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ArtistSearchNavWrapper = (props) =>{
    const [navItems, setNavItems] = useState(null)

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
        const artists = props.data
        let tempArr = []

        artists.forEach((artist, id)=>{
            const artistNameBeforeParse = artist.name.split(' ')
            let artistMatched = false
                        
            // Filter out the data, only show the matched query
            artistNameBeforeParse.forEach(key1 =>{
                const propsArtistName = props.artistName.split(' ')
                propsArtistName.forEach(key2 =>{
                    if(key1.toLowerCase() === key2.toLowerCase()) artistMatched = true
                })
            })
            
            // Just show all the results if the query is not in english
            artistMatched = (isEnglish(props.artistName.split(" ")) === false) ? true : artistMatched;
            if(artistMatched){
                const authorNameAfterParse = artist.name.replace(' ', '+')
                tempArr.push(
                    <li className="artist_search_nav_item" key={id}>
                        <Link to={`${authorNameAfterParse.toLowerCase()}/${artist.artistId}`}>
                            <div className="artist_search_nav_item_wrapper">
                                <img className="artist_search_nav_item_thumbnail" src={artist.thumbnails[0].url} alt="artist_thumbnail"></img>
                                <div className="artist_search_nav_item_name"><span>{artist.name}</span></div>                                
                            </div>
                        </Link>
                    </li>
                )
            }
        })
        setNavItems((tempArr.length === 0) ? 
            <li style={{"textAlign": "center", "width": "100%", "position": "relative"}}>
                <span className="artist_search_nav_no_result">No results found!</span>
            </li> 
        : tempArr)
    }, [props.data, props.artistName])

    return (
        <div className={"artist_search_nav_container" + props.className}>
            <ul className="artist_search_nav_list" style={{"listStyleType": "none", "padding": "0"}}>
                {navItems}
            </ul>
        </div>
    )
}

ArtistSearchNavWrapper.defaultProps = {
    className: ""
}

export default ArtistSearchNavWrapper;