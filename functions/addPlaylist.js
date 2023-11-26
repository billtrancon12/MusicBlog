const express = require("express");
const cors = require("cors");
const app = express();
const {MongoClient} = require('mongodb');
const {retrieveData, putData, updateData} = require('./database_tools');
const serverless = require('serverless-http')
const router = express.Router();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
require('dotenv').config();

// Configuration
app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

async function checkPlaylist(playlist, username){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const result = await retrieveData(client, "MusicBlogProject", "PersonalPlaylist", {playlistName: playlist.name, username: username})
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: result, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

async function createPlaylist(playlist, username){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const result = await putData(client, "MusicBlogProject", "PersonalPlaylist", 
        {
            playlistName: playlist.name,
            playlistId: playlist.id,
            username: username
        })
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: result, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

async function createPlaylistContent(playlist){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const result = await putData(client, "MusicBlogProject", "PersonalPlaylistContent", 
        {
            playlistName: playlist.name,
            playlistId: playlist.id,
            songs: []
        })
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: result, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

async function updatePlaylist(playlistName, playlistId, songs){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const result = await updateData(client, "MusicBlogProject", "PersonalPlaylistContent", {playlistName: playlistName, playlistId: playlistId}, {$set: {songs: songs}}, {upsert: true})
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: result, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}


router.post('/', async function(req, res){
    res.json(JSON.stringify({status: 200, body:""}))
})

router.post('/updatePlaylist', async function(req, res){
    const result = await updatePlaylist(req.body.playlistName, req.body.playlistId, req.body.songs)
    res.json(JSON.stringify({status: 200, body: result}))
})

router.post('/createPlaylist', async function(req, res){
    const isPlaylistExist = await checkPlaylist(req.body.playlist, req.body.username)
    if(isPlaylistExist.body.body !== 'null'){
        res.json(JSON.stringify({status: 400, body: "Playlist already existed"}))
        return;
    }

    const createPlaylistStatus = await createPlaylist(req.body.playlist, req.body.username)
    const createPlaylistContentStatus = await createPlaylistContent(req.body.playlist)
    if(!createPlaylistStatus.status || !createPlaylistContentStatus.status){
        res.json(JSON.stringify({status: 400, body: "Error in creating playlist!"}))
        return;
    }

    res.json(JSON.stringify({status: 200, body: "Created playlist successfully!"}))
})

app.use(`/.netlify/functions/addPlaylist`, router);

module.exports = app;
module.exports.handler = serverless(app);
