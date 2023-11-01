// const { getChart } = require('billboard-top-100');
const getChart = require('@katalonne/billboard-top-100')
const express = require("express");
const cors = require("cors");
const app = express();
const serverless = require('serverless-http')
const router = express.Router();

// getChart((err, chart) => {
//   if (err) console.log(err);
//   console.log(chart);
// });

// Configuration
app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


router.get('/top100', async function(req, res){
    res.json(JSON.stringify({status: 200, body: ""}))
})

app.use(`/.netlify/functions/billboard`, router);

module.exports = app;
module.exports.handler = serverless(app);