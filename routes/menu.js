const express = require("express");
const menuController = require("../controllers/menuController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", menuController.getAllItems);

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin"),
    menuController.uploadItemPhotos,
    menuController.resizeItemPhotos,
    menuController.createItem
  );

router
  .route("/:id")
  .get(menuController.getItem)
  .patch(
    authController.restrictTo("admin"),
    menuController.uploadItemPhotos,
    menuController.resizeItemPhotos,
    menuController.updateItem
  )
  .delete(authController.restrictTo("admin"), menuController.deleteItem);

module.exports = router;
