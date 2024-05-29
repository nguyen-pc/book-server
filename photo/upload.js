const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Kiểm tra và tạo thư mục nếu không tồn tại
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình lưu trữ tệp
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir); // Thư mục lưu trữ tệp
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên tệp theo thời gian hiện tại
    },
});

const upload = multer({ storage: storage });

module.exports = upload;