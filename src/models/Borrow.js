const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BorrowSchema = Schema({
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
  borrowedDay: {
    type: Date,
    default: () => Date.now(),
  },
  estimatedReturnDate: {
    type: Date,
    default: () => new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  },
  actualReturnDate: {
    type: Date,
    default: null,
  },
});
module.exports = mongoose.model("Borrow", BorrowSchema);
