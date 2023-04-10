const userHelpers = require("../helpers/user-helpers");
const bcrypt = require("bcrypt");
const { validationResult, Result } = require("express-validator");
const twilio = require("../middleware/Twilio");
const razorpay = require("../middleware/razorPay");
const generateReport = require("../middleware/PDFgenerator");
const couponGenerator = require("../middleware/couponGenerate");
const ObjectId = require("mongodb").ObjectId;
const { response } = require("../app");
const session = require("express-session");
const { recentOrder } = require("../helpers/user-helpers");
const fs = require("fs");

let err;
module.exports = {
  /* user home page */
  userHomePage: async (req, res) => {
    try{
     
      const ip = req.ip
      await userHelpers.saveIPAddress(ip);
      res.render("user/user-home", { user: req.session.userPhone });
      
    }catch (err){
      console.log(err + "error while loading user home page")
      res.status(500).render('404')
    }
  },  
  /* user login page */
  userLoginPage: function (req, res, next) {
    try{ 
      if (req.session.userPhone) {
        res.redirect("/");
      } else {
        const userNotFound = req.session.userNotFound;
        res.render("user/user-loginpage", {
          blockErr: req.session.blockErr,
          userNotFound: userNotFound,
        });
        req.session.userNotFound = false;
        req.session.blockErr = false;
      }
    }catch (err){
      console.log(err + "error while loading login  page")
      res.status(500).render('404')
    }
  },
  /*user signup form */
  userSignUpPage: function (req, res) {
    try{
      
      let userAlready = req.session.userAlready;
      let validationErr = req.session.validationErr;
  
      res.render("user/user-signup", {
        userAlready: userAlready,
        validationErr: validationErr,
      });
    }catch (err){
      console.log(err + "error while loading signup page")
      res.status(500).render('404')
    }
  },
  /*user submit the form data */
  userRegistration: async (req, res) => {
    try{
      
      let errors = validationResult(req);
  
      err = errors.errors;
      if (err.length == 0) {
      let status =  await userHelpers.userExist(req.body.email)
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
  
               await userHelpers.userRegister(obj);
            });
  
            res.redirect("/login");
          } else {
            // user already exist error message
            req.session.userAlready = true;
            res.redirect("/signup");
          }
       
      } else {
        req.session.validationErr = true; //validation failed
        res.redirect("/signup");
      }
    }catch (err){
      console.log(err + "error while user registration")
      res.status(500).render('404')
    }
  },
  /*user login form submit */
  LoginSubmit: async (req, res, next) => {
    try{
      
      const { email, password } = req.body;
     let data =  await userHelpers.doLogin(email)
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
                  req.session.user = data[0]._id;
                  res.redirect("/");
                }
              }
            });
          }
        }
     
    }catch (err){
      console.log(err + "error while login submit")
      res.status(500).render('404')
    }
  },
  /*shopping page */
  shoppingPage: async (req, res) => {
    try{
      
    let result =  await userHelpers.getProduct()
        let india = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        });
        let productPrice = [];
        for (let i = 0; i < result.length; i++) {
          let newprice = india.format(result[i].price);
          productPrice.push(newprice);
        }
  
        let offerPrice = [];
        for (let i = 0; i < result.length; i++) {
          let newprice = india.format(result[i].discountprice);
          offerPrice.push(newprice);
        }
        res.render("user/user-shop", { array: result, productPrice, offerPrice });
      
    }catch (err){
      console.log(err + "error while loading shoping page")
      res.status(500).render('404')
    }
  },
  /*mobile verification form loading and verification  */
  mobileNoPage: (req, res) => {
    try{
      res.render("user/mobile-validation-page");
      
    }catch (err){
      console.log(err + "error while loading moblie number page")
      res.status(500).render('404')
    }
  },
  mobileNoVerification: async (req, res) => {
    try{
      
      let mobile = req.body.mobile;
  
     let result = await userHelpers.mobileExist(mobile)
        if (result.length == 0) {
          req.session.userNotFound = true;
          res.redirect("/login"); //user not exist
        } else {
          if (result[0].active === false) {
            req.session.blockErr = "You have been blocked";
            res.redirect("/login"); //  user blocked by admin
          } else {
            req.session.userPhone = mobile;
            req.session.user = result[0]._id;
            // otp send code
  
            twilio.generateOtp(mobile).then((result) => {
              if (result)
                res.redirect("/otpValidate"); /*otp verification form  */
            });
          }
        }
     
    }catch (err){
      console.log(err + "error while moblie verification")
      res.status(500).render('404')
    }
  },
  /*otp verification form loading and verification */
  otpform: (req, res) => {
    try{
      res.render("user/opt-verification");
      
    }catch (err){
      console.log(err + "error while loading otp form")
      res.status(500).render('404')
    }
  },
  otpverification: async (req, res) => {
    try{
  
      const { otp } = req.body;
  
      const pin = otp.join("");
  
      const mobileNo = req.session.userPhone;
      await twilio.verifyOtp(mobileNo, pin).then(() => {
        res.redirect("/");
      });
      
    }catch (err){
      console.log(err + "error while otp verification")
      res.status(500).render('404')
    }
  },
  /*user logout  */
  userLogout: (req, res) => {
    try{
      req.session.userPhone = null;
      res.redirect("/");
      
    }catch (err){
      console.log(err + "error while logout user")
      res.status(500).render('404')
    }
  },
  /*product full view */
  productFullView: async (req, res) => {
    try{
      const id = req.params.id;
      let data =  await userHelpers.viewProduct(id)
        let india = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        });
        let newprice = india.format(data[0].price);
  
     
  
        res.render("user/product-full-view", { array: data, newprice });
    
      
    }catch (err){
      console.log(err + "error while loading produt full view page")
      res.status(500).render('404')
    }
  },
  /*cart page  */
  viewCart: async (req, res) => {
    try{
      const userId = req.session.user;
      let cartItems = await userHelpers.getCartProduct(userId);
      let india = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      });
      const Gtotal = cartItems[0]?.total;
      const carId = cartItems[0]?._id;
      const total = india.format(cartItems[0]?.total);
  
      cartItems = cartItems[0]?.products;
      let price = [];
      let subtotals = [];
      for (let i = 0; i < cartItems?.length; i++) {
        let newprice = india.format(cartItems[i].product_price);
        let subtotal = india.format(cartItems[i].subtotal);
        price.push(newprice);
        subtotals.push(subtotal);
      }
  
      let coupons = await userHelpers.getUserCoupons(userId);
  
      res.render("user/cart-page", {
        cartItems,
        carId,
        userId,
        total,
        price,
        subtotals,
        Gtotal,
        coupons,
      });
    }catch (err){
      console.log(err + "error while loading view cart page")
      res.status(500).render('404')
    }
  },
  /*product add to the cart */
  AddtoCart: (req, res) => {
    try{
      const productId = req.params.id;
      const userId = req.session.user;
      userHelpers.addtoCart(productId, userId).then((response) => {
        res.json({ status: true });
      });
      
    }catch (err){
      console.log(err + "error while add to cart")
      res.status(500).render('404')
    }
  },
  /*user account page */
  userAccount: async (req, res) => {
    try{
      
      let india = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      });
  
     let response = await userHelpers.getAddress(req.session.user)
        const { address, userDetails, orderDetails } = response;
  
        let ordertotal = [];
        for (let i = 0; i < orderDetails.length; i++) {
          let val = india.format(orderDetails[i].total);
          ordertotal.push(val);
        }
  
        res.render("user/user-account-page", {
          address: address,
          userData: userDetails,
          orderDetails: orderDetails,
          ordertotal,
        });
      
    }catch (err){
      console.log(err + "error while loading user Account page")
      res.status(500).render('404')
    }
  },
  /*user change the quantity of a product in the cart*/
  changeCartProductQuantity:  (req, res) => {
    try{
      
      let { i } = req.body;
      userHelpers.changeCartQuantity(req.body).then(async (response) => {
        response.total = await userHelpers.findTotalAmout(req.body.userId); 
        // response.subtotal = subtotal
        res.json(response);
      });
    }catch (err){
      console.log(err + "error while changeCart Product Quantity")
      res.status(500).render('404')
    }
  },
  /*user delete the product from cart */
  deleteCartItem: async (req, res) => {
    try{
     await userHelpers.deleteCartItem(req.body)
        res.json({ status: true }); 
    }catch (err){
      console.log(err + "error while deleteCart")
      res.status(500).render('404')
    }
  },
  /*user address adding */
  addressAdd: async (req, res) => {
    try{
      
      req.body.userId = req.session.user;
      
      const {from } = req.query
     
     
  
    let response = await  userHelpers.addressAdd(req.body)
    
        if (response) {
          if(from === 'Home'){
            res.redirect("/userAccount");
          }else{
            res.redirect('/proceed-to-checkout')
          }
        }
   
    }catch (err){
      console.log(err + "error while address add")
      res.status(500).render('404')
    }
  },
  /*user address delete */
  addressDelete: (req, res) => {
    const addressId = req.params.id;
    userHelpers.addressDelete(addressId).then((response) => {
      if (response) {
        res.redirect("/userAccount");
      }
    });
  },
  /*proceed to checkout page or order confirm page  */
  proceedToCheckout: async (req, res) => {
    try{
      let india = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      });
      const userId = req.session.user;
      let walletAmount = await userHelpers.getWallet(userId)
      walletAmount = india.format(walletAmount[0]?.amount)
      let cartItems = await userHelpers.getCartProduct(userId);
      const carId = cartItems[0]._id;
      const total = india.format(cartItems[0].total);
      const GrandTotal = india.format(req.session.discountPrice);
  
      cartItems = cartItems[0].products;
      let price = [];
      let subtotals = [];
      for (let i = 0; i < cartItems.length; i++) {
        let newprice = india.format(cartItems[i].product_price);
        let subtotal = india.format(cartItems[i].subtotal);
        price.push(newprice);
        subtotals.push(subtotal);
      }
  
      userHelpers.getAddress(userId).then((response) => {
        const { address, userDetails } = response;
  
        res.render("user/order-confirm-page", {
          address: address,
          userData: userDetails,
          cartItems,
          carId,
          userId,
          GrandTotal,
          price,
          subtotals,
          walletAmount,
          total : cartItems[0].total,
          Dtotal: req.session.discountPrice
        });
      });
    }catch (err){
      console.log("Error while loading prodceed to checkout page")
      res.status(500).render('404')
    }
  },
  /*place order and payment */
  orderConfirm: async (req, res) => {
    let { address, payment } = req.body;
    const userId = req.session.user;

    
   
    let cartItems = await userHelpers.getCartProduct(userId);

    let total = cartItems[0]?.total;
    cartItems = cartItems[0]?.products;

    if (req.session.discountPrice) {
      total = req.session.discountPrice;

    }else{
      req.session.couponCode = null
    }

    //change coupon status

    if(req.session.couponCode){
      let code = req.session.couponCode;
      await userHelpers.changeCouponStatus(code)
    }

    const obj = {
      userId: userId,
      address: ObjectId(address),
      paymentMethod: payment,
      total: total,
      items: cartItems.length,
      status : 'placed',
      products: cartItems,
      date: new Date()
    };
  
    let result = await userHelpers.orderRecords(obj);
    if (result) {
      req.session.recentOrderId = result.insertedId;
      if (payment === "COD") {
        let userId = req.session.user;

        //coupon creation
        await couponGenerator.couponGenerator(userId);
        res.json({ status: "COD", coupon: true });
        // res.redirect('/order-success-page')
      } else if(payment === 'UPI'){
        // res.json({status: 'UPI'})
        let totalAmout = parseInt(total);
        razorpay
          .generateRazorPay(req.session.recentOrderId, totalAmout)
          .then(async (order) => {
            let userId = req.session.user;
            //coupon creation
            await couponGenerator.couponGenerator(userId);
            res.json({ order, status: "UPI", coupon: true });
          });
      }else if(payment === 'WALLET'){
         let totalAmount = parseInt(total)
         let userId = req.session.user
        //wallet authentication and query

        let result = await userHelpers.WalletCheck(userId , totalAmount)
        if(result.status){
          result.status = 'WALLET'
          await couponGenerator.couponGenerator(userId);
          res.status(200).json(result)
        }else{
          res.status(403).json(result)
        }

      }

      // res.redirect('/order-success-page')
    
  }
  },
  /*order success page  */
  orderSuccessPage: async (req, res) => {
    let india = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });

    let orderId = req.session.recentOrderId;
    let GrandTotal = india.format(req.session.discountPrice);
    req.session.discountPrice = null
    

    let recentOrder = await userHelpers.recentOrder(orderId);

    let Date = recentOrder[0].date;
    let subtotal = india.format(recentOrder[0].total);
    let total = subtotal;
    let items = recentOrder[0].items;
    let orderIds = recentOrder[0]._id;
    res.render("user/order-success-page", {
      Date,
      subtotal,
      GrandTotal,
      items,
      orderIds,
    });
  },
  /*order canceled by user */
  orderCanceled: (req, res) => {
    const { orderId} = req.body

   
    userHelpers.orderStatus(orderId).then((response) => {
      if (response) {
        res.json({ status: true });
      }
    });
  },
/*verify payment */
  verifyPayment: (req, res) => {


    userHelpers
      .verifypayment(req.body)
      .then(() => {
        userHelpers.changePaymentStatus(req.session.recentOrderId).then(() => {
         
          res.json({ status: true });
        });
      })
      .catch((err) => {
        res.json({ status: false });
      });
  },
/*user change name */
  changeName: async (req, res) => {
    const userId = req.body.id;
    const newName = req.body.newName;
  

    let result = await userHelpers.changeName(userId, newName);
    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  },
/*dowmload order invoice */
  downloadInvoice: async (req, res) => {
    const { format, orderId } = req.body;
    // Check if format field is present
    if (!format) {
      return res.status(400).send("Format field is required");
    }
    // Generate the sales report using your e-commerce data
    let recentOrder;
    try {
      recentOrder = await userHelpers.recentOrder(orderId);
    } catch (err) {
    
      return res.status(500).send("Error calculating sales data");
    }
    try {
      // Convert the report into the selected file format and get the name of the generated file
      const reportFile = await generateReport(format, recentOrder, "invoice");
    
      // Set content type and file extension based on format
      let contentType, fileExtension;
      if (format === "pdf") {
        contentType = "application/pdf";
        fileExtension = "pdf";
      } else if (format === "excel") {
       
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileExtension = "xlsx";
      } else {
        return res.status(400).send("Invalid format specified");
      }
      // Send the report back to the client and download it
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice.${fileExtension}`
      );
      res.setHeader("Content-Type", contentType);
      const fileStream = fs.createReadStream(reportFile);
      fileStream.pipe(res);
      fileStream.on("end", () => {
        
        // Remove the file from the server
        fs.unlink(reportFile, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          }
        });
      });
    } catch (err) {
      console.log("Error generating report:", err);
      return res.status(500).send("Error generating report");
    }
  },
/* view order details*/
  viewOrderDetails: async (req, res) => {
    let orderId = req.params.id;
    let orderDet = await userHelpers.getOrderDetails(orderId);

    let userId = orderDet[0].userId.toString();
    let addressId = orderDet[0].address.toString();
    let userDetails = await userHelpers.getUserDetails(userId);
    let addressDetails = await userHelpers.getOrderAddress(addressId);

 
    let product = orderDet[0].products;
 

    // ajax response here
    res.json({ product, addressDetails, orderDet });
    // res.render('admin/singleOrderDetails',{product, addressDetails, orderDetails })
  },
/* view wishlist */
  viewWishlist: async (req, res) => {
    let userId = req.session.user;
    let result = await userHelpers.getWishList(userId);

    let products = result[0]?.productDetails;

    let india = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });

    let price = [];
    for (let i = 0; i < products?.length; i++) {
      let newprice = india.format(products[i]?.price);
      price.push(newprice);
    }

    res.render("user/wishlist", { products, price });
  },
/* product added to wishlist */
  AddtoWishlist: async (req, res) => {
    let productId = req.params.id;
    let userId = req.session.user;

  

    await userHelpers.AddtoWishlist(productId, userId);

    res.json({ status: true });
  },
/* delete wishlist item */
  deleteWishlistItem: async (req, res) => {
    const { proId } = req.body;
    const userId = req.session.user;

    await userHelpers.deleteWishlistItem(proId, userId);
    res.json({ status: true });
  },
/* view coupons  */
  viewCoupons: async (req, res) => {
    // render user coupons page
    const userId = req.session.user;
    const result = await userHelpers.getUserCoupons(userId);

    res.render("user/user-coupons", { result });
  },
/* user appied coupon */
  couponSubmit: async (req, res) => {
    const userId = req.session.user;
    const { couponCode, total } = req.body;
    //coupon code check valid or not
    let result = await userHelpers.checkCoupon(couponCode, userId);
    if (!result) {
      res.json({ status: "Invalid Coupon" });
    } else {
   

      let { percentage } = result;
      let amount = (total / 100) * percentage;
      // let amount = (total * percentage)/100;
      amount = total - amount;
      req.session.discountPrice = amount;
      req.session.couponCode = couponCode

      let india = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      });

      amount = india.format(amount);

      res.json({
        status: percentage + "%  Applied",
        amount,
      });
    }
  },
  /* view wallet */
  userWallet: async(req,res)=>{
    let india = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });

    const userId = req.session.user
    let userWallet = await userHelpers.userWallet(userId)
  
    
    const amount = india.format(userWallet[0]?.amount)
    const transaction = userWallet[0]?.Transaction
    
    let total = []
    for(let i=0; i < transaction?.length ; i++){
     let price = india.format(transaction[i]?.amount)
     total.push(price)
    }
    let transactionDates = []

     for(let j=0; j < transaction?.length; j++){
      let date = new Date(transaction[j]?.date);

    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

// Convert 24-hour time to 12-hour time
  let shortHours = hours % 12;
  shortHours = shortHours ? shortHours : 12; // Handle midnight (0:00) and noon (12:00)

  const shortForm = `${month}/${day}/${year}, ${shortHours}:${minutes} ${ampm}`;
  transactionDates.push(shortForm)

   }
   

  

    res.render('user/userWallet',{amount, transaction,total , date : transactionDates})
  },

  /*refund request */
  refundRequest : async (req,res)=>{
  

    const {orderId, amount }= req.body
    const userId = req.session.user
    const obj = {
      userId,
      orderId,
      amount,
      status : 'pending'
    }

   await userHelpers.refundRequest(obj)
   
    res.json({status :true})
   


  },

  checkWalletBalance : async (req,res)=>{
    const userId = req.session.user

    let walletData = await userHelpers.getWallet(userId)
    if(walletData?.length){
      res.json({status : true, Balance : walletData[0]?.amount})
    }else{
      res.json({status : false})
    }


  }
  
};
