const invModel = require("../models/inventory-model")
const invModel1 = require("../models/inventory-model")

const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by vehicle info view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel1.getVehicleInfoByInventoryId(inventory_id)
    const grid = await utilities.buildVehicleInfoGrid(data)
    let nav = await utilities.getNav()
    const invYear = data[0].inv_year
    const invMake = data[0].inv_make
    const invModel = data[0].inv_model
    res.render("./inventory/vehicle-info", {
        title: invYear + " " + invMake + " " + invModel,
        nav,
        grid,
    })
}

/* ***************************
 *  Build vehicle management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Build add vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let selectList = await utilities.selectList()
    res.render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        selectList,
        errors: null,
    })
}

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.registerClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const regResult = await invModel.registerClassification(classification_name)

    if (regResult) {
        nav = await utilities.getNav()
        req.flash(
            "notice",
            `The ${classification_name} classification was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        req.flash(
            "notice",
            "Sorry, the registration failed."
        )
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
        })
    }
}

/* ****************************************
*  Process New Classification
* *************************************** */
invCont.registerVehicle = async function (req, res) {
    let nav = await utilities.getNav()
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

    const regResult = await invModel.registerVehicle(
        classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color
    )

    if (regResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        req.flash(
            "notice",
            "Sorry, the registration failed."
        )
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
        })
    }
} 

module.exports = invCont