"use strict";
exports.__esModule = true;
var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 7878;
var bodyParser = require("body-parser");
var api = require("./apiData");
// import * as db from '../db/mongoDB'
// console.log(path.resolve('db', 'mongoDB'));
//Both of these two are needed so we can parse the inputs of the form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve('client', 'dist')));
app.get('/d', function (req, res) {
    res.send('hello');
});
app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));
app.post('/', function (req, response) {
    var cityOrCoordsOrId = req.body.city;
    console.log('cityOrCoordsOrId: ', cityOrCoordsOrId);
    if (typeof cityOrCoordsOrId === 'number') {
        // api.chosenPlaceToRestaurants(String(cityOrCoordsOrId), ((res:any) => {
        //   console.log('res:!!: server.ts ',res);
        //   response.status(200).send(res)
        // }))
        var start = 0;
        var count = 19;
        var longArrayOfRestaurants_1 = [];
        while (count <= 100) {
            api.chosenPlaceToRestaurants(String(cityOrCoordsOrId), start, count, (function (results) {
                longArrayOfRestaurants_1.push(results);
                if (longArrayOfRestaurants_1.length === 5) {
                    response.status(200).send(longArrayOfRestaurants_1);
                }
            }));
            start = start + 20;
            count = count + 20;
        }
    }
    else if (cityOrCoordsOrId.match(/[a-zA-z]/g)) {
        console.log('coords: ', cityOrCoordsOrId);
        api.locationToCoords(cityOrCoordsOrId, function (result) {
            response.status(200).send(result);
        });
    }
    else {
        //Geolocation
        var x = cityOrCoordsOrId.split(',');
        var start = 0;
        var count = 19;
        var longArrayOfRestaurants_2 = [];
        while (count <= 100) {
            api.retrieveData(x[0], x[1], start, count, (function (results) {
                longArrayOfRestaurants_2.push(results);
                if (longArrayOfRestaurants_2.length === 5) {
                    response.status(200).send(longArrayOfRestaurants_2);
                }
            }));
            start = start + 20;
            count = count + 20;
        }
    }
});
app.listen(port, function () { return console.log("Express server running at " + port); });
