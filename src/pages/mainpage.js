import React, { useRef } from "react";
import ExploreButton from "../components/exploreButton";
import RandomPlaylistButton from "../components/randomPlaylistButton";
import QuizButton from "../components/quizButton";
import { useEffect } from "react";
import BlogWrapper from "../components/blogWrapper";
import { useState } from "react";
import axios from "axios";
import "../css/homepage.css"
import MoreButton from "../components/moreButton";
import LoadingPage from "./loading";

const Homepage = () =>{
    const [blogs, setBlogs] = useState([])
    const [isFetch, setFetch] = useState(false)
    const [moreButton, setMoreButton] = useState("hide")
    const [loadFrom, setLoadFrom] = useState((sessionStorage.getItem('load from') === null) ? 0 : parseInt(sessionStorage.getItem("load from"), 10))
    const [loadEnd, setLoadEnd] = useState((sessionStorage.getItem("last fetched") === null) ? 2 : parseInt(sessionStorage.getItem("last fetched"), 10))
    const latestId = useRef((sessionStorage.getItem('max blogs') === null) ? 0 : sessionStorage.getItem('max blogs'))
    const blogsArr = useRef([])
    const BLOGS_SIZE = useRef(0)
    const [blogCount, setBlogCount] = useState(-1)

    useEffect(() => {
        // sessionStorage.clear()
        if(!isFetch && (sessionStorage.getItem("fetched") === null || sessionStorage.getItem('fetched') === 'null')){
            async function fetchData(){
                await axios.get(`/.netlify/functions/getBlog/blogs/?rangeFrom=${loadFrom}&rangeEnd=${loadEnd}`).then(async (res)=>{
                    const response = JSON.parse(res.data)
                    if(response.body === "Empty") return
                    let dataArr = response.message.body.data
                    latestId.current = response.message.body.latestId
                    BLOGS_SIZE.current = BLOGS_SIZE.current + loadEnd - loadFrom + 1

                    for(let i = 0; i < dataArr.length; i++){
                        const data = dataArr[i]
                        let imgData;
                    
                        axios.get(`/.netlify/functions/getBlog/images/?filename=${data.image}`).then((res)=>{
                            const result = JSON.parse(res.data)
                            imgData = result.image
                            const blog = 
                            <BlogWrapper
                                href={`/blog/${data.topic}`}
                                src={`data:image/png;base64,${imgData}`}
                                topic={data.topic}
                                content={data.content}
                                key={i}
                            ></BlogWrapper>
                            blogsArr.current.push(blog)
                            setBlogCount(blogsArr.current.length)
                        }).catch((err)=>console.log(err))

                        // const blog = 
                        // <BlogWrapper
                        //     href={`/blog/${data.topic}`}
                        //     src={`data:image/png;base64,${imgData}`}
                        //     topic={data.topic}
                        //     content={data.content}
                        //     key={i}
                        // ></BlogWrapper>
                        // blogsArr.push(blog)
                        // setBlogs(blogsArr)
                        // changeCount.current += 1
                    }
                    // // Get the cached database saved from previous fetched
                    // if(sessionStorage.getItem('fetched homepage') !== null){
                    //     const tempArrs = JSON.parse(sessionStorage.getItem('fetched homepage'))
                    //     const newFetchedBlogs = blogsArr.current
                    //     const arr = []
                    //     for(let i = 0; i < tempArrs.length; i++){ 
                    //         const blogData = tempArrs[i].props
                    //         arr.push(<BlogWrapper
                    //             href={blogData.href}
                    //             src={blogData.src}
                    //             topic={blogData.topic}
                    //             content={blogData.content}
                    //             key={i}
                    //     ></BlogWrapper>)
                    //     }
                    //     for(let i = 0; i < newFetchedBlogs.length; i++){
                    //         arr.push(newFetchedBlogs[i])
                    //     }
                    // }
                    // Store cached
                    // sessionStorage.setItem('fetched homepage', JSON.stringify(blogsArr.current))
                    // sessionStorage.setItem('last fetched', loadEnd)
                    // sessionStorage.setItem('load from', loadFrom)
                    // sessionStorage.setItem('fetched', true)
                }).catch((err)=>console.log(err))
            }
            fetchData()
            setFetch(true)
        } else if (!isFetch){
            // Get the cached data
            const tempArrs = JSON.parse(sessionStorage.getItem('fetched homepage'))
            const arr = []
            for(let i = 0; i < tempArrs.length; i++){ 
                const blogData = tempArrs[i].props
                arr.push(<BlogWrapper
                    href={blogData.href}
                    src={blogData.src}
                    topic={blogData.topic}
                    content={blogData.content}
                    key={i}
                ></BlogWrapper>)
            }
            setBlogs(arr)
            BLOGS_SIZE.current = arr.length
            blogsArr.current = arr
            setBlogCount(arr.length)
            setFetch(true)
            const maxBlogs = (sessionStorage.getItem('max blogs') === null) ? 0 : parseInt(sessionStorage.getItem('max blogs'))
            if(maxBlogs > arr.length - 1) {
                setMoreButton("display")
            }
            else setMoreButton('hide')
            sessionStorage.setItem('max blogs', maxBlogs)
        }

        if(isFetch && blogCount === BLOGS_SIZE.current){
            sessionStorage.setItem('fetched homepage', JSON.stringify(blogsArr.current))
            sessionStorage.setItem('last fetched', loadEnd)
            sessionStorage.setItem('load from', loadFrom)
            sessionStorage.setItem('fetched', true)
            sessionStorage.setItem('max blogs', latestId.current)
            if(latestId.current > blogsArr.current.length - 1) setMoreButton("display")
            else setMoreButton("hide")
            setBlogs(blogsArr.current)
        }
    }, [isFetch, loadEnd, loadFrom, blogCount, blogs])
    
    if(!isFetch || blogCount !== BLOGS_SIZE.current){
        return(
            <LoadingPage></LoadingPage>
        )
    }
    else{
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
}

export default Homepage;