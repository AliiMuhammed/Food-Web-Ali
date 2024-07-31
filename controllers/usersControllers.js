const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");
const fs = require("fs");

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

exports.uploadUserPhoto = upload.single("image");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`upload/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /UpdateMyPassword.",
        400
      )
    );
  }
  const user = await User.findById(req.user.id);

  if (user.file && user.file !== "default.png") {
    const oldFilePath = `upload/${user.file}`;
    fs.unlink(oldFilePath, (err) => {
      if (err) {
        console.error(`Failed to delete old photo: ${err}`);
      }
    });
  }

  const filterdBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "file",
    "phone"
  );
  if (req.file) filterdBody.file = req.file.filename;

  //2) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.changeStatus = factory.changeStatus(User);

exports.deleteUser = factory.deleteOne(User);

// Don't update the user Password
exports.updateUser = factory.updateOne(User);

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);
