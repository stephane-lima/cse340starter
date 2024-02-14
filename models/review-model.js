const pool = require("../database/index")

// Add new review
async function addReview(review_text, inv_id, account_id) {
    try {
        const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
        return pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
        return error.message
    }
}

// Retrieve reviews based on account_id
async function getReviewByAccountId(account_id) {
    try {
        const data = await pool.query("SELECT inv_year, inv_make, inv_model, review_id, TO_CHAR(review_date, 'Month DD, YYYY') AS review_date FROM inventory JOIN review ON inventory.inv_id = review.inv_id WHERE review.account_id = $1", [account_id])
        return data.rows
    } catch {
        return new Error("No matching account id found")
    }
}

module.exports = { addReview, getReviewByAccountId }