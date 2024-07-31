const mongoose = require("mongoose");
const Table = require("./tablesModel"); // Assuming tableModel.js is the file containing the Table model

const bookingSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.ObjectId,
      ref: "Table",
      required: [true, "Booking must belong to a Table"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a User"],
    },
    numberOfTable: {
      type: Number,
      required: [true, "Number is required!"],
    },
    price: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

bookingSchema.index({ table: 1, user: 1 }, { unique: true });

// Pre-save hook to ensure table exists and set reserved to true
bookingSchema.pre("save", async function (next) {
  try {
    // Check if the table with numberOfTable exists
    const table = await Table.findOne({ numberOfTable: this.numberOfTable });

    if (!table) {
      return next(new Error("Table does not exist!"));
    }

    // Set the table ID and price in the booking
    this.table = table._id;
    this.price = table.price;

    // Set the reserved field to true
    table.reserved = true;
    await table.save();

    next();
  } catch (err) {
    next(err);
  }
});

// Pre-find hook to populate references
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "table",
    select: "_id numberOfTable numberOfChairs price",
  });

  this.populate({
    path: "user",
    select: "firstName lastName email file phone _id",
  });

  next();
});

const Bookings = mongoose.model("Bookings", bookingSchema);

module.exports = Bookings;
