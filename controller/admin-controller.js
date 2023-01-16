const db = require("../config/connection");
const collections = require("../config/collections");
const adminHelpers = require("../helpers/admin-helpers");

module.exports = {
  adminLoginpage: (req, res, next) => {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/admin-loginpage");
    }
  },

  dashboard: (req, res, next) => {
    if (req.session.admin) {
      res.render("admin/admin-home");
    } else {
      res.redirect("/admin");
    }
  },

  adminHome: async (req, res, next) => {
    const { email, password } = req.body;

    let admin = await adminHelpers.adminLogin(req.body).then((result) => {
      // console.log(result);
      if (result == "error") {
        console.log("email not exist");
        res.redirect("/admin");
      } else {
        if (result.email == email && result.password == password) {
          req.session.admin = true;

          res.redirect("/admin/dashboard");
        }
      }
    });
  },

  productPage: (req, res, next) => {
    adminHelpers.getProduct().then((product) => {
      res.render("admin/admin-product", { array: product });
    });
  },

  userManagementPage: async (req, res, next) => {
    let data = await adminHelpers.getAllUsers().then((result) => {
      res.render("admin/admin-user-mange", { array: result });
    });
  },

  addProductpage: async (req, res, next) => {
   await adminHelpers.categoryList().then((result)=>{

    res.render("admin/admin-addproduct", {'array' : result});
   })
    
  },

  productFormSubmit: async (req, res, next) => {
    console.log(req.body);
    await adminHelpers.addProduct(req.body).then((result) => {
      const image = req.files.image;
      console.log("object id   "+ result.insertedId);
      image.mv("./public/images/" + result.insertedId + ".jpg", (err, done) => {
        if (!err) res.redirect("/admin/adminproduct");
        else console.log(err);
      });
    });
  },

  productEdit: (req, res, next) => {
    let id = req.params.id;
    adminHelpers.editProduct(id).then((data) => {
      const { document , category }= data
      res.render("admin/product-edit", { array: document, category: category });
    });
  },

  productUpdate: async (req, res, next) => {
    const id = req.params.id;

    const obj = {
      productname: req.body.productname,
      description: req.body.description,
      model: req.body.model,
      price: req.body.price,
      category: req.body.category,
    };

    await adminHelpers.upDateProduct(id, obj).then((status) => {
      if (status == "error") {
        res.send("errror");
      } else {
        if (req.files) {
          let newImage = req.files.image;
          newImage.mv("./public/images/" + id + ".jpg", (err) => {
            if (!err) res.redirect("/admin/adminproduct");
            else console.log(err);
          });
          return;
        }
        res.redirect("/admin/adminproduct");
      }
    });
  },

  productDelete: async (req, res) => {
    let id = req.params.id;
    await adminHelpers.deleteProduct(id).then((status) => {
      if (status == "delete success") {
        res.redirect("/admin/adminproduct");
      }
    });
  },

  userBlock: async (req, res) => {
    let id = req.params.id;
    await adminHelpers.block(id).then((status) => {
      res.redirect("/admin/adminuser");
    });
  },

  userUnBlock: async (req, res) => {
    let id = req.params.id;

    let result = await adminHelpers.unBlock(id).then((status) => {
      res.redirect("/admin/adminuser");
    });
  },

  adminLogout: (req, res) => {
    req.session.admin = null;
    res.redirect("/admin");
  },
  //all category page
  allCategory: async (req, res) => {
    await adminHelpers.getAllCategory().then((data) => {
   //data include array of all item by category
      const { Digital, Dress, GMT, Ladies, Smart, Pilot, Dive } = data;
      res.render("admin/admin-category",{ Digital, Dress, GMT, Ladies, Smart, Pilot, Dive });
    });
  },

  addCategorypage : async (req, res)=>{
    await adminHelpers.categoryList().then((result)=>{

      res.render("admin/admin-add-category", { 'array': result})
    })
    
  },
  deleteCategory : async (req, res)=>{
    const id = req.params.id
   await adminHelpers.deleteCategory(id).then(()=>{
    res.redirect('/admin/create-category')
   })
  },
  
  addCategory : async (req,res)=>{
    console.log(req.body);
   await adminHelpers.addCategory(req.body).then(()=>{
    res.redirect('/admin/create-category')

   })

  },
};
