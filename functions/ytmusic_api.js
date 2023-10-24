const express = require("express");
const cors = require("cors");
const app = express();
const serverless = require('serverless-http')
const router = express.Router();
const YTMusic = require('ytmusic-api').default;
const axios = require('axios');
require('dotenv').config()


// Configuration
app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


router.get('/song', async function(req, res){
    const ytmusic = await new YTMusic().initialize()
    let result;
    await ytmusic.searchSongs(decodeURI(req.query.name)).then(songs =>{
        result = songs;
    }).catch(err => console.log(err))
    res.json(JSON.stringify({status: 200, body: result}))   
})

router.get('/lyrics', async function(req, res){
    const tracksOptions = {
        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/search/',
        params: {
          q: decodeURI(req.query.songName + " " + req.query.authorName),
          type: 'tracks',
          offset: '0',
          limit: '20',
          numberOfTopResults: '5'
        },
        headers: {
          'X-RapidAPI-Key': process.env.SPOTIFY_API_KEY,
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
      };
    
    try {
        const response = await axios.request(tracksOptions);
        const songItems = response.data.tracks.items;
        let songID = "";
        songItems.forEach(item =>{
            const artists = item.data.artists.items
            let artistName = "";
            artists.forEach(artist => {
                if(decodeURI(artist.profile.name).toLowerCase() === decodeURI(req.query.authorName).toLowerCase())
                    artistName = artist.profile.name
            })
            
            if(decodeURI(item.data.name).toLowerCase() === decodeURI(req.query.songName).toLowerCase() && decodeURI(req.query.authorName).toLowerCase() === decodeURI(artistName).toLowerCase())
                songID = item.data.id
            else if(decodeURI(item.data.name).toLowerCase() === decodeURI(req.query.songName).toLowerCase())
                songID = item.data.id
            console.log(item)
        })
        if(songID === "") songID = songItems[0].data.id
        try{
            const lyricsOptions = {
                method: 'GET',
                url: 'https://spotify23.p.rapidapi.com/track_lyrics/',
                params: {
                id: songID 
                },
                headers: {
                    'X-RapidAPI-Key': process.env.SPOTIFY_API_KEY,
                    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
                }
            };
            const lyricsResponse = await axios.request(lyricsOptions);
            res.json(JSON.stringify({status: 200, body: JSON.stringify(lyricsResponse.data)}))
        }
        catch(err){
            console.log(err)
            res.json(JSON.stringify({status: 400, msg: "Error in Spotify API!"}))
        }
    } catch (error) {
        console.error(error);
        res.json(JSON.stringify({status: 400, msg: "Error in Spotify API!"}))
    }
})

app.use(`/.netlify/functions/ytmusic_api`, router);

module.exports = app;
module.exports.handler = serverless(app);