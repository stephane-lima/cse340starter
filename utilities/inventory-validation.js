const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Add Vehicle Data Validation Rules
 * ********************************* */
validate.addVehicleRules = () => {
    return [
        // classification name is required
        body("classification_id")
            .trim()
            .isNumeric({ no_symbols: true })
            .withMessage("Please select a classification name."),

        // vehicle make is required
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide vehicle make."),

        // vehicle model is required
        body("inv_model")
            .trim()
            .isLength({ min: 2})
            .withMessage("Please provide vehicle model."),

        // vehicle description is required
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide vehicle description."),

        // vehicle image path is required
        body("inv_image")
            .trim()
            .isLength({ min: 1})
            .withMessage("Please provide image path"),

        // vehicle thumbnail path is required
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide thumbnail path."),

        // price is required
        body("inv_price")
            .trim()
            .isCurrency()
            .withMessage("Please provide vehicle price."),

        // year is required
        body("inv_year")
            .trim()
            .isInt({ min: 1880, max: `${new Date().getFullYear()}`})
            .withMessage("Please provide vehicle year"),

        // miles is required
        body("inv_miles")
            .trim()
            .isInt({ min: 0})
            .withMessage("Please provide vehicle miles"),

        // color is required
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide vehicle color"),       
    ]
}

/* ******************************
 * Check new vehicle data and return errors or continue to addition of vehicle
 * ***************************** */
validate.checkAddVehicleRules = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
        })
        return
    }
    next()
}

/*  **********************************
 *  Add Classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
    return [
        // classification name is required
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .isAlpha('en-US')
            .withMessage("Please provide classification name."),
    ]
}

/* ******************************
 * Check new classification data and return errors or continue to addition of classification name
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate
