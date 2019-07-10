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
app.post('/', function (req, response) {
    var cityOrCoordsOrId = req.body.city;
    console.log('cityOrCoordsOrId: ', cityOrCoordsOrId);
    console.log(typeof cityOrCoordsOrId);
    if (typeof cityOrCoordsOrId === 'number') {
        console.log('ID:!!! ', cityOrCoordsOrId);
        api.chosenPlaceToRestaurants(String(cityOrCoordsOrId), (function (res) {
            console.log('res:!!: server.ts ', res);
            response.status(200).send(res);
        }));
    }
    else if (cityOrCoordsOrId.match(/[a-zA-z]/g)) {
        console.log('coords: ', cityOrCoordsOrId);
        api.locationToCoords(cityOrCoordsOrId, function (result) {
            //console.log(result)
            response.status(200).send(result);
        });
    }
    else {
        //Geolocation
        var x = cityOrCoordsOrId.split(',');
        api.retrieveData(x[0], x[1], (function (results) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            console.log('results: ', results);
            response.status(200).send(results);
        }));
    }
});
app.listen(port, function () { return console.log("Express server running at " + port); });
