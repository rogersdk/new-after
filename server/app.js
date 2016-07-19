/**
 * Created by nattanlucena on 19/07/16.
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();
var http = require('http').Server(app);
var database = require('./config/db');

var SERVER_PORT = process.env.port || 8080;


// routes
require('./app/routes.js')(app);

//Database connection
try {
    mongoose.connect(database.url);
} catch (err) {
    throw new Error(err);
}

// Start server
http.listen(SERVER_PORT, function () {
    'use strict';
    console.log('Server is listening on port %d', SERVER_PORT);
});