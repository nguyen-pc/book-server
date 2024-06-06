const express = require("express");
const commentController = require("../../controllers/commentController");
const router = express.Router();

router.post("/create", commentController.Create);
router.get("/allComment", commentController.getAllComment);
// router.get("/userBorrow/:userId", borrowController.getUserBorrow);
// router.post("/return/:borrowId", borrowController.returnBook);

module.exports = router;
