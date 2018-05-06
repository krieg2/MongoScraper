var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {
  	type: String,
    required: true
  }
});

// Creates the model from the above schema.
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model.
module.exports = Comment;
