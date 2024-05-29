const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = Schema({
  cover: {
    type: String,
  },
  name: {
    type: String,
    default: "",
    require: true,
  },
  unitCost: {
    type: Number,
    default: 0,
  },
  number: {
    type: Number,
    default: 0,
  },
  publishYear: {
    type: Number,
    require: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  publisher: {
    type: Schema.Types.ObjectId,
    ref: "Publisher",
  },
});

module.exports = mongoose.model("Book", BookSchema);
