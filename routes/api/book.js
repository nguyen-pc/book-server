const express = require("express");
const Book = require("../../models/Book");
const bookController = require("../../controllers/bookController");
const upload = require("../../photo/upload");
const router = express.Router();

// Tạo sách
router.post("/create", bookController.create);
router.get("/allbook", bookController.getAllBook);
router.get("/bookId/:id", bookController.getBookById);
router.delete("/bookId/:bookId", bookController.deleteBook);
router.put("/bookId/:bookId", bookController.updateBook);

// Tải lên ảnh bìa
router.post("/uploadCover", upload.single("cover"), (req, res) => {
  try {
    const coverPath = req.file.filename; //path
    res.status(200).json({
      message: "Upload ảnh thành công",
      imageUrl: coverPath, // Đường dẫn ảnh được trả về để lưu trữ trong thông tin sách
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi upload ảnh",
      error: error.message,
    });
  }
});

module.exports = router;
