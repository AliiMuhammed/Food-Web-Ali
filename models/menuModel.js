const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      maxlength: [40, "A name must have less or equal than 40 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      maxlength: [
        300,
        "A description must have less or equal than 300 characters",
      ],
      minlength: [
        20,
        "A description must have more or equal than 20 characters",
      ],
      trim: true,
    },
    file: {
      type: String,
      required: [true, "A Menu must have a photo"],
    },
    category: {
      type: String,
      required: [true, "A Menu must relate to a Category"],
    },
    price: {
      type: Number,
      required: [true, "A Menu must have a price"],
    },
    allQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
