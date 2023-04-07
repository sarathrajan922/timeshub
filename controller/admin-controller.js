const db = require("../config/connection");
const collections = require("../config/collections");
const adminHelpers = require("../helpers/admin-helpers");
const generateReport = require("../middleware/PDFgenerator");
const fs = require("fs");
const { response } = require("../app");

// const cloudinary = require('../image-controller/cloudinary')

module.exports = {
  /* admin login page */
  adminLoginpage: (req, res, next) => {
    try {
      if (req.session.admin) {
        res.redirect("/admin/dashboard");
      } else {
        res.render("admin/admin-loginpage");
      }
    }catch (err) {
      console.log(err, "error while admin login");
      res.status(500).render('404');
    }
  },
  /*admin login form submit  */
  adminHome: async (req, res, next) => {
    try{
      const { email, password } = req.body;

      const AdminEmail = process.env.ADMIN_EMAIL
      const AdminPassword = process.env.ADMIN_PASSWORD

      if(AdminEmail === email && AdminPassword === password){
        req.session.admin = true;
        res.redirect("/admin/dashboard");
      }else{
        res.redirect("/admin");
      }


      // let result = await adminHelpers.adminLogin(email)
      //   if (!result) {
      //     console.log("email not exist");
      //     res.redirect("/admin");
      //   } else {
      //     if (result[0]?.email === email && result[0]?.password === password) {
      //       req.session.admin = true;
      //       res.redirect("/admin/dashboard");
      //     }
      //   }
    }catch (err){
      console.log(err, "error while loading admin home page")
      res.status(500).render('404')
    }
   
 
  },
  /* admin home page */
  dashboard: async (req, res, next) => {

    try{
      if (req.session.admin) {
        let india = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        });
  
        let allorders = await adminHelpers.getAllOrders();
  
        console.log(allorders);
        let totalRevenue = india.format(allorders[0]?.totalValue);
        let orderCount = allorders[0]?.orderCount;
        let productCount = allorders[0]?.productCount;
  
        res.render("admin/admin-home", {
          totalRevenue,
          orderCount,
          productCount,
        });
      } else {
        res.redirect("/admin");
      }

    }catch (err){
      console.log(err, "error while loading admin home page")
      res.status(500).render('404')
    }
  },
  /* admin product page */
  productPage: async(req, res, next) => {
    try{

    let product = await  adminHelpers.getProduct()
        let india = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        });
        let productPrice = [];
        for (let i = 0; i < product.length; i++) {
          let newprice = india.format(product[i].price);
          productPrice.push(newprice);
        }
  
        res.render("admin/admin-product", { array: product, productPrice });
     
    }catch (err){
      console.log(err, "error while loading admin product page")
      res.status(500).render('404')
    }
  },
  /* admin user-management page */
  userManagementPage: async (req, res, next) => {
    try{

      let result = await adminHelpers.getAllUsers()
        res.render("admin/admin-user-mange", { array: result });
     
    }catch (err){
      console.log(err, "error while loading user mangement  page")
      res.status(500).render('404')
    }
  },
  /*admin add product */
  addProductpage: async (req, res, next) => {
    try{
      let result = await adminHelpers.categoryList();
      res.render("admin/admin-addproduct", { array: result });
    }catch (err){
      console.log(err, "error while loading add product page")
      res.status(500).render('404')
    }
  },

  /* admin product form submit */
  productFormSubmit: async (req, res, next) => {
    try{
      console.log(req.files);
      await adminHelpers.addProduct(req.body, req.files);
  
      res.redirect("/admin/adminproduct");

    }catch (err){
      console.log(err, "error while submitting product form")
      res.status(500).render('404')
    }
  },
  /* product edit */
  productEdit: async (req, res, next) => {
    try{

      let id = req.params.id;
      let data = await  adminHelpers.editProduct(id)
        const { document, category } = data;
        res.render("admin/product-edit", { array: document, category: category });
     
    }catch (err){
      console.log(err, "error while product editing  page")
      res.status(500).render('404')
    }
  },
  /* product update */
  productUpdate: async (req, res, next) => {
    try{
      const id = req.params.id;
      const obj = {
        productname: req.body.productname,
        description: req.body.description,
        model: req.body.model,
        price: parseFloat(req.body.price),
        category: req.body.category,
      };
  
  
     let status = await adminHelpers.upDateProduct(id, obj)
        if (status == "error") {
          res.send("errror");
        } else {
          res.redirect("/admin/adminproduct");
        }
     
    }catch (err){
      console.log(err, "error while product update")
      res.status(500).render('404')
    }
  },
  /* product delete */
  productDelete: async (req, res) => {
    try{

      let { id } = req.body;
    let status =   await adminHelpers.deleteProduct(id)
        if (status == "delete success") {
          res.json({ status: true });
        }
     
    }catch (err){
      console.log(err, "error while product delete")
      res.status(500).render('404')
    }
  },
  /*user block  */
  userBlock: async (req, res) => {
    try{

      let id = req.params.id;
      await adminHelpers.block(id)
        res.json({ status: true });
    
    }catch (err){
      console.log(err, "error while user blocking")
      res.status(500).render('404')
    }
  },
  /*user unblock */
  userUnBlock: async (req, res) => {
    try{

      let id = req.params.id;
  
       await adminHelpers.unBlock(id)
        res.redirect("/admin/adminuser");
     
    }catch (err){
      console.log(err, "error while unblocking")
      res.status(500).render('404')
    }
  },
  /*admin category mangement */
  allCategory: async (req, res) => {
    try{
    let data =   await adminHelpers.getAllCategory()
        //data include array of all item by category
        const { Digital, Dress, GMT, Ladies, Smart, Pilot, Dive } = data;
        res.render("admin/admin-category", {
          Digital,
          Dress,
          GMT,
          Ladies,
          Smart,
          Pilot,
          Dive,
        });
     
    }catch (err){
      console.log(err, "error while loading all category page")
      res.status(500).render('404')
    }
  },
  /*create category */
  addCategorypage: async (req, res) => {
    try{

    let result =   await adminHelpers.categoryList()
        res.render("admin/admin-add-category", { array: result });
      
    }catch (err){
      console.log(err, "error while adding category")
      res.status(500).render('404')
    }
  },

  addCategory: async (req, res) => {
    try{
      
      await adminHelpers.addCategory(req.body)
        res.redirect("/admin/create-category");
      
    }catch (err){
      console.log(err, "error while adding category")
      res.status(500).render('404')
    }
  },
  /*category delete */
  deleteCategory: async (req, res) => {
    try{

      const id = req.params.id;
      await adminHelpers.deleteCategory(id)
        res.json({ status: true });
      
    }catch (err){
      console.log(err, "error while  delete")
      res.status(500).render('404')
    }
  },
  /*admin logout */
  adminLogout: (req, res) => {
    try{
      req.session.admin = null;
      res.redirect("/admin");
    }catch (err){
      console.log(err, "error while logout admin")
      res.status(500).render('404')
    }
  },
  /*admin order list view */
  adminOrderDetails: async (req, res) => {
    try{

     let response = await adminHelpers.orderList()
        // const names = adminHelpers.getAllNames(response)
  
        let india = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        });
        let totalAmounts = [];
        for (let i = 0; i < response.length; i++) {
          let newprice = india.format(response[i].total);
          totalAmounts.push(newprice);
        }
        res.render("admin/order-details", { orderList: response, totalAmounts });
     
    }catch (err){
      console.log(err, "error while loading admin  order Details page")
      res.status(500).render('404')
    }
  },

  viewOrderDetails: async (req, res) => {
    try{

      let orderId = req.params.id;
      let orderDetails = await adminHelpers.getOrderDetails(orderId);
      console.log('orderDetails')
      console.log(orderDetails)
  
      let userId = orderDetails[0].userId.toString();
      let addressId = orderDetails[0].address.toString();
      let userDetails = await adminHelpers.getUserDetails(userId);
      let addressDetails = await adminHelpers.getAddress(addressId);
  
      
      let product = orderDetails[0].products;
      console.log(userDetails);
      console.log(addressDetails);
  
      console.log(orderDetails[0].products);
  
      res.render("admin/singleOrderDetails", {
        product,
        addressDetails,
        orderDetails,
        orderId
      });
    }catch (err){
      console.log(err, "error while view order Details")
      res.status(500).render('404')
    }
  },

  changeStatus: async (req, res) => {
    try{

      const status = req.body.status;
      const orderId = req.body.id;
  
      let response = await adminHelpers.changeStatus(orderId, status);
      if (response) {
        res.json({ status: response.status });
      }
    }catch (err){
      console.log(err, "error while changeStatus")
      res.status(500).render('404')
    }
  },

  downloadReport: async (req, res) => {
    
    const { format } = req.body;
    let india = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });
    // Check if format field is present
    if (!format) {
      return res.status(400).send("Format field is required");
    }
    // Generate the sales report using your e-commerce data
    let allorders;
    try {
      allorders = await adminHelpers.getAllOrders();

      console.log(allorders);
      let totalRevenue = india.format(allorders[0].totalValue);
      let orderCount = allorders[0].orderCount;
      let productCount = allorders[0].productCount;
    } catch (err) {
      console.log("Error calculating sales data:", err);
      return res.status(500).send("Error calculating sales data");
    }
    try {
      // Convert the report into the selected file format and get the name of the generated file
      const reportFile = await generateReport(format, allorders, "report");
      console.log(reportFile);
      // Set content type and file extension based on format
      let contentType, fileExtension;
      if (format === "pdf") {
        contentType = "application/pdf";
        fileExtension = "pdf";
      } else if (format === "excel") {
        console.log("proper format");
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
        console.log("File sent successfully!");
        // Remove the file from the server
        fs.unlink(reportFile, (err) => {
          if (err) {
            console.log("Error deleting file:", err);
          } else {
            console.log("File deleted successfully!");
          }
        });
      });
    } catch (err) {
      console.log("Error generating report:", err);
      return res.status(500).send("Error generating report");
    }
  },

  getOfferPage: async (req, res) => {
    try{
      // full categoryList
      let categoryList = await adminHelpers.categoryList();
      // full productList
      let productList = await adminHelpers.getProductName();
      res.render("admin/admin-offer-page", { productList, categoryList });
    }catch (err){
      console.log(err, "error while loading offer page")
      res.status(500).render('404')
    }
  },

  categoryOfferSubmit: async (req, res) => {
    try{

      const { category, discountPercentage } = req.body;
      await adminHelpers.applyCatgeoryOffer(category, discountPercentage);
  
      console.log("offer applied successfully");
  
      res.redirect("/admin/add-offer");
    }catch (err){
      console.log(err, "error while loading category offer submiting")
      res.status(500).render('404')
    }
  },

  productOfferSubmit: async (req, res) => {
    try{

      const { product, discountPercentage } = req.body;
  
      await adminHelpers.applyProductOffer(product, discountPercentage);
  
      console.log("product offer applied successfully");
      res.redirect("/admin/add-offer");
    }catch (err){
      console.log(err, "error while product offer submiting")
      res.status(500).render('404')
    }
  },

  createCoupon: (req, res) => {
    try{
      // view coupon form to the admin
      res.render("admin/admin-coupon");
    }catch (err){
      console.log(err, "error while loading create Coupon page")
      res.status(500).render('404')
    }
  },

  couponSubmit: async (req, res) => {
    try{
      // when admin coupon form submit
  
      const { title, description, percentage, price_Limit, model } = req.body;
      const obj = {
        title,
        description,
        percentage: parseInt(percentage),
        price_Limit: parseInt(price_Limit),
        model,
        active: true,
      };
  
      await adminHelpers.addCoupon(obj);
      res.redirect("/admin/createCoupon");
    }catch (err){
      console.log(err, "error while coupon submit")
      res.status(500).render('404')
    }
  },

  viewCoupons: (req, res) => {
    try{
      // view coupons

    }catch (err){
      console.log(err, "error while view Coupons")
      res.status(500).render('404')
    }
  },

  refundRequests: async (req, res) => {
    try{

      let requests = await adminHelpers.findRefundRequest();
      res.render("admin/refundRequest", { requests });

    }catch (err){
      console.log(err, "error while refund request")
      res.status(500).render('404')
    }
  },

  refundStatusChange: async (req, res) => {
    try{
      const { orderId, status } = req.body;
  
      const result = await adminHelpers.refundStatusChange(orderId, status);
  
      //create user wallet
  
      const userId = result.value.userId;
      const amount = result.value.amount;
  
      await adminHelpers.AddtoWallet(userId, amount);
      //update user wallet
      res.json({ status: true });

    }catch (err){
      console.log(err, "error while refund status change")
      res.status(500).render('404')
    }
  },

  // graph data
  graphData: async (req, res) => {
    try{
      const [
        graphData
      ]= await Promise.allSettled([
        adminHelpers.calculateMonthlySalesForGraph()
        //next function
      ])
      
      const {  revenueByMonth, visitorsByMonth , orderStatitics } = graphData.value
      const sales =  revenueByMonth
      const visitors = visitorsByMonth
      
      console.log(orderStatitics)
      
       res.json({ sales, visitors , orderStatitics})
      
      }catch (err){
      console.log(err, "error while graph data ")
      res.status(500).render('404')
    }
  },

  salesReportPage : async (req, res)=>{
    try{
      let india = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      });
      // orderDetails
    let orderDetails = await adminHelpers.getCompletedOrders()
    console.log(orderDetails)
    let amount = []
    let OrderDates = []

     for(let j=0; j < orderDetails?.length; j++){
      let price = india.format(orderDetails[j].total)
      amount.push(price)

    let date = new Date(orderDetails[j].date);
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
    OrderDates.push(shortForm)
     }



      res.render('admin/admin-sales-report',{orderData : orderDetails, amount , date : OrderDates})

    }catch (err){
      console.log(err, "error while  loading the sales report page")
      res.status(500).render('404')
    }
    
  },

  getDocWithinDate : async (req,res)=>{
    try{
      let india = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      });
      console.log('date range found')
      console.log(req.body)
      const {startDate,endDate} = req.body
      // Convert the start and end date strings to JavaScript Date objects
      const date1 = new Date(startDate);
      const date2 = new Date(endDate);
      console.log(date1)
      console.log(date2)

      let orderDetails = await adminHelpers.OrderDetailsWithinRange(date1, date2)
      console.log(orderDetails)
      let amount = []
    let OrderDates = []

     for(let j=0; j < orderDetails?.length; j++){
      let price = india.format(orderDetails[j].total)
      amount.push(price)

    let date = new Date(orderDetails[j].date);
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
    OrderDates.push(shortForm)
     }



      res.render('admin/admin-sales-report',{orderData : orderDetails, amount , date : OrderDates})


    }catch (err){
      console.log(err, "error while getting the doc within the date range");
      res.status(500).render('404')
    }

  },
};
