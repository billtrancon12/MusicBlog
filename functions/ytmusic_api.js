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
    const ytmusic = await new YTMusic().initialize("Cookie: __Secure-ROLLOUT_TOKEN=CKGhwtrkn6KgxwEQx-LVqojsiwMYv8fun9-zjQM%3D; VISITOR_INFO1_LIVE=1OfKGVdx9fU; VISITOR_PRIVACY_METADATA=CgJVUxIEGgAgGg%3D%3D; PREF=f6=80&tz=America.Chicago&f7=100&repeat=NONE; __Secure-1PSIDTS=sidts-CjEBjplskMvrziipPrULA4_IzT1ueGFUnYimnmgfVr955AVkWi8h5hgvVajiWLTR4tGjEAA; __Secure-3PSIDTS=sidts-CjEBjplskMvrziipPrULA4_IzT1ueGFUnYimnmgfVr955AVkWi8h5hgvVajiWLTR4tGjEAA; HSID=Ai8LiTpibJqebi776; SSID=A__wvLIkRm3Bh6FgD; APISID=ujILh1DFLDakdgNd/AhPXLOLerNokyNyna; SAPISID=BN-s40w9czWU70Ok/ARECZ3GEdt_rZw7qR; __Secure-1PAPISID=BN-s40w9czWU70Ok/ARECZ3GEdt_rZw7qR; __Secure-3PAPISID=BN-s40w9czWU70Ok/ARECZ3GEdt_rZw7qR; SID=g.a000xAipbAVsGGdl_CbZ1v-RI7qyMlDRnwdbY8Do9HKKikDv53the0CR0bzguEXZ9RRx02TN8gACgYKAeQSARUSFQHGX2MiWbBdGqlUOXaN93QRSsXQsxoVAUF8yKrWlxlwS2v6oL14q5EflMo60076; __Secure-1PSID=g.a000xAipbAVsGGdl_CbZ1v-RI7qyMlDRnwdbY8Do9HKKikDv53thg92Gtwckm2T_eyZN29OhrQACgYKAcASARUSFQHGX2MiJX84xO3Pc6Q_TpsTxEHLBRoVAUF8yKr5DyobytD2IYLLEIR7kvvK0076; __Secure-3PSID=g.a000xAipbAVsGGdl_CbZ1v-RI7qyMlDRnwdbY8Do9HKKikDv53thQd2l1xvdyhEaU_BE6RmnCQACgYKAR8SARUSFQHGX2MinfTiApvnmElutq2hDKAM9RoVAUF8yKqeujcN0JNySBTVt9CKkQsc0076; LOGIN_INFO=AFmmF2swRQIhALcwHwp72ub5bWw8d3tJBK5ZAfkMl3m1EwG3Ow9PKu81AiAEClCppEdc4GgvLS-RMMYt5lvzcer4rpXmvujITRdSLw:QUQ3MjNmeTNRZ1VqemtEZTVndjMwSTdUa2Z4M0g2N2RBclBxQVBOaUpmRmJLSDhIem5fZFdOWXBxa2hhMTBoUjJpM09GNDlvLWlQRk9uaHozOHhneVgwQmwwTTdPdmgxSUdRNWlOd1N2aWtieHA0ajhhQm9RdEhVb3FHVFN4ckhxcGctcS1uM3dlR19Hc29HZ1BnY25BN0N0bDNjdHdmd0ZB; SIDCC=AKEyXzV51DTkLxErQl7-qjpk1RxOdY_vY6ChHHqIeAiHrECCGcmnDJ7wJFXe18xjchjhLuyQaXo; __Secure-1PSIDCC=AKEyXzVrckxibRelvbHZBTRCpC0kz1OohqLkuTgAZCoIzpIphCLIHIhPemMGcVQYQrw7vgR2aO5O; __Secure-3PSIDCC=AKEyXzVvnNRB7DqDDEynNPosOqt41eiWyMbg4mPD2yCyuH0st6E9Gh8EXDJWoTnsqfSezsW7z4VL; _gcl_au=1.1.945672568.1746501497; _ga_5JSYX2Q357=GS2.1.s1746503906$o2$g0$t1746503906$j60$l0$h0; _ga=GA1.1.104646711.1746501497; YSC=3ayndeibS3c")
    let result;
    let error;
    
    if(req.query.videoId === undefined){
        await ytmusic.searchSongs(decodeURI(req.query.name)).then(songs =>{
            result = songs;
            error = 2;
        }).catch(err => {
            console.log(error);
            error = err.message;
        })
    }
    else{
        await ytmusic.getSong(req.query.videoId).then(song => {
            result = song
            error = 2;
        }).catch(err => {
            console.log(error);
            error = err.message;
        })
    }
    res.json(JSON.stringify({status: 200, body: result, error: error}))   
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
