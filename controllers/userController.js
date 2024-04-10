const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const multer = require("multer");
// Middleware
//set upload image
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});
// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Not image Please upload", 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.setNameimg = (req, res, next) => {
  if (req.file) req.body.imageprofile = req.file.filename;
  next();
};
exports.uploadProfileImage = upload.single("imageprofile");

exports.updateMe = factory.updateOne(User);

//ตรวจสอบ user_id ว่าเป็น Role ไหน
exports.checkRoleUser = catchAsync(async (req, res, next) => {
  if (!req.query.user)
    res.status(400).json({ status: "fail", message: "Requset ไม่สมบรูณ์" });
  const user = await User.findById(req.query.user);
  req.user_role = user.role;
  next();
});

//เรียก user ทั้งหมดที่เป็น sale ทั้งหมด
exports.getAllSales = catchAsync(async (req, res, next) => {
  const sales = await User.find({ role: "Sale" });
  res.status(200).json({
    status: "success",
    results: sales.length,
    data: sales,
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const userlevel = req.body.userlevel;
  const queryString = { ...req.query };
  let user = {};
  switch (userlevel) {
    case 4:
      user = await User.find({ _id: { $ne: queryString.userid } });
      break;
    case 3:
      user = await User.find({
        branch: queryString.branch,
        _id: { $ne: queryString.userid },
      });
      break;
    case 2:
      user = await User.find({
        branch: queryString.branch,
        team: queryString.team,
        _id: { $ne: queryString.userid },
      });
      break;
    default:
      return next(new AppError("ไม่สามารถระบุระดับของ User ได้", 500));
  }

  res.status(200).json({
    status: "success",
    results: user.length,
    data: user,
  });
});
exports.checkUser = catchAsync(async (req, res, next) => {
  if (!req.query.username)
    return next(AppError("ไม่พบ username ที่ต้องการค้นหา", 400));
  username = req.query.username;
  const user = await User.find({ username: username });
  res.status(200).json({
    status: "success",
    results: user.length,
    data: user,
  });
});
exports.updateUser = factory.updateOne(User);

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false });
  if (!user) {
    return next(new AppError("ไม่ผู้ใช้งานที่ต้องการจะลบ", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
