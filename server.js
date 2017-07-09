var express = require('express');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var ejs = require('ejs');
var session = require('express-session');
var jwt        = require("jsonwebtoken");

mongoose.connect('mongodb://localhost:27017/givvir');

var app = express();

app.set('view engine', 'ejs');
app.set('superSecret', "test"); // secret variable
process.env.JWT_SECRET = "test";

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));

var port = process.env.PORT || 3001;

var apiRoutes = require('./routes/routes');

//Start
app.use('/api', apiRoutes);
app.use(express.static('public'));

app.listen(port);
console.log("Running on port" + port);
