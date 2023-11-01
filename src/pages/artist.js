import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "./loading";
import '../css/artist.css'
import RelatedSongWrapper from "../components/relatedSongsWrapper";

const ArtistPage = () =>{
    const [isFetchedBiography, setFetchBioGraphy] = useState(false)
    const [isFetchedThumbnail, setFetchThumbnail] = useState(false)
    const [thumbnailURL, setThumbnailURL] = useState(null)
    const [name, setName] = useState("")
    const [bio, setBio] = useState("")
    const [id, setId] = useState("")
    const {artistId} = useParams()
    const {artistName} = useParams()

    useEffect(()=>{
        async function fetchBiography(artistName){
            console.log(`http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artistName}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json`)
            await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artistName}&api_key=${process.env.REACT_APP_LAST_FM_API_KEY}&format=json`).then(response =>{
                setBio(response.data.artist.bio.summary)
                setFetchBioGraphy(true)
            }).catch(err => console.log(err))
        }

        async function fetchThumbnails(artistName, artistId){
            await axios.get(`/.netlify/functions/ytmusic_api/artistFull/?name=${artistName}&id=${artistId}`).then(response =>{
                const res = JSON.parse(response.data)
                let current_largest_url = ""
                let largest_thumbnail = 0
                const thumbnails = res.body.thumbnails
                
                thumbnails.forEach(thumbnail =>{
                    if(largest_thumbnail === 0 || (thumbnail.width > largest_thumbnail && window.innerWidth >= thumbnail.width)){
                        largest_thumbnail = thumbnail.width
                        current_largest_url = thumbnail.url
                    }
                })
                setThumbnailURL(current_largest_url)
                setName(res.body.name)
                setId(res.body.artistId)
                setFetchThumbnail(true)
            }).catch(err => console(err))
        }
        if(!isFetchedBiography && !isFetchedThumbnail){
            fetchBiography(artistName)
            fetchThumbnails(artistName, artistId)
        }
    })

    if(isFetchedThumbnail && isFetchedBiography){
        return (
            <div className="artist_page_wrapper">
                <div className="artist_page_content">
                    <div className="artist_page_thumbnail_wrapper">
                        <img src={thumbnailURL} alt='artist_thumbnail' className="artist_page_thumbnail"></img>  
                    </div>
                </div>
                <div className="artist_page_name_wrapper">
                    <h2 className="artist_page_name">{name}</h2>
                </div>
                <div className="artist_page_bio_wrapper" dangerouslySetInnerHTML={{"__html": bio}}></div>
                <RelatedSongWrapper artistID={(artistId === undefined) ? id : artistId} artistName={name} placeholder="Songs"></RelatedSongWrapper>
            </div>
        )
    }
    else{
        return(
            <LoadingPage></LoadingPage>
        )
    }
}

export default ArtistPage;