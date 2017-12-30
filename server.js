// Dependencies
const express    = require("express");
const bodyParser = require("body-parser");
const request    = require("request");
const cheerio    = require("cheerio");
const exphbs     = require("express-handlebars");
const mongoose   = require("mongoose");
const port       = process.env.PORT || 3000 ;
const morgan     = require('morgan');

require("dotenv").config();

const app = express();
app.use(morgan('combined'));

// Database configuration
mongoose.connect("mongodb://localhost/mongoHeadlines");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

var schema = new mongoose.Schema({
    timesId   : String,
    heading   : String,
    link      : String,
    summary   : String,
    saved     : Boolean,
    comments  : [ String ]
});
 
var Article = mongoose.model("Article", schema);

// Public directory.
app.use(express.static("public"));

// Set up Body Parser.
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Set up Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Create routes.
require("./routes/html-routes.js")(app, Article);
require("./routes/api-routes.js")(app, request, cheerio, Article);

app.listen(port, function(){
    console.log("App running on port " + port);
});