User.jsvar mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new Schema({
  timesId: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  },
  // The ref property links the ObjectId to the Comment model.
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

// Creates the model from the above schema.
var Article = mongoose.model("Article", Schema);

// Export the Article model.
module.exports = Article;
