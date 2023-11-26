const express = require("express");
const cors = require("cors");
const app = express();
const {MongoClient} = require('mongodb');
const {retrieveData, putData, retrieveMultiData} = require('./database_tools');
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

async function getPlaylist(playlistName, username){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const result = await retrieveData(client, "MusicBlogProject", "PersonalPlaylist", {playlistName: playlistName, username: username})
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: result, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

async function getPlaylistContent(playlistName, playlistId){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const result = await retrieveData(client, "MusicBlogProject", "PersonalPlaylistContent", {playlistName: playlistName, playlistId: playlistId})
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: result, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

async function getAllPlaylists(username){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const playlistResult = await retrieveMultiData(client, "MusicBlogProject", "PersonalPlaylist", {username: username})
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: playlistResult, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

router.get('/getPlaylistContent', async function(req, res){
    const result = await getPlaylistContent(req.query.playlistName, req.query.playlistId)
    res.json(JSON.stringify({status: 200, body: result}))
})

router.get('/getAllPlaylists', async function(req, res){
    const result = await getAllPlaylists(req.query.username)
    res.json(JSON.stringify({status: 200, body: result}))
})


app.use(`/.netlify/functions/getPlaylist`, router);

module.exports = app;
module.exports.handler = serverless(app);
