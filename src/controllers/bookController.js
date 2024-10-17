const Book = require("../models/Book");

// Định nghĩa các hàm controller cho sách
async function create(req, res) {
  const { name, unitCost, number, publishYear, author, publisher, cover } =
    req.body;

  if (!name || !unitCost || !number || !publishYear || !author || !publisher) {
    return res.status(422).json({ message: "Invalid field" });
  }

  try {
    await Book.create({
      cover,
      name,
      unitCost,
      number,
      publishYear,
      author,
      publisher,
    });
    return res.sendStatus(201);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Could not create book", error: e.message });
  }
}

async function getAllBook(req, res) {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const result = {};

    const book = await Book.countDocuments().exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.book = book;
    const totalPage = Math.ceil(book / limit);

    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await Book.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }

    result.data = await Book.find()
      .populate("author", "name")
      .populate("publisher", "name")
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();

    result.rowsPerPage = limit;
    result.totalPage = totalPage;

    return res.status(200).json(result);
  } catch (e) {
    console.error("Error retrieving books:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve books", error: e.message });
  }
}

async function getBookById(req, res) {
  const { id } = req.params;
  try {
    const book = await Book.findById(id)
      .populate("author", "name")
      .populate("publisher", "name")
      .exec();
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      return res.status(200).json(book);
    }
  } catch (e) {
    console.error("Error retrieving books:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve book", error: e.message });
  }
}

async function deleteBook(req, res) {
  const bookId = req.params; // Lấy userId từ tham số route
  try {
    const book = await Book.findByIdAndDelete(bookId.bookId); // Xóa người dùng theo ID
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting Book", error: error.message });
  }
}
async function updateBook(req, res) {
  const { bookId } = req.params;
  const bookData = req.body;

  try {
    const book = await Book.findByIdAndUpdate(bookId, bookData, {
      new: true,
    }).exec();

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    return res
      .status(500)
      .json({ message: "Could not update book", error: error.message });
  }
}

module.exports = { create, getAllBook, getBookById, deleteBook, updateBook };
