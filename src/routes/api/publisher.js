const express = require("express");
const publisherControllers = require("../../controllers/publisherController");

const router = express.Router();

router.post("/create", publisherControllers.create);
router.get("/allPublisher", publisherControllers.getAllPublisher);
router.get("/publisherId/:publisherId", publisherControllers.getPublisherById);

router.put("/publisherId/:publisherId", publisherControllers.updatePublisher);
router.delete("/:publisherId", publisherControllers.deletePublisher);

module.exports = router;
