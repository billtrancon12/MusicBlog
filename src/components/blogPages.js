import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import LoadingPage from "../pages/loading";
import "../css/blogPage.css"

async function fetchData(href){
    let ret;
    await axios.get(href).then((response) => {
        const res = JSON.parse(response.data)
        const blogData = JSON.parse(res.body)
        ret = {
            image: res.image,
            topic: blogData.topic,
            content: blogData.content,
        }
    }).catch((err) => console.log(err))
    return ret;
}


const BlogPage = () => {
    const [isFetched, setFetched] = useState(false)
    const [blogData, setBlogData] = useState(null)

    useEffect(()=> async function(){
        const blogTopic = window.location.href.split('/')[4]
        if(!isFetched && sessionStorage.getItem("blog " + blogTopic) === null){
            const data = await fetchData(`/.netlify/functions/getBlog/blog/?topic=${blogTopic}`)
            // Save cached data
            sessionStorage.setItem("blog " + blogTopic, JSON.stringify(data)) 
            setBlogData(data)
            setFetched(true)        
        }
        // Get the cached data
        else if(!isFetched){
            const data = sessionStorage.getItem("blog " + blogTopic)
            const parseData = JSON.parse(data)
            setBlogData(parseData)
            setFetched(true)
        }
    }, [isFetched, blogData])
    
    if(isFetched){
        return(
            <div className="blog_page_wrapper">
                <div className="blog_page_image_header_wrapper">
                    <img src={`data:image/png;base64,${blogData.image}`} alt="blog_header_img" className="blog_header_img"></img>
                </div>
                <div className="blog_page_content_wrapper">
                    <h2 className="blog_page_content_heading">{blogData.topic}</h2>
                    <div className="blog_page_content_wrapper" dangerouslySetInnerHTML={{"__html": blogData.content}}></div>
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

export default BlogPage;