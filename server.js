var express = require('express');
var app = express();
var port = 8080;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Twit = require('twit-promise');
var Twit_config = require('./Config/Twit_config');
var T = new Twit(Twit_config);
//Mongo schema for twitter data capped at 10000 documents, size= 10000 X 16 X 1024 X 1024 bytes
var twitterSchema = new mongoose.Schema({
    query_id: String,
    trackables: Array,
    user_name: String,
    user_handle: String,
    post_id: String,
    post: String,
    language: String,
    twitterLink: String,
    raw_data: Object
}, {capped: {size: 167772160000, max: 10000}});
//Mongo schema for incoming requests
var trackableSchema = new mongoose.Schema({
    queries: String,
    tags: String,
    count: Number,
    streamEnabled: Number
});
//Mongoose models for handling requests and accessing twitter data respectively
var trackHandler = mongoose.model('trackables', trackableSchema);
var TUser = mongoose.model('twitters', twitterSchema);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/SocialMediaListen");
//Method to get text from a given tweet object
function get_text(tweet) {
    let txt;
    if(tweet.retweeted_status && tweet.retweeted_status.truncated){
        txt = tweet.retweeted_status.extended_tweet.full_text;
    }
    else if(tweet.retweeted_status && !tweet.retweeted_status.truncated){
        txt = tweet.retweeted_status.text;
    }
    else if(!tweet.retweeted_status && tweet.truncated){
        txt = tweet.extended_tweet.full_text;
    }
    else{
        txt = tweet.text;
    }
    txt = txt.split(' ');
    if(txt[txt.length-1].includes('https://')){
        txt.pop();
    }
    return txt.join(' ');
 }
//Method to check if a stream is enabled. If not enabled, start stream and wait for disconnection message. Stores data in twitters collection
function startStream(){
    let stream;
    trackHandler.find({}, {_id: 1, queries: 1, tags: 1, count: 1, streamEnabled: 1}, function(err, result){
        if(err) throw err;
        if(result.length!=0){
            for(let i=0; i<result.length; i++){ //loops through the present number of requests
                if(result[i].streamEnabled==0){
                    let trackables = result[i].queries.split(', ').concat(result[i].tags.split(', '));
                    stream = T.stream("statuses/filter", {track: trackables});
                    trackHandler.findOneAndUpdate({_id: result[i]._id}, {$set:{streamEnabled:1}}, {new: true}, function(err){
                        console.log("Tweet error status: "+err);
                    });
                    console.log("Stream "+i+" Enabled")
                    stream.on('tweet', function(tweet, query_id=result[i]._id){
                        let user_name;
                        let user_handle;
                        let post_id;
                        let language;
                        let raw_data;

                        if(tweet.retweeted_status){
                            user_name = tweet.retweeted_status.user.name;
                            user_handle = "@"+tweet.retweeted_status.user.screen_name;
                            post_id = tweet.retweeted_status.id;
                            language = tweet.retweeted_status.lang;
                            raw_data = tweet.retweeted_status;
                        }
                        else{
                            user_name = tweet.user.name;
                            user_handle = "@"+tweet.user.screen_name;
                            post_id = tweet.id;
                            language = tweet.lang;
                            raw_data = tweet;
                        }
                        var myData=new TUser({
                            query_id: query_id,
                            trackables: trackables,
                            user_name: user_name,
                            user_handle: user_handle,
                            post_id: post_id,
                            post: get_text(tweet),
                            language: language,
                            twitterLink: raw_data.text.split(' ').pop(),
                            raw_data: raw_data
                        })
                        myData.save().then(item => {

                        }, function(err){
                            console.log(err)
                        })
                    })
                    stream.on('disconnect', function(err,msg){
                        if(err) throw err;
                        console.log(msg);
                        trackHandler.findOneAndUpdate({_id: result[i]._id}, {$set:{streamEnabled: 0}}, {new: true}, function(err){
                            console.log("Disconnect error status: "+err);
                        }).sort({_id: 1});
                    })
                }
            }
        }
    }).sort({_id: 1});
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/Public",express.static(__dirname+"/Public"));

setInterval(startStream, 10000);

app.post("/sendRequest", (req,res) => {
    let query = req.body.query;
    let tag = req.body.tag;
    let count = req.body.count;
    let myData = new trackHandler({
        queries: query,
        tags: tag,
        count: count,
        streamEnabled: 0
    })
    myData.save()
        .then(item => {
            res.send({msg:"We are working on your request!", query_id: item._id});
        })
})

app.post("/sendRetrieve",(req,res)=>{
    let query = req.body.query;
    let tag = req.body.tag;
    let query_id = req.body.id;
    let trackables = query.split(', ').concat(tag.split(', '));
    let data = new Array();
    TUser.find({}, {_id: 0,query_id: 1, trackables: 1, user_name: 1, user_handle: 1, post_id: 1, post: 1, location: 1, language: 1, twitterLink: 1}, function(err, result){
        if(err) throw err;
        for(let i = 0; i<result.length; i++){
            for(let j = 0; j<trackables.length; j++){
                if(result[i].trackables.includes(trackables[j])){
                    data.push(result[i]);
                }
                else if(query_id==result[i].query_id){
                    data.push(result[i]);
                }
            }
        }
        res.send(data);
    })
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get("/View/Request", (req,res) => {
    res.sendFile(__dirname + "/View/Request.html");
})

app.get("/View/Retrieve", (req,res) => {
    res.sendFile(__dirname + "/View/Retrieve.html");
})

app.listen(port, () => {
    console.log("Server listening on port " + port);
})
