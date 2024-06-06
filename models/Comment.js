const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});
module.exports = mongoose.model("Comment", CommentSchema);
