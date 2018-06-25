var express = require('express');
var app = express();
var port = 8080;
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var twitterSchema = new mongoose.Schema({
    username: String,
    post: String
});
var User = mongoose.model('Twitter',twitterSchema);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/SocialMediaListen");
