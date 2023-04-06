const express = require("express");
const router = express.Router();
const adminControl = require("../../controller/admin-controller");
const upload = require('../../middleware/multer-cloudinary')
// const uploads = require('../../image-controller/multer');

/* admin login page */
router.get("/", adminControl.adminLoginpage);
/*admin login form submit  */
router.post("/adminsubmit", adminControl.adminHome);
/* admin home page */
router.get("/dashboard", adminControl.dashboard);
/* admin product page */
router.get("/adminproduct", adminControl.productPage);
/* admin user-management page */
router.get("/adminuser", adminControl.userManagementPage);
/*admin add product */
router.get("/add-product", adminControl.addProductpage);
/*admin category mangement */
router.get('/adminCategory', adminControl.allCategory);
/* admin product form submit */
router.post("/product-submit",upload,adminControl.productFormSubmit);
/* product edit */
router.get("/product-edit/:id", adminControl.productEdit);
/* product update */
router.post("/product-update/:id", adminControl.productUpdate);
/* product delete */
router.post("/product-delete", adminControl.productDelete);
/*user block  */
router.get("/user-block/:id", adminControl.userBlock);
/*user unblock */
router.get("/user-unblock/:id", adminControl.userUnBlock);
/*create category */
router.route('/create-category').get(adminControl.addCategorypage).post(adminControl.addCategory);
/*category delete */
router.get('/category-delete/:id', adminControl.deleteCategory);
/*admin logout */
router.get('/admin-logout', adminControl.adminLogout);
/*admin order list view */
router.get('/adminOrderDetails', adminControl.adminOrderDetails);
/*view order details */
router.get('/view-orderDetails/:id', adminControl.viewOrderDetails)
/*change order status */
router.post('/update-status', adminControl.changeStatus)
/*download report */
router.post('/download-report', adminControl.downloadReport)
/*view offer page */
router.get('/add-offer', adminControl.getOfferPage)
/*category offer applied */
router.post('/admin-categoryoffer-submit', adminControl.categoryOfferSubmit)
/*product offer applied*/
router.post('/admin-productoffer-submit', adminControl.productOfferSubmit)
/*create coupon & submit coupon form */
router.route('/createCoupon').get(adminControl.createCoupon).post(adminControl.couponSubmit)
/*view current coupons */
router.get('/view-coupon', adminControl.viewCoupons)
/*view refund request page */
router.get('/adminRefundRequest',adminControl.refundRequests)
/*admin change user refund status */
router.post('/update-refund-status', adminControl.refundStatusChange)
/*admin graph */
router.get('/data-for-other-graphs-and-chart', adminControl.graphData)
/*admin sales report page */
router.get('/adminSalesReport', adminControl.salesReportPage)
/*get documents containing the specify date */
router.post('/admin-getReport', adminControl.getDocWithinDate)
module.exports = router;
