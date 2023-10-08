import React from "react";
import ExploreButton from "../components/exploreButton";
import RandomPlaylistButton from "../components/randomPlaylistButton";
import QuizButton from "../components/quizButton";
import { useEffect } from "react";
import BlogWrapper from "../components/blogWrapper";
import { useState } from "react";
import axios from "axios";
import { Buffer } from 'buffer';
import "../css/homepage.css"
import '../css/media.css'

const Homepage = () =>{
    const [blogs, setBlogs] = useState(null)
    const [isFetch, setFetch] = useState(false)
    useEffect(() => {
        if(!isFetch){
            async function fetchData(){
                await axios.get('http://localhost:4001/blogs').then(async (res)=>{
                    const response = JSON.parse(res.data)
                    let blogsArr = []
                    let dataArr = JSON.parse(response.message.body)

                    for(let i = 0; i < dataArr.length; i++){
                        const data = dataArr[i]
                        let imgData;
                    
                        await axios.get(`http://localhost:4000/files/?filename=${data.image}`, {responseType: "arraybuffer"}).then((res)=>{
                            imgData = Buffer.from(res.data, 'binary').toString('base64')
                        }).catch((err)=>console.log(err))

                        const blog = 
                        <BlogWrapper
                            href={`http://localhost:3000/blog/?topic=${data.topic}`}
                            src={`data:image/png;base64,${imgData}`}
                            topic={data.topic}
                            content={data.content}
                            key={i}
                        ></BlogWrapper>
                        blogsArr.push(blog)
                    }
                    setBlogs(blogsArr)
                }).catch((err)=>console.log(err))
            }
            fetchData()
            setFetch(true)
        }
    }, [isFetch])

    return(
        <div style={{"textAlign": "center"}}>
            <h1 style={{}}>Let's emerge and enjoy in music world today!</h1>
            <h2>Homepage</h2>
            <div className="homepage_button_wrapper">
                <ExploreButton></ExploreButton>
                <RandomPlaylistButton></RandomPlaylistButton>
                <QuizButton></QuizButton>
            </div>
            <h2 style={{"margin": "25px 5px"}}>News</h2>
            {blogs}
        </div>
    )
}

export default Homepage;