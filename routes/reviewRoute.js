// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const reviewController = require("../controllers/reviewController")

// New review request
router.post("/addReview", utilities.handleErrors(reviewController.addReview))


module.exports = router;