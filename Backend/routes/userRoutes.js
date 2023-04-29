const express = require("express");
const authentication = require("../middleware/authentication");
const cookieParser = require("cookie-parser");
const {
    userRegistration,
    userLogin,
    userLogout,
    userProfile,
    editUser,
    getAllUsers,
    deleteUser,
} = require("../controllers/userController").default;

const router = express.Router();
router.use(cookieParser());
router.route("/register").post(userRegistration);
router.route("/login").post(userLogin);
router.route("/profile/:id").get(authentication, userProfile);
router.route("/editUser").put(authentication, editUser);
router.route("/getAllUsers").get(getAllUsers);
router.route("/deleteUser").delete(authentication, deleteUser);
router.route("/logout").post(userLogout);
// find single users
// edit profile
// find all users
// delete users
// user verification model
// node mailer

module.exports = router;