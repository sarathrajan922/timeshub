const express = require("express");
const router = express.Router();
const adminControl = require("../../controller/admin-controller");
const multer = require('../../image-controller/multer');

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
router.post("/product-submit", adminControl.productFormSubmit);
/* product edit */
router.get("/product-edit/:id", adminControl.productEdit);
/* product update */
router.post("/product-update/:id", adminControl.productUpdate);
/* product delete */
router.get("/product-delete/:id", adminControl.productDelete);
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

module.exports = router;
