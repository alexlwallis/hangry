var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 7878;
var bodyParser = require("body-parser");
//Both of these two are needed so we can parse the inputs of the form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/node_modules', express.static('node_modules'));
app.use('/', express.static(path.resolve('client', 'dist')));
app.post('/', function (req, res) {
    // let city = (req.body.city)
    var city = Object.keys(req.body)[0];
    console.log(typeof city);
});
app.listen(port, function () { return console.log("Express server running at " + port); });