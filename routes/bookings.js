const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .post(bookingController.setIDs, bookingController.createBooking)
  .get(bookingController.getBookings);

router.patch("/:bookingID", bookingController.changeStatus);

module.exports = router;
