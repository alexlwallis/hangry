const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 1234
const bodyParser = require("body-parser");

app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.post('/cityLocation', (req, res) => {
  res.status(200);
  let city = req.body.city;
  console.log(req.body.city);
  res.redirect('/')
})

app.get('/cityLocation', (req, res) => {
  res.status(200);

})

app.listen(port, () => console.log(`Express server running at ${port}`))