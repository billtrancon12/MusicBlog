import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingPage from "./loading";
import '../css/top100.css'

const Top100 = () =>{
    const [isFetched, setFetch] = useState(false)
    const [top100, setTop100] = useState(null)

    useEffect(()=>{
        async function fetchData(){
            let songs;
            let tempArr = []
            await axios.get(`https://raw.githubusercontent.com/KoreanThinker/billboard-json/main/billboard-hot-100/recent.json`).then(response =>{
                songs = response.data.data
                setFetch(true)
            }).catch(err => console.log(err))
            
            songs.forEach((song, id) => {
                const songNameBeforeParse = song.name.split(' ')
                let songNameAfterParse = ""
                songNameBeforeParse.forEach(str => {
                    songNameAfterParse += str + "+"
                })
                songNameAfterParse = songNameAfterParse.slice(0, -1)

                const artistNameBeforeParse = song.artist.split(' ')
                let artistNameAfterParse = ""
                artistNameBeforeParse.forEach(str =>{
                    artistNameAfterParse += str + "+"
                })
                artistNameAfterParse = artistNameAfterParse.slice(0, -1)

                tempArr.push(
                    <li className="top100_item" key={id}>
                        <Link to={`/song/${songNameAfterParse}/${artistNameAfterParse}`}>
                            <div className="top100_song_wrapper">
                                <div className="top100_song_rank_wrapper">
                                    <span className="top100_song_rank">{song.rank}</span>
                                </div>
                                <div className="top100_song_thumbnail_wrapper">
                                    <img src={song.image} alt="top100_song_thumbnail" className="top100_song_thumbnail"></img>
                                </div>
                                <div className="top100_song_name_wrapper">
                                    <span className="top100_song_name">{song.name}</span>
                                </div>
                            </div>
                        </Link>
                    </li>
                )            
            })
            setTop100(tempArr)
        }

        if(!isFetched){
            fetchData()
        }
    })

    if(isFetched){
        return (
            <div className="top100_song_wrapper" style={{"textAlign": "center"}}>
                <ul className="top100_song_list">
                    <div className="top100_song_title_wrapper" style={{'textAlign': 'center'}}>
                        <h1 className="top100_song_cover">Billboard for this week!</h1>
                        <h3 className="top100_song_title">Top 100</h3>
                    </div>
                    {top100}
                </ul>
            </div>
        )
    }else{
        return(
            <LoadingPage></LoadingPage>
        )
    }
}

export default Top100;