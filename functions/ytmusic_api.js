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
    
    if(req.query.videoId === undefined){
        await ytmusic.searchSongs(decodeURI(req.query.name)).then(songs =>{
            result = songs;
        }).catch(err => console.log(err))
    }
    else{
        await ytmusic.getSong(req.query.videoId).then(song => {
            result = song
        }).catch(err => console.log(err))
    }
    res.json(JSON.stringify({status: 200, body: result}))   
})

router.get("/artist", async function(req, res){
    const ytmusic = await new YTMusic().initialize()
    let result;
    await ytmusic.searchArtists(decodeURI(req.query.name)).then(artist =>{
        result = artist
    }).catch(err => console.log(err))
    res.json(JSON.stringify({status: 200, body: result}))
})

router.get('/playlist', async function(req, res){
    const ytmusic = await new YTMusic().initialize()
    let result;
    await ytmusic.searchPlaylists(decodeURI(req.query.name)).then(songs =>{
        result = songs;
    }).catch(err => console.log(err))
    res.json(JSON.stringify({status: 200, body: result}))   
})

router.get("/artistFull", async function(req, res){
    const ytmusic = await new YTMusic().initialize()
    let result;
    let id;

    if(req.query.id === 'undefined'){
        await ytmusic.searchArtists(decodeURI(req.query.name)).then(artists =>{
            artists.forEach(artist =>{
                let artistName = req.query.name.replace(' ', '+')
                if(artist.name.replace(' ', '+').toLowerCase() === artistName.toLowerCase())
                    id = artist.artistId
            })
        }).catch(err => console.log(err))
    }
    await ytmusic.getArtist((req.query.id !== 'undefined') ? req.query.id : id).then(artist =>{
        result = artist
    }).catch(err => console.log(err))
    res.json(JSON.stringify({status: 200, body: result}))
})

router.get("/relatedSong", async function(req, res){
    const ytmusic = await new YTMusic().initialize()
    let result;
    await ytmusic.getArtist(decodeURI(req.query.name)).then(artist =>{
        result = artist.topSongs
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
        let found = false;
        songItems.forEach(item =>{
            const artists = item.data.artists.items
            let artistName = "";
            artists.forEach(artist => {
                if(decodeURI(artist.profile.name).toLowerCase() === decodeURI(req.query.authorName).toLowerCase())
                    artistName = artist.profile.name
            })
            
            if(decodeURI(item.data.name).toLowerCase() === decodeURI(req.query.songName).toLowerCase() && decodeURI(req.query.authorName).toLowerCase() === decodeURI(artistName).toLowerCase()){
                songID = item.data.id
                found = true;
            }
            // else if(!found && decodeURI(item.data.name).toLowerCase() === decodeURI(req.query.songName).toLowerCase())
            //     songID = item.data.id
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