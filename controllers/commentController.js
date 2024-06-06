const Comment = require("../models/Comment");

async function Create(req, res) {
  const { user, book, text } = req.body;

  if (!user || !book || !text) {
    return res.status(422).json({ message: "Invalid field" });
  }

  try {
    await Comment.create({
      user,
      book,
      text,
    });
    return res.sendStatus(201);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Could not comment", error: e.message });
  }
}

async function getAllComment(req, res) {
  try {
    const comments = await Comment.find().populate("user", "username").exec();
    return res.status(200).json(comments);
  } catch (e) {
    console.error("Error retrieving comment:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve comment", error: e.message });
  }
}

module.exports = { Create, getAllComment };
