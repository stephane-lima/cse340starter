const utilities = require("../utilities/")
const reviewModel = require("../models/review-model")

const revConst = {}

revConst.addReview = async function (req, res) {
    let nav = await utilities.getNav()
    const { review_text, account_id, inv_id } = req.body
    console.log(req.body)
    console.log(inv_id)
    console.log(account_id)

    const regResult = await reviewModel.addReview(review_text, inv_id, account_id)

    if(regResult) {
        // req.flash(
        //     "notice",
        //     "The review was successfully added."
        // )
        res.render(`./account/account-management`, { 
            title: "Account Management",
            nav,
            errors: null,
        })
    } else {
        // req.flash(
        //     "notice",
        //     "sorry, the adition failed."
        // )
        res.redirect(`./inventory/vehicle-info/${inv_id}`)
    }
}

module.exports = revConst