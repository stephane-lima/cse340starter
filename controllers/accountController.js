// Needed Resources
const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    // req.flash("notice", "This is a flash message.")
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
    *  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration / Register new client
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
  
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
  
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

/* ****************************************
    *  Deliver account management view
* *************************************** */
async function buildAccountManagement (req, res, next) {
    const account_id = parseInt(req.params.account_id)
    console.log(account_id)
    let nav = await utilities.getNav()
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* ****************************************
    *  Deliver update account view
* *************************************** */
async function buildUpdateAccount (req, res, next) {
    const account_id = parseInt(req.params.account_id)
    console.log(account_id)
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountByAccountId(account_id)
    console.log(accountData) 
    res.render("./account/update-account", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id: accountData[0].account_id,
        account_firstname: accountData[0].account_firstname,
        account_lastname: accountData[0].account_lastname,
        account_email: accountData[0].account_email,
    })

}

/* ****************************************
*  Process account update / Update account
* *************************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
  
    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id,
    )
  
    if (updateResult) {
        req.flash(
            "notice",
            "Congratulations, your information has been updated."
        )
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/update-account", {
            title: "Edit Account",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}

/* ****************************************
*  Process Change Password
* *************************************** */
async function changePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the updating.')
        res.status(500).render("account/update-account", {
            title: "Edit Account",
            nav,
            errors: null,
        })
    }
  
    const changeResult = await accountModel.changePassword(
        hashedPassword,
        account_id
    )
  
    if (changeResult) {
        req.flash(
            "notice",
            "Congratulations, your information has been updated."
        )
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/update-account", {
            title: "Edit Account",
            nav,
            errors: null,
        })
    }
}

async function logout (req, res, next) {
    res.clearCookie("jwt")
    res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, updateAccount, changePassword, logout }