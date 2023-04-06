const express = require("express");
const router = express.Router();
const sessionCkeck = require("../../middleware/sessionHandler");
const userControl = require('../../controller/user-controller');
const validate = require('../../validations/userValidations');
const { isUserExist } = require("../../middleware/sessionHandler");

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
router.get('/view-cart',sessionCkeck.isUserExist, userControl.viewCart);
/*product add to the cart */
router.get('/add-to-cart/:id',sessionCkeck.isUserExist, userControl.AddtoCart);
/*view wishlist */
router.get('/view-wishlist',sessionCkeck.isUserExist, userControl.viewWishlist)
/*add to wishlist */
router.get('/add-to-wishlist/:id',sessionCkeck.isUserExist, userControl.AddtoWishlist)
/*user account page */
router.get('/userAccount',sessionCkeck.isUserExist, userControl.userAccount);
/*user change the quantity of a product in the cart*/
router.post('/change-quantity',sessionCkeck.isUserExist, userControl.changeCartProductQuantity)
/*user delete the product from cart */
router.post('/delete-cartItem',sessionCkeck.isUserExist, userControl.deleteCartItem)
/*user address adding */
router.post('/address-add',sessionCkeck.isUserExist, userControl.addressAdd)
/*user address delete */
router.get('/address-delete/:id',sessionCkeck.isUserExist, userControl.addressDelete)
/*proceed to checkout page or order confirm page  ,place order and payment */
router.route('/proceed-to-checkout').get(sessionCkeck.isUserExist,userControl.proceedToCheckout).post(sessionCkeck.isUserExist,userControl.orderConfirm)
/*order success page */
router.get('/order-success-page',sessionCkeck.isUserExist, userControl.orderSuccessPage)
/*order canceled by user */
router.post('/order-cancel',sessionCkeck.isUserExist, userControl.orderCanceled)
/*verify payment */
router.post('/verify-payment',sessionCkeck.isUserExist,userControl.verifyPayment)
/*user edit user name */
router.post('/user-change-name',sessionCkeck.isUserExist,userControl.changeName)
/*download invoice */
router.post('/download-invoice',sessionCkeck.isUserExist,userControl.downloadInvoice)
/*view order details */
router.get('/view-orderDetails/:id',sessionCkeck.isUserExist, userControl.viewOrderDetails)
/* user delelte wishlist item */
router.post('/delete-wishlist-item',sessionCkeck.isUserExist, userControl.deleteWishlistItem)
/*view coupons*/
router.get('/view-coupons',sessionCkeck.isUserExist, userControl.viewCoupons)
/* user coupon submit */
router.post('/coupon-submit',sessionCkeck.isUserExist, userControl.couponSubmit)
/*user wallet  */
router.get('/userWallet',sessionCkeck.isUserExist, userControl.userWallet)
/*refund request */
router.post('/refundRequest',sessionCkeck.isUserExist, userControl.refundRequest)
/*check user wallet amount */
router.get('/check-wallet-amount',sessionCkeck.isUserExist, userControl.checkWalletBalance)
module.exports = router;
