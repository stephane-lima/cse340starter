const utilities = require(".")
const reviewModel = require("../models/review-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add Review Data Validation Rules
 * ********************************* */
validate.addReviewRules = () => {
    return [
        // review text is required
        body("review_text")
            .trim()
            .isLength({ min: 1 })
            .withMessage("the review text is required.")
    ]
}

validate.checkAddReviewRules = async (req, res, next) => {
    const { review_text, inv_id, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.redirect(`/inv/detail/${inv_id}`)
        return
    }
    next()
}

/* ******************************
 * Check update data and return errors or continue to update the review
 * ***************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
    const { review_text, review_id, review_date } = req.body
    console.log(req.body)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const reviewData = await reviewModel.getReviewByReviewId(review_id)
        const itemName = `${reviewData[0].inv_year} ${reviewData[0].inv_make} ${reviewData[0].inv_model}`
        res.render("./review/edit-review", {
            title: "Edit " + itemName + " Review",
            errors: null,
            nav,
            review_text,
            review_id,
            review_date,
        })
        return
    }
    next()
}

module.exports = validate