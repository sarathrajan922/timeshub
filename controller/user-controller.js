const userHelpers = require("../helpers/user-helpers");
const bcrypt = require("bcrypt");
const { validationResult, Result } = require("express-validator");
const twilio = require("../middleware/Twilio");

let err;
module.exports = {
  userHomePage: (req, res) => {
    res.render("user/user-home", { user: req.session.userPhone });
  },

  userLoginPage: function (req, res, next) {
    if (req.session.userPhone) {
      res.redirect("/");
    } else {
      const userNotFound = req.session.userNotFound;
      res.render("user/user-loginpage", {
        'blockErr': req.session.blockErr,
        'userNotFound': userNotFound,
      });
      req.session.userNotFound = false;
      req.session.blockErr = false;
    }
  },
  userSignUpPage: function (req, res) {
    let userAlready = req.session.userAlready;
    let validationErr = req.session.validationErr;

    res.render("user/user-signup", {
      userAlready: userAlready,
      validationErr: validationErr,
    });
  },
  userRegistration: async (req, res) => {
    console.log(req.body);
    let errors = validationResult(req);
    
    err = errors.errors;
    if (err.length == 0) {
      await userHelpers.userExist(req.body.email).then((status) => {
        if (status.length == 0) {
          const { email, password, phone, username } = req.body;
          // validation

          // password bycrpt
          bcrypt.hash(password, 10, async (err, hash) => {
            const obj = {
              name: username,
              email: email,
              password: hash,
              address: {},
              gender: null,
              phone: phone,
              active: true,
            };

            const dbData = await userHelpers.userRegister(obj);
          });

          res.redirect("/login");
        } else {
          // user already exist error message
          req.session.userAlready = true;
          res.redirect("/signup");
        }
      });
    } else {
      req.session.validationErr = true; //validation failed
      res.redirect("/signup");
    }
  },

  LoginSubmit: async (req, res, next) => {
    const { email, password } = req.body;
     await userHelpers.doLogin(email).then((data) => {
      console.log(data);

      if (data.length === 0) {
        req.session.userNotFound = true;
        res.redirect("/login"); //user not exist
      } else {
        if (data[0].active === false) {
          req.session.blockErr = "You have been blocked";
          res.redirect("/login"); //  user blocked by admin
        } else {
          var DBpass = data[0].password;
          /* bcrypt user loged password and compare  */
          bcrypt.compare(password, DBpass, (err, result) => {
            if (result) {
              /* validation */
              if (email === data[0].email) {
                req.session.userPhone = data[0].phone;
                req.session.user =  data[0]._id;
                res.redirect('/'); 
              }
            }
          });
        }
      }
    });
  },



  shoppingPage: async (req, res) => {
    await userHelpers.getProduct().then((result) => {
      res.render("user/shop-page", { array: result });
    });
  },

  mobileNoPage: (req, res) => {
    res.render("user/mobile-validation-page");
  },
  mobileNoVerification: async (req, res) => {
    const mobile = req.body.mobile
    console.log(mobile);
    await userHelpers.mobileExist(mobile).then((result)=>{
      if(result.length == 0){
        req.session.userNotFound = true;
        res.redirect("/login"); //user not exist
      }else{
        if (result[0].active === false) {
          req.session.blockErr = "You have been blocked";
          res.redirect("/login"); //  user blocked by admin
        }else{
          req.session.userPhone = mobile;
          req.session.user =  result[0]._id;
          // otp send code
          twilio.generateOpt(mobile).then((result) => {
            if (result)
              res.redirect("/otpValidate"); /*otp verification form  */
          });
        }

      }
    })
   
  },

  otpform : (req, res)=>{
    res.render('user/otp-verification-page')
  },

  otpverification :(req,res)=>{
     const otp = req.body.otp;
     const mobileNo = req.session.userPhone;
     twilio.verifyOtp(mobileNo, otp).then(() => {
      res.redirect("/");
     });

  },

  userLogout: (req, res) => {
    req.session.userPhone = null;
    res.redirect("/");
  },

  productFullView :  async(req, res)=>{
    const id = req.params.id;
    await userHelpers.viewProduct(id).then((data)=>{
      console.log(data);
        res.render('user/product-full-view', { array: data })
    })
   
  },

  viewCart : async (req, res)=>{
    const userId = req.session.user
    let cartItems =  await userHelpers.getCartProduct(userId)
      // console.log(cartItems);
      res.render('user/cart-page', {cartItems});
    
  },
   
  AddtoCart :  (req,res)=>{
    const productId = req.params.id;
   const  userId = req.session.user
    userHelpers.addtoCart(productId,userId).then(()=>{
      res.redirect('/shop');
    })

  }
};
