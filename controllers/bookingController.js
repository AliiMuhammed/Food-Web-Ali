const Bookings = require("../models/bookingModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.setIDs = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

exports.createBooking = factory.createOne(Bookings);

exports.getBookings = factory.getAll(Bookings);

exports.changeStatus = catchAsync(async (req, res, next) => {
  if (req.body.status === "accepted") {
    await Bookings.findByIdAndUpdate(req.params.bookingID, {
      status: "Confirmed",
    });
  } else {
    await Bookings.findByIdAndUpdate(req.params.bookingID, {
      status: "Declined",
    });
  }

  res.status(201).json({
    status: "success",
  });
});
