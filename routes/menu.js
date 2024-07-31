const express = require("express");
const menuController = require("../controllers/menuController");
const authController = require("../controllers/authController");
const upload = require("../middlewares/uploadFiles");

const router = express.Router();

router.get("/", menuController.getAllItems);

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin"),
    upload.single("image"),
    menuController.createItem
  )

router
  .route("/:id")
  .get(menuController.getItem)
  .patch(
    authController.restrictTo("admin"),
    upload.single("image"),
menuController.updateItem
  )
  .delete(
    authController.restrictTo("admin"),
    menuController.deleteItem
  );

module.exports = router;
