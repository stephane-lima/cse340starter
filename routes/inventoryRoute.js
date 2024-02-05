// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle details by vehicle details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildVehicleManagement))

// Route to build add classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))

// Process the new classification data
router.post(
    "/addClassification",
    regValidate.addClassificationRules(),
    regValidate.checkAddClassificationData, 
    utilities.handleErrors(invController.registerClassification))

// Route to build add vehicle view
router.get("/addVehicle", utilities.handleErrors(invController.buildAddVehicle))

// Process the new vehicle data
router.post(
    "/addVehicle",
    regValidate.addVehicleRules(),
    regValidate.checkAddVehicleRules,
    utilities.handleErrors(invController.registerVehicle))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to build the update view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// 500 Error Route
router.get("/broken", utilities.handleErrors(baseController.buildFooter))

module.exports = router;

