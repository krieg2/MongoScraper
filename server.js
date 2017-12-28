// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
//const mongojs = require("mongojs");
const port = process.env.PORT || 3000 ;
require("dotenv").config();

const app = express();

// Set up Body Parser.
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Set up Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(port, function(){
  console.log("App running on port " + port);
});
