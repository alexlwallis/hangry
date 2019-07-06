export {}; //Gets rid of 'Cannot redeclare block-scoped variable' error.
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 7878
const bodyParser = require("body-parser");
import * as api from './apiData'
import * as Axios from 'axios';

//Both of these two are needed so we can parse the inputs of the form
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));

app.post('/', (req: any, response:any) => {
  let cityOrCoords = req.body.city
  if (cityOrCoords.match(/[a-zA-z]/g)){
    console.log('coords: ',cityOrCoords)
    api.locationToCoords(cityOrCoords, (result:Object) => {
      console.log(result)
      response.status(200).send(result)
    })
  } else {
    //Geolocation
    let x = cityOrCoords.split(',')
    api.retrieveData(x[0], x[1], ((results:any) => {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      console.log('results: ',results)
      response.status(200).send(results)
    }))
  }
});

app.listen(port, () => console.log(`Express server running at ${port}`))