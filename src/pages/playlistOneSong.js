import React from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import SongWrapper from "../components/songWrapper";
import { useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import LoadingPage from "./loading";
import ArtistWrapper from "../components/artistWrapper";
import RelatedSongWrapper from "../components/relatedSongsWrapper";
import '../css/songWrapper.css'
import SongAddPlaylist from "../components/songAddPlaylist";
import { useRef } from "react";


const PlaylistOneSong = () =>{
    const [videoSize, setVideoSize] = useState(window.innerWidth * 0.5)
    const [lyrics, setLyrics] = useState(<p>Not found!</p>)
    const [artist_name, setArtistName] = useState("")
    const [artist_thumbnail, setArtistThumbnail] = useState("")
    const [artistID, setArtistID] = useState("")
    const [isFetchedLyrics, setFetchLyrics] = useState(false)
    const [isFetchedArtist, setFetchArtist] = useState(false)
    const location = useLocation()
    const {videoId} = useParams()
    const {song} = (location.state === null) ? "" : location.state 
    const artistName = useRef((song !== "" && song !== undefined) ? song.artistName : "")
    const songName = useRef((song !== "" && song !== undefined) ? song.songName : "")
    
    function reload(){
        setFetchArtist(false)
        setFetchLyrics(false)
    }

    useEffect(()=>{
        async function getSongDetail(videoId){
            await axios.get(`/.netlify/functions/ytmusic_api/song/?videoId=${videoId}`).then(res=>{
                const response = JSON.parse(res.data)
                artistName.current = (response.body.artists !== null) ? response.body.artists[0].name : "N/A"
                songName.current = response.body.name
            }).catch(err => console.log(err))
        }
        async function getSongLyrics(songName, authorName){
            await axios.get(`/.netlify/functions/ytmusic_api/lyrics/?songName=${songName}&authorName=${authorName}`).then(res =>{
                const response = JSON.parse(res.data)
                if(response.status === 200){
                    const responseData = JSON.parse(response.body)
                    const lyrics = responseData.lyrics.lines;
                    const temp = [];
                    lyrics.forEach((el, id)=>{
                        const lyric = <p key={id}>{el.words}</p>
                        temp.push(lyric)
                    })
                    setLyrics(temp);
                }
                setFetchLyrics(true)
            }).catch(err => console.log(err))
            setFetchLyrics(true)
        }
        async function getArtist(name){
            await axios.get(`/.netlify/functions/ytmusic_api/artist/?name=${name}`).then(res =>{
                const response = JSON.parse(res.data)
                response.body.forEach(artist => {
                    if(artist.name.toLowerCase() === name.replace('+', ' ').toLowerCase()){
                        setArtistThumbnail(artist.thumbnails[0].url)
                        setArtistID(artist.artistId)
                        setArtistName(artist.name)
                    }
                })
            }).catch(err => console.log(err))
            setFetchArtist(true)
        }

        async function fetchSongWithoutState(videoId){
            await getSongDetail(videoId)
            getSongLyrics(songName.current.replace(' ', '+'), artistName.current.replace(' ', '+'))
            getArtist(artistName.current.replace(' ', '+'))
        }

        if(!isFetchedArtist && !isFetchedLyrics){
            if(song === "" || song === undefined){
                fetchSongWithoutState(videoId)
            }
            else{
                getSongLyrics(song.songName.replace(' ', '+'), song.artistName.replace(' ', '+'))
                getArtist(song.artistName.replace(' ', '+'))
            }
        }
    }, [lyrics, song, isFetchedLyrics, isFetchedArtist, videoId])

    useLayoutEffect(()=>{
        function handleResize(){
            if(window.innerWidth >= 1000)
                setVideoSize(window.innerWidth * 0.55)
            else if(window.innerWidth >= 800)
                setVideoSize(window.innerWidth * 0.65)
            else if(window.innerWidth >= 600)
                setVideoSize(window.innerWidth * 0.75)
            else
                setVideoSize(window.innerWidth * 0.9)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [videoSize])

    if(isFetchedArtist && isFetchedLyrics){
        return (
            <div className="song_content_wrapper">
                <h3 className="song_title">{songName.current}</h3>
                <SongWrapper
                    url={videoId}
                    width={videoSize}
                    height={videoSize * 0.5}
                    className="song_wrapper"
                />
                <div className="artist_playlist_wrapper">
                    <ArtistWrapper artistName={artist_name} src={artist_thumbnail} artistQuery={artistName.current}></ArtistWrapper>
                    <SongAddPlaylist artistName={artist_name} songName={songName.current} videoId={videoId}></SongAddPlaylist>
                </div>
                <div className="lyrics_wrapper">
                    <h2>Lyrics</h2>
                    {lyrics}
                </div>
                <div className="related_song">
                    <RelatedSongWrapper artistID={artistID} artistName={artistName.current} reload={reload} placeholder="You may also like..."></RelatedSongWrapper>
                </div>
            </div>
        )
    }
    else{
        return(
            <LoadingPage></LoadingPage>
        )
    }
}

export default PlaylistOneSong;