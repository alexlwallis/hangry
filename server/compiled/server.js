"use strict";
exports.__esModule = true;
var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 7878;
var bodyParser = require("body-parser");
var api = require("./apiData");
//Both of these two are needed so we can parse the inputs of the form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));
app.post('/', function (req, res) {
    // let city = (req.body.city)
    var city = Object.keys(req.body)[0];
    if (city.match(/[a-zA-z]/g)) {
        console.log('string');
        api.locationToCoords(city);
    }
    else {
        var x = city.split(',');
        // console.log(x[0])
        // console.log(x[1])
        api.retrieveData(x[0], x[1], (function (res) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            console.log(res);
        }));
    }
});
app.listen(port, function () { return console.log("Express server running at " + port); });
