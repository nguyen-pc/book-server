const Publisher = require("../models/Publisher");

async function create(req, res) {
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(422).json({ message: "Invalid field" });
  }

  try {
    await Publisher.create({
      name,
      address,
    });
    return res.sendStatus(201);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Could not register", secure: true });
  }
}

async function getPublisherById(req, res) {
  const { publisherId } = req.params;
  try {
    const publisher = await Publisher.findById(publisherId).exec();
    if (!publisher) {
      return res.status(405).json({ message: "Publisher not found" });
    }
    return res.status(200).json(publisher);
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    return res
      .status(500)
      .json({ message: "Could not retrieve user", error: error.message });
  }
}

async function getAllPublisher(req, res) {
  try {
    const publisher = await Publisher.find().exec();
    return res.status(200).json(publisher);
  } catch (e) {
    console.error("Error retrieving books:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve books", error: e.message });
  }
}

async function updatePublisher(req, res) {
  const { publisherId } = req.params;
  const publisherData = req.body;

  try {
    const publisher = await Publisher.findByIdAndUpdate(
      publisherId,
      publisherData,
      {
        new: true,
      }
    ).exec();

    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }
    return res.status(200).json(publisher);
  } catch (error) {
    console.error("Error updating publisher:", error);
    return res
      .status(500)
      .json({ message: "Could not update publisher", error: error.message });
  }
}

async function deletePublisher(req, res) {
  const publisherId = req.params; // Lấy userId từ tham số route
  try {
    const publisher = await Publisher.findByIdAndDelete(
      publisherId.publisherId
    ); // Xóa người dùng theo ID
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }
    return res.status(200).json({ message: "Publisher deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting Publisher", error: error.message });
  }
}

module.exports = {
  create,
  getPublisherById,
  getAllPublisher,
  updatePublisher,
  deletePublisher,
};
