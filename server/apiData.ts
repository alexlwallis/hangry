var express = require('express');
var app = express();
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch');
var keyPath = path.resolve('key.json');
let key = require(keyPath).key

export function retrieveData(city: String){
  fetch(`https://developers.zomato.com/api/v2.1/cities?q=${city}&apikey=${key}`, {
  method: 'GET',
  headers: {
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "X-Zomato-API-Key",
      "access-control-allow-methods": "GET, POST, DELETE, PUT, PATCH, OPTIONS",
      "access-control-allow-origin": "*",
      "content-type": 'application/json'
    }
  })
  .catch((error:any) => console.log(error))
  .then((x: any) => console.log(x))
}

retrieveData('Berkeley');
