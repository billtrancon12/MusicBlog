const express = require("express");
const cors = require("cors");
const app = express();
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose')
const {retrieveData, retrieveMultiData} = require('./database_tools');
const serverless = require('serverless-http')
const router = express.Router();
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
require('dotenv').config();

const conn = mongoose.createConnection(`mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/MusicBlogProject`)
let gfs, gridfsBucket;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
});

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

async function getBlogBasedOnTopic(topic){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const result = await retrieveData(client, "MusicBlogProject", "BlogContent", {topic: topic}); 
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: result.body, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

async function getBlogs(rangeFrom, rangeEnd){
    const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.liou3p7.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri);   // Create a client end-point
    
    try{
        await client.connect();
        const arr = [];
        for(let i = rangeFrom; i <= rangeEnd; i++){
            arr.push(i)
        }
        const result = await retrieveMultiData(client, "MusicBlogProject", "BlogContent", {"id": {"$in": arr}});
        const latestId = await retrieveData(client, "MusicBlogProject", "NumberBlogs");
        const resultData = JSON.parse(result.body)
        const latestIdData = JSON.parse(latestId.body)
        const multiData = {
            data: resultData,
            latestId: latestIdData.latestId
        }
        // console.log(JSON.parse(latestId.body).latestId)
        await client.close();
        return JSON.parse(JSON.stringify({status: true, body: multiData, message: "Success!"}));
    }
    catch(err){
        console.error(err);
        return undefined;
    }
}

router.get('/blogs', async function(req, res){
    const result = await getBlogs(parseInt(req.query.rangeFrom, 10), parseInt(req.query.rangeEnd, 10))
    if(req.query.rangeFrom <= result.body.latestId)
        res.json(JSON.stringify({status: true, message: result}))
    else
        res.json(JSON.stringify({status: true, body: "Empty"}))
})

router.get('/blog', async function(req, res){
    const result = await getBlogBasedOnTopic(req.query.topic) // Get the blog
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(1500)
    const image_filename = JSON.parse(result.body).image
    const resultImage = await gfs.files.findOne({ filename: image_filename})
    const readStream = await gridfsBucket.openDownloadStream(resultImage._id);
    const bufs = [];
    readStream.on('data', function (chunk) {
        bufs.push(chunk);
    });
    readStream.on('end', function () {
        const fbuf = Buffer.concat(bufs);
        const base64 = fbuf.toString('base64');
        res.json(JSON.stringify({status: true, image: base64, body: result.body}))
    });
    // res.json(JSON.stringify({status: true, message: result}))
})


router.get('/images/', async function(req, res){
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(1500)
    const result = await gfs.files.findOne({ filename: req.query.filename })
    const readStream = await gridfsBucket.openDownloadStream(result._id);
    // readStream.pipe(res);
    const bufs = [];
    readStream.on('data', function (chunk) {
        bufs.push(chunk);
    });
    readStream.on('end', function () {
        const fbuf = Buffer.concat(bufs);
        const base64 = fbuf.toString('base64');
        res.json(JSON.stringify({image: base64}))
    });
});

app.use(`/.netlify/functions/getBlog`, router);

module.exports = app;
module.exports.handler = serverless(app);

// app.listen(4001);
