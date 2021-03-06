
require('dotenv').config()
var express = require("express");
var bodyParser = require('body-parser');
var path = require('path');

var exphbs = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");


var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing

app.use(logger("dev"));

// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static directory
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, '/views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  extname: '.handlebars',
  layoutsDir: 'views/layouts'
}));
app.set('view engine', 'handlebars');


// =============================================================

// Routes
// =============================================================


var news = require('./routes/newsRoutes.js');


//app.use('/', routes);
app.use(news);


// =============================================================
//mongoose.connect("mongodb://localhost/scrap", { useNewUrlParser: true });
//mongoose.set('debug', true);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrap";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

