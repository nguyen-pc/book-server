const express = require("express");
const borrowController = require("../../controllers/borrowController");
const router = express.Router();

router.post("/create", borrowController.create);
router.get("/allborrow", borrowController.getAllBorrow);
router.get("/userBorrow/:userId", borrowController.getUserBorrow);
router.post("/return/:borrowId", borrowController.returnBook);
router.put("/status", borrowController.updateStatus);
// router.post("/status", borrowController.updateAction)

// router.get("/getauthor/:authorId", authorControllers.getAuthorById);
// router.put("/update/:authorId", authorControllers.updateAuthor);
// router.delete("/delete/:authorId", authorControllers.deleteAuthor);

module.exports = router;
