// Dependencies
const express    = require("express");
const bodyParser = require("body-parser");
const request    = require("request");
const cheerio    = require("cheerio");
const exphbs     = require("express-handlebars");
const mongojs    = require("mongojs");
const port       = process.env.PORT || 3000 ;
const morgan     = require('morgan');

require("dotenv").config();

const app = express();
app.use(morgan('combined'));

// Database configuration
const databaseUrl = "mongoHeadlines";
const collections = ["articles"];
const db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error: ", error);
});

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
require("./routes/html-routes.js")(app, db);
require("./routes/api-routes.js")(app, request, cheerio, db);

app.listen(port, function(){
  console.log("App running on port " + port);
});
