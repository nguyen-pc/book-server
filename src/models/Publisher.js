const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PublisherSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("Publisher", PublisherSchema);
