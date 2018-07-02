var express = require('express');
var app = express();
var port = 8080;
var mongoose = require('mongoose');
var Twit = require('twit-promise');
var Twit_config = require('./Config/Twit_config');
var T = new Twit(Twit_config);

var twitterSchema = new mongoose.Schema({
    user_index: Number,
    user_id: String,
    user_name: String,
    user_screenName: String,
    location: String,
    language: String,
    post: String
});

var TUser= mongoose.model('Twitter', twitterSchema);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/SocialMediaListen");

app.use("/Public",express.static(__dirname+"/Public"));
////////////////////////////////////////////////////////////////////////////////

app.post("/sendKeywordT", (req, res) => {
    var keyword = req.query.key;
    var count = req.query.count;

    if(count>100 && count%100==0){
        for(var i=0; i<count/100; i++){
            T.get('search/tweets', {q: keyword, count: 100}, function(err, data, response) {
                if(err) throw err;
                else{
                    var j=0;
                    for(var i in data.statuses){
                        j++;
                        var params = {
                            user_index: j,
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
                                res.send("Items saved!");
                            });
                    };
                };
            });
        };
    }
    else if(count>100 && count%100!=0){
        for(var i=0; i<(count/100>>0); i++){
            T.get('search/tweets', {q: keyword, count: 100}, function(err, data, response) {
                if(err) throw err;
                else{
                    var j=0;
                    for(var i in data.statuses){
                        j++;
                        var params = {
                            user_index: j,
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
                                res.send("Items saved!");
                            });
                    };
                };
            });
        };
        T.get('search/tweets', {q: keyword, count: count%100}, function(err, data, response) {
            if(err) throw err;
            else{
                var j=0;
                for(var i in data.statuses){
                    j++;
                    var params = {
                        user_index: j,
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
                            res.send("Items saved!");
                        });
                };
            };
        });
    }
    else{
        T.get('search/tweets', {q: keyword, count: count}, function(err, data, response) {
            if(err) throw err;
            else{
                var j=0;
                for(var i in data.statuses){
                    j++;
                    var params = {
                        user_index: j,
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
                            res.send("Items saved!");
                        });
                };
            };
        });
    };
});

app.post("/sendGetter",(req,res)=>{
    TUser.find({}, {_id: 0,user_index: 1, user_id: 1, user_name: 1, location: 1, language: 1, post: 1}, function(err, result){
        if(err) throw err;
        res.send(result);
    }).sort({user_index: 1});
})
////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
