import { request } from "http";

var express = require('express');
var app = express();
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch');
var keyPath = path.resolve('key.json');
let key = require(keyPath).key
const axios = require("axios");
var StringDecoder = require('string_decoder').StringDecoder;

// export async function retrieveData(lat: String, lon:String){
//   //Change count to 20 later.
//   fetch(`https://developers.zomato.com/api/v2.1/search?count=1&lat=${lat}&lon=${lon}&apikey=${key}`, {
//   method: 'GET',
//   headers: {
//       "access-control-allow-credentials": "true",
//       "access-control-allow-headers": "X-Zomato-API-Key",
//       "access-control-allow-methods": "GET, POST, DELETE, PUT, PATCH, OPTIONS",
//       "access-control-allow-origin": "*",
//       "content-type": 'application/json'
//     }
//   })
//   .catch((error:any) => console.log(error))
//   //.then((bufferToString: any) => bufferToString.body._buffer.toString())
//   .then((bufferToString: any) => {
//     // var decoder = new StringDecoder('utf8');

//     // console.log(x.toString('utf8'))
//     //console.log(y)
//     //console.log(aData.indexOf(aData[0]))
//     // for (let i=0; i<100; i++) {
//     //   console.log(z['data'].indexOf(z['data'][i]))
//     // }
//   })
//   //.then((dataObj: any) => dataObj.json())
//   //.then((data: any) =>  console.log(data))
// }

export async function retrieveData(lat: String, lon:String, cb: Function){
  //Change count to 20 later.
  const parameters = {
    lat: lat,
    lon: lon
  }
  //Looks like axios abstracts away the buffers?
  //Unsure if putting await before axios.get makes it slower..
  axios.get('https://developers.zomato.com/api/v2.1/search', {
    params: parameters,
    headers: {
      'user-key': key,
      'Accept':'application/json'
    }
  })
  .then((res: any) => {
    //For some reason if I set necessaryData to Object it wont let me add a key to it a la necessaryData.key
    //future reading => https://stackoverflow.com/questions/32968332/how-do-i-prevent-the-error-index-signature-of-object-type-implicitly-has-an-an
    let necessaryData: any = {}
    res.data.restaurants.map((item: any) => {
      let key = (item.restaurant.name)
      let interestingData = [item.restaurant.location.address, item.restaurant.cuisines, item.restaurant.average_cost_for_two, item.restaurant.user_rating.aggregate_rating]
      necessaryData[key] = interestingData;
    })
    cb(necessaryData)
  })
  .catch((err: any) => console.log(err))
}



export function locationToCoords(query: string){
  fetch(`https://developers.zomato.com/api/v2.1/locations?query=${query}&apikey=${key}`, {
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
  .then((bufferToString: any) => bufferToString.body._buffer.toString())
  .then((dataObj: any) => console.log(dataObj.location_suggestions))
}


//retrieveData('Berkeley');
