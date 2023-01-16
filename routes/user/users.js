const express = require("express");
const router = express.Router();
// var bcrypt = require("bcrypt");
const sessionCkeck = require("../../middleware/sessionHandler");
const userControl = require('../../controller/user-controller');
const validate = require('../../validations/userValidations');

/* user home page */
router.get("/", userControl.userHomePage);
/* user login page */
router.get("/login", userControl.userLoginPage);
/*user signup form */
router.get("/signup", userControl.userSignUpPage);
/*user submit the form data */
router.post("/register-submit",validate.userSignupValidate, userControl.userRegistration);
/*user login form submit */
router.post("/login-submit", userControl.LoginSubmit);
/*shopping page */
router.get("/shop", userControl.shoppingPage);
/*mobile verification form loading and verification  */
router.route('/mobile-validate').get(userControl.mobileNoPage).post(userControl.mobileNoVerification);
/*otp verification form loading and verification */
router.route('/otpValidate').get(userControl.otpform).post(userControl.otpverification);
/*user logout  */
router.get('/user-logout', userControl.userLogout);
/*product full view */
router.get('/product-full-view/:id', userControl.productFullView);
/*cart page  */
router.get('/view-cart', userControl.viewCart);
/*product add to the cart */
router.get('/add-to-cart/:id', userControl.AddtoCart)


module.exports = router;
