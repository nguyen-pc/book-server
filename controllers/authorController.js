const Author = require("../models/Author");

async function create(req, res) {
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(422).json({ message: "Invalid field" });
  }

  try {
    await Author.create({
      name,
      address,
    });
    return res.sendStatus(201);
  } catch (e) {
    return res.status(400).json({ message: "Could not Author", secure: true });
  }
}

async function getAuthorById(req, res) {
  const { authorId } = req.params;
  try {
    const author = await Author.findById(authorId).exec();
    if (!author) {
      return res.status(405).json({ message: "Author not found" });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error("Error retrieving author by ID:", error);
    return res
      .status(500)
      .json({ message: "Could not retrieve author", error: error.message });
  }
}

async function getAllAuthor(req, res) {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const result = {};

    const author = await Author.countDocuments().exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.author = author;
    const totalPage = Math.ceil(author / limit);

    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await Author.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }

    result.data = await Author.find()
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();

    result.rowsPerPage = limit;
    result.totalPage = totalPage;

    return res.status(200).json(result);
  } catch (e) {
    console.error("Error retrieving author:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve author", error: e.message });
  }
}

async function updateAuthor(req, res) {
  const { authorId } = req.params;
  const authorData = req.body;

  try {
    const author = await Author.findByIdAndUpdate(authorId, authorData, {
      new: true,
    }).exec();

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error("Error updating author:", error);
    return res
      .status(500)
      .json({ message: "Could not update author", error: error.message });
  }
}

async function deleteAuthor(req, res) {
  const authorId = req.params; // Lấy userId từ tham số route
  try {
    const author = await Author.findByIdAndDelete(authorId.authorId); // Xóa người dùng theo ID
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    return res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting author", error: error.message });
  }
}

module.exports = {
  create,
  getAllAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
