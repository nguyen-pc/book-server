const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      process.env.DATABASE_URI ||
        "mongodb+srv://nguyenthcs430:hAxYIx8vF3gdaqmH@cluster0.sy5pjsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = connect;
