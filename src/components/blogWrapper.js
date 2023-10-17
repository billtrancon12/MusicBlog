import React from "react";
import '../css/blogWrapper.css'
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";

function condenseText(text, maxLength){
    var tempText = text
    if(tempText === undefined) return
    text = ""
    for(let i = 0; i < maxLength && i < tempText.length; i++){
        text += tempText[i]
    }
    text += (tempText.length >= maxLength) ? "..." : ""
    return text
}


const BlogWrapper = (props) =>{
    const [isCondense, setCondense] = useState(false)
    const [condensedText, setCondensedText] = useState("")

    useLayoutEffect(()=>{
        function handleResize(){
            setCondense(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })
    useEffect(()=>{
        if(isCondense === false){
            let maxLength;
            let width = window.innerWidth
            if(width >= 1200) maxLength = width* 0.5
            else if(width >= 1000) maxLength = width* 0.4
            else if(width >= 800) maxLength = width * 0.3
            else if(width >= 600) maxLength = width * 0.25
            else if(width >= 500) maxLength = width * 0.2
            else maxLength = width * 0.3;

            let condensed = condenseText(props.content, maxLength)
            if(condensed.substring(condensed.length - 4, condensed.length) !== "</p>")
                condensed += "</p>"
            setCondensedText(condensed)
            setCondense(true)
        }
    }, [condensedText, isCondense, props.content])
    return(
        <React.StrictMode>
            <div className="blog_wrapper">
                <Link className="blog_content_wrapper" to={props.href}>
                    <div className="blog_img_wrapper">
                        <img src={props.src} className="blog_img" alt="header_wrapper"></img>
                    </div>
                    <div className="blog_content">
                        <h3 className="topic">{props.topic}</h3>
                        <div dangerouslySetInnerHTML={{"__html": `${condensedText}`}} className="summary_wrapper"></div>
                    </div>
                </Link>
            </div>
        </React.StrictMode>
    )
}

export default BlogWrapper;