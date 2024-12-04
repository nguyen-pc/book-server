const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const emailService = require("../service/emailService");

async function create(req, res) {
  const {
    email,
    bookName,
    user,
    book,
    borrowedDay,
    estimatedReturnDate,
    actualReturnDate,
    status,
  } = req.body;
  if (!user || !book || !borrowedDay) {
    return res.status(422).json({ message: "Invalid field" });
  }

  try {
    // Tìm sách và kiểm tra số lượng
    const bookToBorrow = await Book.findById(book);
    if (!bookToBorrow) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (bookToBorrow.number <= 0) {
      return res.status(400).json({ message: "Book is out of stock" });
    }
    console.log(email, bookName);
    // await emailService.sendSimpleEmail(email, bookName, estimatedReturnDate);
    console.log("<<<<<<<<<<<<<<<<");
    // Tạo bản ghi mượn sách
    await Borrow.create({
      user,
      book,
      borrowedDay,
      estimatedReturnDate,
      actualReturnDate,
      status,
    });

    // Giảm số lượng sách
    bookToBorrow.number -= 1;
    await bookToBorrow.save();

    return res.sendStatus(201);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Could not create borrow", error: e.message });
  }
}

async function updateStatus(req, res) {
  const { borrowId, status, actualReturnDate } = req.body;

  console.log(borrowId, status);

  try {
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (actualReturnDate != null) {
      borrow.actualReturnDate = actualReturnDate;
    }
    if(status === "approved"){
      // await emailService.sendSimpleEmail(email, bookName, estimatedReturnDate);
    }
    if (status === "returned") {
      const book = await Book.findById(borrow.book._id);
      if (book) {
        book.number += 1;
        await book.save();
      }
    }
    borrow.status = status;
    await borrow.save();
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Could not update status", error: e.message });
  }
}

async function returnBook(req, res) {
  const borrowId = req.params.borrowId;
  const { returnDate } = req.body;
  try {
    const borrow = await Borrow.findById(borrowId).populate("book");
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }
    if (borrow.actualReturnDate) {
      return res.status(400).json({ message: "Book already returned" });
    }
    borrow.actualReturnDate = returnDate || new Date().toISOString();
    await borrow.save();

    const book = await Book.findById(borrow.book._id);
    if (book) {
      book.number += 1;
      await book.save();
    }

    return res.status(200).json({ actualReturnDate: borrow.actualReturnDate });
  } catch (e) {
    console.error("Error returning book:", e);
    return res
      .status(500)
      .json({ message: "Could not return book", error: e.message });
  }
}

async function getAllBorrow(req, res) {
  try {
    const borrows = await Borrow.find()
      .populate("user", "username")
      .populate("book", "name")
      .exec();
    return res.status(200).json(borrows);
  } catch (e) {
    console.error("Error retrieving borrow:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve borrow", error: e.message });
  }
}

async function getUserBorrow(req, res) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "invalid" });
  }
  try {
    const borrowUser = await Borrow.find({ user: userId })
      .populate("book", "name")
      .exec();
    if (!borrowUser) {
      return res.status(405).json({ message: "borrowUser not found" });
    } else {
      return res.status(200).json(borrowUser);
    }
  } catch (e) {
    console.error("Error retrieving borrowUser:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve borrowUser", error: e.message });
  }
}

module.exports = {
  create,
  getAllBorrow,
  returnBook,
  getUserBorrow,
  updateStatus,
};
