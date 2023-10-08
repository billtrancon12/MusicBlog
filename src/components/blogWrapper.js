import React from "react";
import '../css/blogWrapper.css'
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";

function condenseText(text, maxLength){
    var tempText = text
    text = ""
    for(let i = 0; i < maxLength && i < tempText.length; i++){
        text += tempText[i]
    }
    text += (tempText.length >= maxLength) ? "..." : ""
    return text
}


const BlogWrapper = (props) =>{
    const [isCondense, setCondense] = useState(false)
    const [textArr, setTextArr] = useState([])
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

            let tempArr = []
            let i = 0
            Array.from(document.querySelectorAll(".summary_wrapper")).forEach((el)=>{
                if(textArr[i] === undefined) {
                    tempArr.push(el.childNodes[0].innerHTML)
                    setTextArr(tempArr)
                }
                var tempText = (textArr[i] === undefined) ? tempArr[i] : textArr[i]
                console.log(tempText)
                el.childNodes[0].innerHTML = condenseText(tempText, maxLength)
                i++;
            })
            setCondense(true)
        }
    }, [isCondense, textArr])
    return(
        <React.StrictMode>
            <div className="blog_wrapper">
                <Link className="blog_content_wrapper" to={props.href}>
                    <div className="blog_img_wrapper">
                        <img src={props.src} className="blog_img" alt="header_wrapper"></img>
                    </div>
                    <div className="blog_content">
                        <h3 className="topic">{props.topic}</h3>
                        <div dangerouslySetInnerHTML={{"__html": props.content}} className="summary_wrapper"></div>
                    </div>
                </Link>
            </div>
        </React.StrictMode>
    )
}

export default BlogWrapper;