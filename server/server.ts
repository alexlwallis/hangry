export {}; //Gets rid of 'Cannot redeclare block-scoped variable' error.
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 7878
const bodyParser = require("body-parser");
import * as api from './apiData'

//Both of these two are needed so we can parse the inputs of the form
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));

app.post('/', (req: any, res:any) => {
  // let city = (req.body.city)
  let city = Object.keys(req.body)[0]
  if (city.match(/[a-zA-z]/g)){
    console.log('string')
    api.locationToCoords(city)
  } else {
    let x = city.split(',')
    // console.log(x[0])
    // console.log(x[1])
    api.retrieveData(x[0], x[1], ((res:any) => {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      console.log(res)
    }))
  }
});



app.listen(port, () => console.log(`Express server running at ${port}`))