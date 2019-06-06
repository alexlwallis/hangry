"use strict";
exports.__esModule = true;
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var fetch = require('node-fetch');
var keyPath = path.resolve('key.json');
var key = require(keyPath).key;
function retrieveData(city) {
    fetch("https://developers.zomato.com/api/v2.1/cities?q=" + city + "&apikey=" + key, {
        method: 'GET',
        headers: {
            "access-control-allow-credentials": "true",
            "access-control-allow-headers": "X-Zomato-API-Key",
            "access-control-allow-methods": "GET, POST, DELETE, PUT, PATCH, OPTIONS",
            "access-control-allow-origin": "*",
            "content-type": 'application/json'
        }
    })["catch"](function (error) { return console.log(error); })
        .then(function (x) { return console.log(x); });
}
exports.retrieveData = retrieveData;
retrieveData('Berkeley');
