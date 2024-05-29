const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

async function create(req, res) {
  const { user, book, borrowedDay, estimatedReturnDate, actualReturnDate } =
    req.body;
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

    // Tạo bản ghi mượn sách
    await Borrow.create({
      user,
      book,
      borrowedDay,
      estimatedReturnDate,
      actualReturnDate,
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

async function returnBook(req, res) {
  const { borrowId, actualReturnDate } = req.body;
  if (!borrowId || !actualReturnDate) {
    return res.status(422).json({ message: "Invalid field" });
  }

  try {
    // Tìm bản ghi mượn sách
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // Cập nhật ngày trả sách thực tế
    borrow.actualReturnDate = actualReturnDate;
    await borrow.save();

    // Tăng số lượng sách
    const bookToReturn = await Book.findById(borrow.book);
    if (bookToReturn) {
      bookToReturn.number += 1;
      await bookToReturn.save();
    }

    return res.sendStatus(200);
  } catch (e) {
    return res
      .status(400)
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
    const borrowUser = await Borrow.find({ user: userId }).exec();
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

module.exports = { create, getAllBorrow, returnBook, getUserBorrow };
