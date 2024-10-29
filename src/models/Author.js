const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = Schema({
  address: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    require: true,
  },
  detail:{
    type: String,
    require: false,
  }
});
module.exports = mongoose.model("Author", AuthorSchema);
