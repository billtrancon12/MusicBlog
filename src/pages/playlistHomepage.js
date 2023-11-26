import { useState } from "react";
import PlaylistSearchPage from "./playlistSearch";
import PlaylistPersonalSearchPage from "./playlistPersonalSearch";
import { useEffect } from "react";

const PlaylistHomepage = () =>{
    const [isPersonal, setPersonal] = useState(true)
    
    useEffect(() =>{

        if(isPersonal){
            setPersonal(false)
        }
    },[isPersonal])

    if(!isPersonal){
        return (
            <PlaylistPersonalSearchPage username={"empty"}></PlaylistPersonalSearchPage>
        )
    }
    else{
        return(
            <PlaylistSearchPage></PlaylistSearchPage>
        )
    }
}

export default PlaylistHomepage;