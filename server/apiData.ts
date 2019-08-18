import { request } from "http";

var express = require('express');
var app = express();
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch');
var keyPath = path.resolve('key.json');
let key = require(keyPath).key
const axios = require("axios");


export async function validLocation(lat:String, lon:String, cb:Function){
  type parameters = {
    lat: String,
    lon: String,
  }

  const parameters = {
    lat: lat,
    lon: lon
  }

  await axios.get('https://developers.zomato.com/api/v2.1/geocode', {
    params: parameters,
    headers: {
      'user-key': key,
      'Accept':'application/json'
    }
  })
  .then((res:any) => {
    console.log("validLocation; ", res);
    cb(res);
  })
  .catch((err:any) => {
    cb(err.isAxiosError)
  })
}

export async function retrieveData(lat: String, lon:String, start:Number, count:Number, cb: Function){
  //Change count to 20 later.

  // validLocation(lat, lon, (e:any)=>console.log('validLocation: ',e))

  console.log('here retrieveData')
  type parameters = {
    lat: String,
    lon: String,
    start: Number,
    count: Number
  }

  const parameters = {
    lat: lat,
    lon: lon,
    start: start,
    count: count
  }
  //Looks like axios abstracts away the buffers?
  //Unsure if putting await before axios.get makes it slower..
  await axios.get('https://developers.zomato.com/api/v2.1/search', {
    params: parameters,
    headers: {
      'user-key': key,
      'Accept':'application/json'
    }
  })
  .then((res: any) => {
    //For some reason if I set necessaryData to Object it wont let me add a key to it a la necessaryData.key
    //future reading => https://stackoverflow.com/questions/32968332/how-do-i-prevent-the-error-index-signature-of-object-type-implicitly-has-an-an
    //res.data.restaurants.map((item:any) => console.log(item.restaurant.location.country_id))
    let necessaryData: any = {}
    res.data.restaurants.map((item: any) => {
      let key = (item.restaurant.name)
      let interestingData: Object = [item.restaurant.location.address, item.restaurant.cuisines, item.restaurant.average_cost_for_two, item.restaurant.user_rating.aggregate_rating, item.restaurant.phone_numbers, item.restaurant.timings, item.restaurant.establishment, item.restaurant.name, item.restaurant.location.latitude, item.restaurant.location.longitude]
      necessaryData[key] = interestingData;
    })
    cb(necessaryData)
  })
  .catch((err: any) => console.log(err))
}

export async function chosenPlaceToRestaurants(id:string, start:Number, count:Number, cb:Function){
  console.log('here chosenPlaceToRestaurants')

  type param = {
    entity_id: string,
    entity_type: string,
    start: Number,
    count: Number
  }
  const param = {
    entity_id: id,
    entity_type: 'city',
    start: start,
    count: count
  }
  await axios.get('https://developers.zomato.com/api/v2.1/search', {
    params: param,
    headers: {
      'user-key': key,
      'Accept':'application/json'
    }
  })
  .then((res: any) => {
    let necessaryData: any = {}
    res.data.restaurants.map((item: any) => {
      let key = (item.restaurant.name)
      let interestingData: Object = [item.restaurant.location.address, item.restaurant.cuisines, item.restaurant.average_cost_for_two, item.restaurant.user_rating.aggregate_rating, item.restaurant.phone_numbers, item.restaurant.timings, item.restaurant.establishment, item.restaurant.name, item.restaurant.location.latitude, item.restaurant.location.longitude]
      necessaryData[key] = interestingData;
    })
    console.log('necessaryData: ~~~~~~~~',necessaryData)
    cb(necessaryData)
  })
  .catch((err:any) => {console.error(err)});
}



export function locationToCoords(q: string, cb:Function){
  console.log('here locationToCoords')

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
  .catch((err:any) => {console.error(err)});
}
