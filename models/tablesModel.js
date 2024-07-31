const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    numberOfTable: {
      type: Number,
      required: [true, "Number is required!"],
      unique: true,
    },
    numberOfChairs: {
      type: String,
      required: [true, "A Table must relate to a Number of chairs"],
    },
    price: {
      type: Number,
      required: [true, "A Table must have a price"],
    },
    reserved: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
