var express = require('express');
var app = express();
var port = 8080;
var mongoose = require('mongoose');
var Twit = require('twit-promise');
var Twit_config = require('./Config/Twit_config');
var T = new Twit(Twit_config);
// var FB = require('facebook-node')

var twitterSchema = new mongoose.Schema({
    user_id: String,
    user_name: String,
    user_screenName: String,
    location: String,
    language: String,
    post: String,
    // raw_data: Mixed,
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
    var count = req.query.count;

    T.get('search/tweets', {q: keyword, count: count}, function(err, data, response) {
        if(err) throw err;
        else{
            // for(var i in data.statuses){
            //     if(data.statuses[i].truncated==true){
            //         console.log(data.statuses[i]);
            //     }
            // }
            // console.log(data.statuses);
            // res.send("Items saved!");
            for(var i in data.statuses){
                var params = {
                    user_id: data.statuses[i].user.id_str,
                    user_name: data.statuses[i].user.name,
                    user_screenName: data.statuses[i].user.screen_name,
                    location: data.statuses[i].user.location,
                    language: data.statuses[i].metadata.iso_language_code,
                    post: data.statuses[i].text
                };
                var myData=new TUser(params);
                myData.save()
                    .then(item => {
                        res.send("items saved!");
                    });
            };
        };
    });
});

app.post("/sendGetter",(req,res)=>{
    var platform = req.query.key;
    if(platform=="Twitter"){
        TUser.find({}, {_id: 0,user_id: 1, user_name: 1, location: 1, language: 1, post: 1}, function(err, result){
            if(err) throw err;
            res.send(result);
        })
    }
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
