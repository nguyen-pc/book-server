const express = require("express");
const authorControllers = require("../../controllers/authorController");
const router = express.Router();

router.post("/create", authorControllers.create);
router.get("/allAuthor", authorControllers.getAllAuthor);
router.get("/getauthor/:authorId", authorControllers.getAuthorById);
router.put("/update/:authorId", authorControllers.updateAuthor);
router.delete("/delete/:authorId", authorControllers.deleteAuthor);

module.exports = router;
