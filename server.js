var express = require('express');
var app = express();
var port = 8080;
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var Twit = require('twit');
var Twit_config = require('./Config/Twit_config');
var T = new Twit(Twit_config);

var twitterSchema = new mongoose.Schema({
    user_id: String,
    post: String
});
// var facebookSchema = new mongoose.Schema({
//     user_id: String,
//     post: String
// });
var TUser= mongoose.model('Twitter', twitterSchema);
// var FUser = mongoose.model('Facebook', facebookSchema);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/SocialMediaListen");

app.use("/Public",express.static(__dirname+"/Public"));
////////////////////////////////////////////////////////////////////////////////

app.post("/sendKeywordT", (req, res) => {
    var keyword = req.query.key;
    var params = {
        q:keyword,
        lang:'en',
        count: 100
    }
    var newUser = new Array();
    var newPost = new Array();

    T.get('search/tweets', params, function(err, data, response) {
        if(err) throw err;
        else{
            // console.log(data);
            for(var i in data.statuses){
                newUser.push(data.statuses[i].id_str);
                newPost.push(data.statuses[i].text);
            }
            for(var i=0; i<newUser.length; i++){
                var myData=new TUser({user_id: newUser[i], post: newPost[i]});
                myData.save()
                    .then(item => {
                        res.send("item saved to database");
                    });
            };
        };
    });
});

app.post("/sendGetter",(req,res)=>{
    var platform = req.query.key;
    if(platform=="Twitter"){
        TUser.find({}, {_id: 0,user_id: 1, post: 1}, function(err, result){
            if(err) throw err;
            res.send(result);
        })
    }
    // else{
    //
    // }
})
////////////////////////////////////////////////////////////////////////////////
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
