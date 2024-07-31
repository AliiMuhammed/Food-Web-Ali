const express = require("express");
const tableController = require("../controllers/tableController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", tableController.getAllTables);

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin"),
    tableController.createTable
  );

router
  .route("/:id")
  .get(tableController.getTable)
  .patch(
    authController.restrictTo("admin"),
    tableController.updateTable
  )
  .delete(authController.restrictTo("admin"), tableController.deleteTable);

module.exports = router;
