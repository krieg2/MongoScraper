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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

var ObjectId = mongoose.Schema.Types.ObjectId;
var schema = new mongoose.Schema({
    timesId   : String,
    heading   : String,
    link      : String,
    summary   : String,
    saved     : { type: Boolean, default: false },
    comments  : [ {_id: ObjectId, comment: String} ]
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
require("./routes/api-routes.js")(app, request, cheerio, mongoose, Article);

app.listen(port, function(){
    console.log("App running on port " + port);
});
