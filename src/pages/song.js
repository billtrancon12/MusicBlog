import React from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import SongWrapper from "../components/songWrapper";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingPage from "./loading";
import '../css/songWrapper.css'


const SongPage = () =>{
    const [videoSize, setVideoSize] = useState(window.innerWidth * 0.5)
    const [lyrics, setLyrics] = useState(<p>Not found!</p>)
    const [songURL, setSongURL] = useState("")
    const [isFetchedSong, setFetchSong] = useState(false)
    const [isFetchedLyrics, setFetchLyrics] = useState(false)
    const {songName} = useParams()
    const {authorName} = useParams()

    useEffect(()=>{
        const songNameBeforeParse = songName.split('+')
        let songNameAfterParse = ""
        songNameBeforeParse.forEach(str => songNameAfterParse += str + " ")
        songNameAfterParse = songNameAfterParse.slice(0, -1)

        const authorNameBeforeParse = authorName.split('+')
        let authorNameAfterParse = ""
        authorNameBeforeParse.forEach(str => authorNameAfterParse += str + " ")
        authorNameAfterParse = authorNameAfterParse.slice(0, -1)

        async function getSongURL(name){
            await axios.get(`/.netlify/functions/ytmusic_api/song/?name=${name}`).then(res =>{
                const response = JSON.parse(res.data)
                response.body.forEach(song => {
                    const artistName = song.artists[0].name
                    if(artistName.toLowerCase() === authorNameAfterParse.toLowerCase() && song.name.toLowerCase() === songNameAfterParse.toLowerCase()){
                        setSongURL(song.videoId)
                    }
                })
            }).catch(err => console.log(err))
            setFetchSong(true)
        }
        async function getSongLyrics(songName, authorName){
            await axios.get(`/.netlify/functions/ytmusic_api/lyrics/?songName=${songName}&authorName=${authorName}`).then(res =>{
                const response = JSON.parse(res.data)
                console.log(response)
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
        }

        if(!isFetchedSong && !isFetchedLyrics){
            getSongURL(songNameAfterParse + " " + authorNameAfterParse)
            getSongLyrics(songNameAfterParse, authorNameAfterParse)
        }
    }, [lyrics, songURL, isFetchedSong, isFetchedLyrics, songName, authorName])

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

    if(isFetchedSong && isFetchedLyrics){
        return (
            <div className="song_wrapper">
                <SongWrapper
                    url={songURL}
                    width={videoSize}
                    height={videoSize * 0.5}
                />
                <div className="lyrics_wrapper">
                    <h2>Lyrics</h2>
                    {lyrics}
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