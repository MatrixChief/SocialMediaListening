// var express = require('express');
// var app = express();
// var port = 8080;
// var mongoose = require('mongoose');
var Twit = require('twit');
var Twit_config = require('./Twit_config');
// var MongoClient = require('mongodb').MongoClient;
// var twitterSchema = new mongoose.Schema({
//     username: String,
//     post: String
// });
var T = new Twit(Twit_config);
// var User = mongoose.model('Twitter',twitterSchema);
//
// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/SocialMediaListen");

console.log('Server is starting!');

T.get('search/tweets', { q: 'banana since:2016-07-11', count: 2 }, function(err, data, response) {
    if(err) throw err;
    else{
        console.log(data);
    };
});
