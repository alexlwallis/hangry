export {}; //Gets rid of 'Cannot redeclare block-scoped variable' error.
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 7878
const bodyParser = require("body-parser");
import * as api from './apiData'
import * as Axios from 'axios';

//Because importing this file when you tsc + outDir it'll need to tsc db file too.
import * as db from '../db/mongoDB'

// console.log(path.resolve('db', 'mongoDB'));

//Both of these two are needed so we can parse the inputs of the form
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.resolve('client', 'dist')));

app.get('/db', (request:any, result:any) => {
  db.find((err:any, res:any) => {
    if (err) {
      throw err;
    } else {
      console.log('res!!: ',res);
      result.status(200).send(JSON.stringify(res));
    }
  })
})

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));

app.post('/', (req: any, response:any) => {
  let cityOrCoordsOrId = req.body.city
  console.log('cityOrCoordsOrId: ', cityOrCoordsOrId);
  if (typeof cityOrCoordsOrId === 'number') {
      // api.chosenPlaceToRestaurants(String(cityOrCoordsOrId), ((res:any) => {
      //   console.log('res:!!: server.ts ',res);
      //   response.status(200).send(res)
      // }))
    let start = 0;
    let count = 19;
    let longArrayOfRestaurants:any = [];
    while (count <= 100) {
      api.chosenPlaceToRestaurants(String(cityOrCoordsOrId), start, count,((results:any) => {
        longArrayOfRestaurants.push(results)
        if (longArrayOfRestaurants.length === 5){
          response.status(200).send(longArrayOfRestaurants)
        }
      }))
      start = start + 20;
      count = count + 20;
    }
  } else if (cityOrCoordsOrId.match(/[a-zA-z]/g)){
    console.log('coords: ',cityOrCoordsOrId)
    api.locationToCoords(cityOrCoordsOrId, (result:Object) => {
      response.status(200).send(result)
    })
  } else {
    //Geolocation
    console.log('here geolcation?')
    let x = cityOrCoordsOrId.split(',')
    api.validLocation(x[0], x[1], (res:any) => {
      let longArrayOfRestaurants:any = [];
      if (res != true) {
        let start = 0;
        let count = 19;
        while (count <= 100) {
          api.retrieveData(x[0], x[1], start, count,((results:any) => {
            longArrayOfRestaurants.push(results)
            if (longArrayOfRestaurants.length === 5){
              response.status(200).send(longArrayOfRestaurants)
            }
          }))
          start = start + 20;
          count = count + 20;
        }
      } else {
        console.log("Your location cannot be found.")
        response.status(200).send(longArrayOfRestaurants)
      }
    })
  }
});


app.listen(port, () => console.log(`Express server running at ${port}`))