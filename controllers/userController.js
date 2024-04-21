const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
// Middleware

exports.updateMe = factory.updateOne(User);

//ตรวจสอบ user_id ว่าเป็น Role ไหน
exports.checkRoleUser = catchAsync(async (req, res, next) => {
  if (!req.query.user)
    res.status(400).json({ status: "fail", message: "Requset ไม่สมบรูณ์" });
  const user = await User.findById(req.query.user);
  req.user_role = user.role;
  next();
});

exports.getAllUser = factory.getAll(User);

//ใช้ต้อน
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
