const Bookings = require("../models/bookingModel");
const factory = require("./handlerFactory");

exports.setIDs = (req, res, next) => {
  req.body.user = req.user.id;
  req.body.table = req.params.tableId;

  next();
};

exports.createBooking = factory.createOne(Bookings);
