import React, { useRef, useState } from 'react';
// import tinymce from 'tinymce/tinymce';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BlogEditor() {
  const editorRef = useRef(null);
  const [topic, setTopic] = useState("")
  const [file, setFile] = useState("")

  const handleSubmit = async function(e){
    e.preventDefault();

    if (editorRef.current) {
      let status;
      await axios.post('http://localhost:4000/check', {topic: topic}, {headers: {'Content-Type': 'application/json'}}).then((response)=>{
        const res = JSON.parse(response.data)
        status = res.status
        console.log(res)
        if(status === false) toast(res.message)
      })

      if(status === true){
        const formData = new FormData();
        formData.append("file_input", file)
        formData.append("topic", topic)
        formData.append("date", new Date())
        formData.append("content", editorRef.current.getContent())
        await axios.post('http://localhost:4000/upload/', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
          const res = JSON.parse(response.data)
          if(res.status) {
            window.alert("Success!")
            window.location.reload(false)
          }
        }).catch((err) => {console.log(err)})
      }

    // axios.get('http://localhost:4000/files/?filename=b6015e607275e28e0df7dc896e83a354.jpeg', {responseType: "arraybuffer"}).then((res)=>{
      //   let base64ImageString = Buffer.from(res.data, 'binary').toString('base64')
      //   setImage(<img src={`data:image/png;base64,${base64ImageString}`}></img>)
      // }).catch((err)=>console.log(err))
    }
  };

  return (
    <React.StrictMode>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div style={{"display": "flex", "margin": "10px 20px 0px"}}>
          <h4>Topic: </h4>
          <input 
            style={{"margin": "18px 20px", "width": "fit-content", "height": "80%", "fontSize": "15px"}} 
            placeholder='Enter your topic here' 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}></input>
        </div>
        <div style={{"display": "flex", "margin": "10px 20px 0px"}}>
          <h3>Blog Image: </h3>
          <input 
            type="file" 
            accept='.png, .jpeg, .jpg' 
            style={{"margin": "18px 20px", "width": "fit-content", "height": "80%", "fontSize": "15px"}} 
            placeholder='Enter your topic here'
            onChange={(e) => setFile(e.target.files[0])}
            id="file_input"
            name="file_input"></input>
        </div>
        <div style={{"margin": "10px 20px"}}>
          <h3>Write your blog here!</h3>
          <Editor
          apiKey={process.env.REACT_APP_TINY_KEY}
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue=""
          init={{
            height: 500,
            menubar: "insert | browse",
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
              'image'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            automatic_uploads: true,
            file_picker_types: "images",
          }}
          />
          <button type="submit">Submit</button>
        </div>
      </form>
      <ToastContainer></ToastContainer>
    </React.StrictMode>
  );
}
