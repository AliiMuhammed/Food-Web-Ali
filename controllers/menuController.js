const Menu = require("../models/menuModel");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadItemPhotos = upload.single("photo");

exports.resizeItemPhotos = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `item-${req.user.id}-${Date.now()}.jpeg`;
  req.body.file = req.file.filename;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`upload/${req.file.filename}`);

  next();
});

exports.getAllItems = factory.getAll(Menu);

exports.getItem = factory.getOne(Menu);

exports.createItem = factory.createOne(Menu);

exports.updateItem = factory.updateOne(Menu);

exports.deleteItem = factory.deleteOne(Menu);
