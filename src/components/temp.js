const express = require('express')
const app = express()
const port = 3000


//https://www.googleapis.com/youtube/v3/search?key=AIzaSyD_wd2KvAfVBD4s4WJIelo205Vd-u-dDZI&part=snippet&format=json
app.get('/', (req, res)=>{
  res.send('')
})