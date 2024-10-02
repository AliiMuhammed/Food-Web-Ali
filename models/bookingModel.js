const mongoose = require("mongoose");
const moment = require("moment-timezone");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a User"],
    },
    name: {
      type: String,
      required: [true, "Booking must belong to a User Name"],
    },
    phone: {
      type: Number,
    },
    numOfPersons: {
      type: Number,
    },
    status: {
      type: String,
      enum: {
        values: ["Confirmed", "Declined", "In-progress", "Ended"],
      },
      default: "In-progress",
    },
    time: {
      type: String,
      required: [true, "Booking must have a time"],
      validate: {
        validator: function (v) {
          return /\d{1,2}:\d{2} (AM|PM)/.test(v); // Validates time in o'clock format (e.g., "3:00 PM")
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    date: {
      type: Date,
      required: [true, "Booking must have a date"],
      get: (val) => {
        return new Intl.DateTimeFormat("en-US").format(val); // Formats date to MM/DD/YYYY
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

bookingSchema.methods.updateStatus = async function () {
  const now = new Date();

  const date = new Date(this.date);

  if (now > date) {
    this.status = "Ended";
  }

  await this.save();
};

// Populate the user details
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName email file phone _id",
  });

  next();
});

const Bookings = mongoose.model("Bookings", bookingSchema);

module.exports = Bookings;
