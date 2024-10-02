const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const Bookings = require("../models/bookingModel");

// const Email = require("../utils/email");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(new AppError("No Document found with that ID", 404));
    }

    // Check if model.file is an array
    if (model.file && model.file !== "default.jpg") {
      const oldFilePath = `upload/${model.file}`;
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error(`Failed to delete old photo: ${err}`);
        }
      });
    }

    const doc = await Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(new AppError("No Document found with that ID", 404));
    }
    // console.log(req.file);
    // console.log(model);
    if (model.file && model.file !== "default.jpg") {
      const oldFilePath = `upload/${model.file}`;
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error(`Failed to delete old photo: ${err}`);
        }
      });
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: newDocument,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;
    // Course.findOne({ _id: req.params.id })

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET Materials on course
    let filter = {};
    let docs;
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let documents = await features.query;
    let totalPages;
    if (req.query.limit) {
      docs = await Model.find();
      totalPages = Math.ceil(docs.length / req.query.limit);
    } else {
      totalPages = 0;
      docs = 0;
    }
    // if (Model == Bookings) {
    //   documents = documents.map((booking) => {
    //     booking.updateStatus();
    //     return booking;
    //   });
    // }
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      totalDocs: docs.length,
      totalPages,
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });

exports.changeStatus = (Model) =>
  catchAsync(async (req, res, next) => {
    let url;
    const doc = await Model.findById(req.params.id);
    if (doc.active === true) {
      await Model.findByIdAndUpdate(req.params.id, { active: false });
    } else {
      await Model.findByIdAndUpdate(req.params.id, { active: true });
      if (doc.firstName) await new Email(doc, url).sendVerified();
    }

    res.status(201).json({
      status: "success",
    });
  });
