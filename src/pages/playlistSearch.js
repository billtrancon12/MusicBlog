import SearchBar from '../components/searchbar'
import PlaylistSearchNavWrapper from "../components/playlistSearchNavWrapper";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import "../css/playlistSearchPage.css"


const PlaylistSearchPage = () =>{
    const [isFetched, setFetch] = useState(true)
    const [num, setNum] = useState(0)
    const numChange = useRef(0)
    const [navSearch, setNavSearch] = useState("")
    const [querySearch, setQuerySearch] = useState("")

    useEffect(()=>{
        async function fetchData(){
            let tempNum =  numChange.current
            let data;
            // Delay to wait for user to finish typing
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
            await delay(700)

            // Check if the current query is the newest query
            if(tempNum === numChange.current){
                await axios.get(`/.netlify/functions/ytmusic_api/playlist/?name=${querySearch}`).then(res => {
                    const response = JSON.parse(res.data)
                    const playlists = response.body
                    data = playlists
                }).catch(err => console.log(err))
                setFetch(true)

                if(tempNum === numChange.current)
                    setNavSearch(<PlaylistSearchNavWrapper data={data} playlistName={querySearch}></PlaylistSearchNavWrapper>)
            }
        }
        
        if(!isFetched && querySearch !== ""){
            fetchData()
        }
        if(querySearch === "") setNavSearch("")
    }, [num, isFetched, querySearch])


    function handleChange(e){
        setQuerySearch(e.target.value)
        setFetch(false)
        setNavSearch(
            <p style={{ padding: 10, color: '#999', textAlign: 'center' }}>
                <CircularProgress size={20} style={{"margin": "0px 5px 0px"}}/> Loading...
            </p>
        )
        numChange.current = numChange.current + 1
        setNum(num + 1)
    }

    return(
        <div className="playlist_search_wrapper">
            <SearchBar className="search_bar_wrapper" onChange={(e) => handleChange(e)} placeholder="Search your playlist here"></SearchBar>
            <div className="playlist_search_nav_wrapper">
                {navSearch}
            </div>
        </div>
    )
}

export default PlaylistSearchPage;