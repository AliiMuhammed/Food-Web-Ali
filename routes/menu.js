const express = require("express");
const menuController = require("../controllers/menuController");
const authController = require("../controllers/authController");
const uploadToCloudinary = require("../middlewares/uploadToCloudinary");
const detailsRouter = require("../routes/addDetails");
const multer = require("multer");

const router = express.Router();

router.get("/", menuController.getAllItems);

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin"),
    menuController.uploadItemPhotos,
    menuController.resizeItemPhotos,
    uploadToCloudinary,
    menuController.createItem
  )

router
  .route("/:id")
  .get(menuController.getItem)
  .patch(
    authController.restrictTo("admin"),
    menuController.uploadItemPhotos,
    menuController.resizeItemPhotos,
    uploadToCloudinary,
    menuController.updateItem
  )
  .delete(
    authController.restrictTo("admin"),
    menuController.deleteItem
  );

module.exports = router;
