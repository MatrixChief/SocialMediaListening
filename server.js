var express = require('express');
var app = express();
var port = 8080;
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var Twit = require('twit');
var Twit_config = require('./Config/Twit_config');
var T = new Twit(Twit_config);

var twitterSchema = new mongoose.Schema({
    username: String,
    post: String
});
var User = mongoose.model('Twitter',twitterSchema);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/SocialMediaListen");

app.use("/Public",express.static(__dirname+"/Public"));

app.post("/sendKeyword", (req, res) => {
    var keyword = req.query.key; // keyword for search
    var params = {
        q:keyword,
        lang:'en',
        count: 3
    }//params for search

    T.get('search/tweets', params, function(err, data, response) {
        if(err) throw err;
        else{
            console.log(data);
            for(var i in data.statuses){
                console.log("this is metadata: "+JSON.stringify(data.statuses[i].metadata));
            }
        };
    });
    res.send("Items saved to database!")
        // .then(item => {
        //     res.send("item saved to database");
        // })
        // .catch(err => {
        //     res.status(400).send("unable to save to database");
        // });
});

app.get("/twitterSearch", (req, res) => {
    res.sendFile(__dirname + "/View/twitterSearch.html");
});
app.get("/facebookSearch", (req,res) => {
    res.sendFile(__dirname + "/View/facebookSearch.html");
});
app.get("/chooseGetter", (req, res) => {
    res.sendFile(__dirname + "/View/chooseGetter.html");
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});



app.listen(port, () => {
    console.log("Server listening on port " + port);
});
