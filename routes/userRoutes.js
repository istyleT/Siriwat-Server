const express = require("express");
const router = express.Router();
const {
  getAllUser,
  updateUser,
  deleteUser,
  checkUser,
  updateMe,
  setNameimg,
  // setUserlevel,
  // uploadProfileImage,
  getAllSales,
} = require("../controllers/userController");
const {
  signup,
  // forgetPassword,
  // resetPassword,
  updatePassword,
  defalutPassword,
  setDefalutPassword,
  login,
  protect,
  restrictTo,
} = require("../controllers/authController");

// Authentication Routes
router.route("/login").post(login);
// router.route("/forgetpassword").post(forgetPassword);
// router.route("/resetpassword/:token").patch(resetPassword);
// router.route("/updatepassword").put(protect, updatePassword);

//Middleware Router After Authentication
// router.use(protect);

router.route("/").get(getAllUser);

// router.route("/updateme/:id").put(uploadProfileImage, setNameimg, updateMe);

// Middleware Router After this
// router.use(restrictTo("Owner", "GM", "Admin", "Manager", "Team-Lead"));

//เรียกข้อมูล user ที่เป็น sale ทั้งหมด
// router.route("/sale").get(getAllSales);

// ทำงานตอนสม้คร user ใหม่ว่ามี  username ซ้ำกับในระบบหรือไม่
router.route("/checkusername").get(checkUser);

//เพิ่ม user ใหม่
router.route("/signup").post(defalutPassword, signup);

// เปลี่ยน user password เป็น default
router.route("/defaultpassword/:id").put(defalutPassword, setDefalutPassword);

router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;
