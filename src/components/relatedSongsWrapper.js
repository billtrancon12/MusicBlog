import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import '../css/relatedSongs.css'

const RelatedSongWrapper = (props) =>{
    const [isFetched, setFetch] = useState(false)
    const [relatedSongs, setRelatedSongs] = useState(null)
    const [swipeIndex, setSwipeIndex] = useState(0)
    const [isSwipe, setIsSwipe] = useState(false)
    const xStart = useRef(0)
    const yStart = useRef(0)
    const xEnd = useRef(0)
    const yEnd = useRef(0)
    const isTransition = useRef(false)
    const listSize = useRef(0)

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleTouchStart(e){
        if(listSize.current !== 0 && window.innerWidth < listSize.current * 120){
            // setXStart(e.changedTouches[0].clientX)
            // setYStart(e.changedTouches[0].clientY)
            xStart.current = e.changedTouches[0].clientX
            yStart.current = e.changedTouches[0].clientY
        }
    }

    function handleTouchEnd(e){
        if(listSize.current !== 0 && window.innerWidth < listSize.current * 120){
            // setXEnd(e.changedTouches[0].clientX)
            // setYEnd(e.changedTouches[0].clientY)
            xEnd.current = e.changedTouches[0].clientX
            yEnd.current = e.changedTouches[0].clientY
            setIsSwipe(true)
        }
    }

    useEffect(()=>{
        function handleSwipe(){
            // Swipe right
            if(Math.abs(yStart.current - yEnd.current) < 100 && xStart.current - xEnd.current < 0 && !isTransition.current){
                const list = document.getElementsByClassName('related_song_item')
                if(swipeIndex !== 0){
                    Array.prototype.forEach.call(list, function(el){
                        el.classList.toggle("swipe_right")
                        isTransition.current = true
                        el.style.transform = `translateX(${120*(swipeIndex + 1)}px)`
                        sleep(500).then(()=>{
                            el.classList.toggle("swipe_right")
                            isTransition.current = false
                        })                
                    })
                    setSwipeIndex(swipeIndex + 1)
                }
            }
            // Swipe left
            if(Math.abs(yStart.current - yEnd.current) < 100 && xStart.current - xEnd.current > 0 && !isTransition.current){
                const list = document.getElementsByClassName('related_song_item')
                if(Math.abs(swipeIndex) !== list.length - 1){
                    Array.prototype.forEach.call(list, function(el, id){
                        el.classList.toggle("swipe_left")
                        isTransition.current = true
                        el.style.transform = `translateX(${120*(swipeIndex - 1)}px)`
                        sleep(500).then(()=>{
                            el.classList.toggle("swipe_left")
                            isTransition.current = false
                        })
                    })
                  setSwipeIndex(swipeIndex - 1)
                }
            }
        }
        async function getArtist(name){
            await axios.get(`/.netlify/functions/ytmusic_api/relatedSong/?name=${name}`).then(res =>{
                const response = JSON.parse(res.data)
                const listSongs = response.body
                let tempArr = []

                listSongs.forEach((song, id) =>{
                    let songNameBeforeParse = song.name.split(" ")
                    let songNameAfterParse = ""
                    songNameBeforeParse.forEach(str =>{
                        songNameAfterParse += str + "+"
                    })
                    songNameAfterParse = songNameAfterParse.slice(0, -1).toLowerCase()
                    tempArr.push(
                        <li key={id} className='related_song_item'  id={id} onTouchStart={(e)=>handleTouchStart(e)} onTouchEnd={(e) => handleTouchEnd(e)}>
                            <Link to={`/song/${songNameAfterParse}/${props.artistName}`}>
                                <div className="related_song_item_wrapper">
                                    <div className="related_song_item_thumbnail_wrapper">
                                        <img src={song.thumbnails[0].url} alt={"related_song_thumbnail"} className="related_song_thumbnail"></img>
                                    </div>
                                    <div className="related_song_title_wrapper">
                                        <span className="related_song_title">{song.name}</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    )
                    listSize.current = tempArr.length
                })

                setRelatedSongs(tempArr)
            }).catch(err => console.log(err))
            setFetch(true)
        }

        if(!isFetched){
            getArtist(props.artistID)
        }

        if(isSwipe)
            handleSwipe()
        
        setIsSwipe(false)
    }, [isFetched, props.artistID, props.artistName, swipeIndex, isSwipe])


    return(
        <div className="related_song_wrapper">
            <div className="related_song_heading_wrapper">
                <h3 className="related_song_heading">{props.placeholder} ({(relatedSongs !== null) ? relatedSongs.length : 0})</h3>
            </div>
            <div className="related_song_content_wrapper">
                <ul className="related_song_list">
                    {relatedSongs}
                </ul>
            </div>
        </div>
    )
}

export default RelatedSongWrapper;