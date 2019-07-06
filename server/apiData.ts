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

export async function retrieveData(lat: String, lon:String, cb: Function){
  //Change count to 20 later.
  type parameters = {
    lat: String,
    lon: String,
  }

  const parameters = {
    lat: lat,
    lon: lon,
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
      let interestingData: Object = [item.restaurant.location.address, item.restaurant.cuisines, item.restaurant.average_cost_for_two, item.restaurant.user_rating.aggregate_rating]
      necessaryData[key] = interestingData;
    })
    cb(necessaryData)
  })
  .catch((err: any) => console.log(err))
}



export function locationToCoords(q: string, cb:Function){
  type parameters = {
    q: String
  }
  const parameters = {
    q: q
  }
  axios.get('https://developers.zomato.com/api/v2.1/cities', {
    params: parameters,
    headers: {
      'user-key': key,
      'Accept':'application/json'
    }
  })
  .then((res: any) => {
    //console.log('res: ',res.data.location_suggestions)
    let necessaryData: any = {};
    res.data.location_suggestions.map((item:any) => {
      let name = item.name
      necessaryData[name] = [item.country_name, item.id]
    })
    cb(necessaryData)

  })
}
