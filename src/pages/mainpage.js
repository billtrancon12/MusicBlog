import React from "react";
import ExploreButton from "../components/exploreButton";
import RandomPlaylistButton from "../components/randomPlaylistButton";
import QuizButton from "../components/quizButton";
import { useEffect } from "react";
import BlogWrapper from "../components/blogWrapper";
import { useState } from "react";
import axios from "axios";
import "../css/homepage.css"
import MoreButton from "../components/moreButton";

const Homepage = () =>{
    const [blogs, setBlogs] = useState([])
    const [isFetch, setFetch] = useState(false)
    const [moreButton, setMoreButton] = useState("hide")
    const [loadFrom, setLoadFrom] = useState((sessionStorage.getItem('load from') === null) ? 0 : parseInt(sessionStorage.getItem("load from"), 10))
    const [loadEnd, setLoadEnd] = useState((sessionStorage.getItem("last fetched") === null) ? 2 : parseInt(sessionStorage.getItem("last fetched"), 10))
    useEffect(() => {
        // sessionStorage.clear()
        if(!isFetch && (sessionStorage.getItem("fetched") === null || sessionStorage.getItem('fetched') === 'null')){
            async function fetchData(){
                await axios.get(`/.netlify/functions/getBlog/blogs/?rangeFrom=${loadFrom}&rangeEnd=${loadEnd}`).then(async (res)=>{
                    const response = JSON.parse(res.data)
                    let blogsArr = []
                    if(response.body === "Empty") return
                    let dataArr = response.message.body.data
                    let latestId = response.message.body.latestId

                    for(let i = 0; i < dataArr.length; i++){
                        const data = dataArr[i]
                        let imgData;
                    
                        await axios.get(`/.netlify/functions/getBlog/images/?filename=${data.image}`).then((res)=>{
                            const result = JSON.parse(res.data)
                            imgData = result.image
                        }).catch((err)=>console.log(err))

                        const blog = 
                        <BlogWrapper
                            href={`/blog/${data.topic}`}
                            src={`data:image/png;base64,${imgData}`}
                            topic={data.topic}
                            content={data.content}
                            key={i}
                        ></BlogWrapper>
                        blogsArr.push(blog)
                        setBlogs(blogsArr)
                    }
                    // Get the cached database saved from previous fetched
                    if(sessionStorage.getItem('fetched homepage') !== null){
                        const tempArrs = JSON.parse(sessionStorage.getItem('fetched homepage'))
                        const newFetchedBlogs = blogsArr
                        blogsArr = []
                        for(let i = 0; i < tempArrs.length; i++){ 
                            const blogData = tempArrs[i].props
                            blogsArr.push(<BlogWrapper
                                href={blogData.href}
                                src={blogData.src}
                                topic={blogData.topic}
                                content={blogData.content}
                                key={i}
                        ></BlogWrapper>)
                        }
                        for(let i = 0; i < newFetchedBlogs.length; i++){
                            blogsArr.push(newFetchedBlogs[i])
                        }
                    }
                    // Store cached
                    sessionStorage.setItem('fetched homepage', JSON.stringify(blogsArr))
                    sessionStorage.setItem('last fetched', loadEnd)
                    sessionStorage.setItem('load from', loadFrom)
                    sessionStorage.setItem('fetched', true)
                    sessionStorage.setItem('max blogs', latestId)
                    if(latestId > blogsArr.length - 1) setMoreButton("display")
                    else setMoreButton("hide")
                }).catch((err)=>console.log(err))
            }
            fetchData()
            setFetch(true)
        } else if (!isFetch){
            // Get the cached data
            const tempArrs = JSON.parse(sessionStorage.getItem('fetched homepage'))
            const blogsArr = []
            for(let i = 0; i < tempArrs.length; i++){ 
                const blogData = tempArrs[i].props
                blogsArr.push(<BlogWrapper
                    href={blogData.href}
                    src={blogData.src}
                    topic={blogData.topic}
                    content={blogData.content}
                    key={i}
                ></BlogWrapper>)
            }
            setBlogs(blogsArr)
            const maxBlogs = (sessionStorage.getItem('max blogs') === null) ? 0 : parseInt(sessionStorage.getItem('max blogs'))
            if(maxBlogs > blogsArr.length - 1) setMoreButton("display")
            else setMoreButton('hide')
        }
    }, [isFetch, loadEnd, loadFrom])
    
    return(
        <div style={{"textAlign": "center"}}>
            <h1 style={{}}>Let's emerge and enjoy in music world today!</h1>
            <h2>Homepage</h2>
            <div className="homepage_button_wrapper">
                <ExploreButton onClick={()=>console.log(1)}></ExploreButton>
                <RandomPlaylistButton></RandomPlaylistButton>
                <QuizButton></QuizButton>
            </div>
            <h2 style={{"margin": "25px 5px"}}>News</h2>
            {blogs}
            <MoreButton className={`${moreButton}`} onClick={()=>{
                setLoadFrom(loadEnd + 1)
                setLoadEnd(loadEnd + 3)
                sessionStorage.setItem('fetched', null)
                setFetch(false)
            }}></MoreButton>
        </div>
    )
}

export default Homepage;