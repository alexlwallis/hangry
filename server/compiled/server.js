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
    if (typeof cityOrCoordsOrId === 'number') {
        api.chosenPlaceToRestaurants(String(cityOrCoordsOrId), (function (res) {
            console.log('res:!!: server.ts ', res);
            response.status(200).send(res);
        }));
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
        var longArrayOfRestaurants_1 = [];
        while (count <= 99) {
            console.log(count);
            api.retrieveData(x[0], x[1], start, count, (function (results) {
                longArrayOfRestaurants_1.push(results);
                if (longArrayOfRestaurants_1.length === 5) {
                    console.log('y');
                    response.status(200).send(longArrayOfRestaurants_1);
                }
            }));
            start = start + 20;
            count = count + 20;
        }
    }
});
app.listen(port, function () { return console.log("Express server running at " + port); });
