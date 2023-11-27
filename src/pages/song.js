import React from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import SongWrapper from "../components/songWrapper";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingPage from "./loading";
import ArtistWrapper from "../components/artistWrapper";
import RelatedSongWrapper from "../components/relatedSongsWrapper";
import '../css/songWrapper.css'
import SongAddPlaylist from "../components/songAddPlaylist";


const SongPage = () =>{
    const [videoSize, setVideoSize] = useState(window.innerWidth * 0.5)
    const [lyrics, setLyrics] = useState(<p>Not found!</p>)
    const [songURL, setSongURL] = useState("")
    const [song_name, setSongName] = useState("")
    const [songThumbnail, setSongThumbnail] = useState("")
    const [artist_name, setArtistName] = useState("")
    const [artist_thumbnail, setArtistThumbnail] = useState("")
    const [artistID, setArtistID] = useState("")
    const [isFetchedSong, setFetchSong] = useState(false)
    const [isFetchedLyrics, setFetchLyrics] = useState(false)
    const [isFetchedArtist, setFetchArtist] = useState(false)
    const {songName} = useParams()
    const {authorName} = useParams()

    
    function reload(){
        setFetchArtist(false)
        setFetchSong(false)
        setFetchLyrics(false)
    }

    useEffect(()=>{
        let songNameAfterParse = songName.replace('+', ' ')
        let authorNameAfterParse = authorName.replace('+', ' ')

        async function getSongURL(name){
            await axios.get(`/.netlify/functions/ytmusic_api/song/?name=${name}`).then(res =>{
                const response = JSON.parse(res.data)
                let found =  false
                response.body.forEach(song => {
                    if(song.artists[0] !== undefined){
                        const artistName = song.artists[0].name
                        if(artistName.toLowerCase() === authorNameAfterParse.toLowerCase() && song.name.toLowerCase() === songNameAfterParse.toLowerCase()){
                            setSongURL(song.videoId)
                            setSongName(song.name)
                            setSongThumbnail(song.thumbnails[0].url)
                            found =  true
                        }
                        else if(!found && artistName.toLowerCase() === authorNameAfterParse.toLowerCase()){
                            setSongURL(song.videoId)
                            setSongName(song.name)
                            setSongThumbnail(song.thumbnails[0].url)
                            found = true
                        }
                        else if(!found){
                            setSongURL(song.videoId)
                            setSongName(song.name)
                            setSongThumbnail(song.thumbnails[0].url)
                            found = true
                        }
                    }
                })
            }).catch(err => console.log(err))
            setFetchSong(true)
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
                    if(artist.name === authorNameAfterParse){
                        setArtistThumbnail(artist.thumbnails[0].url)
                        setArtistID(artist.artistId)
                        setArtistName(artist.name)
                    }
                })
            }).catch(err => console.log(err))
            setFetchArtist(true)
        }

        if(!isFetchedSong && !isFetchedArtist && !isFetchedLyrics){
            getSongURL(songNameAfterParse + " " + authorNameAfterParse)
            getSongLyrics(songNameAfterParse, authorNameAfterParse)
            getArtist(authorNameAfterParse)
        }
    }, [lyrics, songURL, isFetchedSong, isFetchedLyrics, isFetchedArtist, songName, authorName])

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

    if(isFetchedSong && isFetchedArtist && isFetchedLyrics){
        return (
            <div className="song_content_wrapper">
                <h3 className="song_title">{song_name}</h3>
                <SongWrapper
                    url={songURL}
                    width={videoSize}
                    height={videoSize * 0.5}
                    className="song_wrapper"
                />
                <div className="artist_playlist_wrapper">
                    <ArtistWrapper artistName={artist_name} src={artist_thumbnail} artistQuery={authorName}></ArtistWrapper>
                    <SongAddPlaylist artistName={artist_name.replace('+', ' ')} songName={songName.replace('+', ' ')} videoId={songURL} thumbnail={songThumbnail}></SongAddPlaylist>
                </div>
                <div className="lyrics_wrapper">
                    <h2>Lyrics</h2>
                    {lyrics}
                </div>
                <div className="related_song">
                    <RelatedSongWrapper artistID={artistID} artistName={authorName} reload={reload} placeholder="You may also like..."></RelatedSongWrapper>
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

export default SongPage;