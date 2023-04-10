const db = require("../config/connection");
const collection = require("../config/collections");
const collections = require("../config/collections");
const ObjectId = require("mongodb").ObjectId;
const { response } = require("../app");
const { body } = require("express-validator");
const { CART_COLLECTION } = require("../config/collections");
const { ObjectID } = require("bson");

module.exports = {
  
  userRegister: async (obj) => {
    try{
      
        let data = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .insertOne(obj);
        return 
   
      
    }catch (err){
     return err
    }
  },

  doLogin: async (logemail) => {
    try{
      
     
        let data = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .find({ email: logemail })
          .toArray();
  
       return data
    
    }catch (err){
     return err
    }
  },

  mobileExist: async (mobile) => {
    try{
      
     
        let data = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .find({ phone: mobile })
          .toArray();
       
        return data
    
    }catch (err){
      return err
    }
  },

  getProduct: async () => {
    try{
      
        let productData = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .find()
          .toArray();
         return productData
     
      
    }catch (err){
    return err
    }
  },

  userExist: async (email) => {
    try{
     
        let status = await db
          .get()
          .collection(collections.USER_COLLECTION)
          .find({ email: email })
          .toArray();
        return status
    
      
    }catch (err){
     return err
    }
  },

  viewProduct: async (id) => {
    try{

   
        let data = await db
          .get()
          .collection(collections.PRODUCT_COLLECTION)
          .find({ _id: ObjectId(id) })
          .toArray();
       return data
    
      
    }catch (err){
     return err
    }
  },

  addtoCart: async (productId, userId) => {
    try{
      
      let product = {
        item: ObjectId(productId),
        quantity: 1,
      };
      return new Promise(async (resolve, reject) => {
        let userCart = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .findOne({ userId: ObjectId(userId) });
      
   
  
        if (userCart) {
        
          let isProductExist = userCart?.products.findIndex((product) => {
            return product.item == productId;
          });
         
          if (isProductExist != -1) {
           
            db.get()
              .collection(collection.CART_COLLECTION)
              .updateOne(
                {
                  userId: ObjectId(userId),
                  "products.item": ObjectId(productId),
                },
                {
                  $inc: { "products.$.quantity": 1 },
                }
              )
              .then(() => {
                resolve({ status: true });
              });
          } else {
            db.get()
              .collection(collection.CART_COLLECTION)
              .updateOne(
                { userId: ObjectId(userId) },
                {
                  $push: {
                    products: product,
                  },
                }
              )
              .then((response) => {
               
                resolve({ status: true });
              });
          }
        } else {
          
          let cart = {
            userId: ObjectId(userId),
            products: [product],
          };
          db.get()
            .collection(collection.CART_COLLECTION)
            .insertOne(cart)
            .then((response) => {
             
              resolve(response);
            });
        }
      });
    }catch (err){
     return err
    }
  },

  getCartProduct: async (userId) => {
    try{
      let cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { userId: ObjectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "products.item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: "$product",
          },
         
          {
            $group: {
              _id: {
                cartId: "$_id",
                productId: "$product._id",
              },
              product_title: { $first: "$product.productname" },
              product_price: {
                $first: {
                  $cond: [
                    { $ifNull: ["$product.discountprice", false] },
                    { $min: ["$product.discountprice", "$product.price"] },
                    "$product.price"
                  ]
                }
              },
              product_images: { $first: "$product.images"},
              quantity: { $sum: "$products.quantity" },
              subtotal: {
                $sum: {
                  $multiply: ["$products.quantity", {
                    $cond: [
                      { $ifNull: ["$product.discountprice", false] },
                      { $min: ["$product.discountprice", "$product.price"] },
                      "$product.price"
                    ]
                  }]
                },
              },
            },
          },
          {
            $group: {
              _id: "$_id.cartId",
              products: {
                $push: {
                  product_id: "$_id.productId",
                  product_title: "$product_title",
                  product_price: "$product_price",
                  product_image: "$product_images.image1",
                  quantity: "$quantity",
                  subtotal: "$subtotal",
                },
              },
              total: { $sum: "$subtotal" },
            },
          },
          {
            $project: {
              _id: 1,
              products: 1,
              total: 1,
              
            },
          },
        ])
        .toArray();
 
    return cartItems
      
    }catch (err){
      return err
    }

   
  },
  

  changeCartQuantity: (productData) => {
    try{
      
      return new Promise((resolve, reject) => {
        let { cartId, productId, count, quantity } = productData;
        count = parseInt(count);
        quantity = parseInt(quantity);
        if (count == -1 && quantity == 1) {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { _id: ObjectId(cartId) },
              {
                $pull: { products: { item: ObjectId(productId) } },
              }
            )
            .then(() => {
              resolve({ removed: true });
            });
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .findOneAndUpdate(
              { _id: ObjectId(cartId), "products.item": ObjectId(productId) },
              {
                $inc: { "products.$.quantity": count },
              }
            )
            .then((response) => {
              resolve({ status: true });
            });
        }
      });
    }catch (err){
     return err
    }
  },

  findTotalAmout: (userId) => {
    return new Promise(async (resolve, reject) => {
      let totalAmout = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: {
              userId: ObjectId(userId),
            },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
            },
          },
        ])
        .toArray();
      resolve(totalAmout[0]);
    });
  },
  

  deleteCartItem: async (body) => {
    try{

      let { cartId, productId } = body;
    
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            { _id: ObjectId(cartId) },
            {
              $pull: { products: { item: ObjectId(productId) } },
            }
          )
          .then(() => {
            return 
          });
      
      
    }catch (err){
     return err
    }
  },

  addressAdd: async (obj) => {
    try{
     
     return await db.get()
          .collection(collection.ADDRESS_COLLECTION)
          .insertOne(obj)
           

     
      
    }catch (err){
     return err
    }
  },

  getAddress: async (userId) => {
    try{
        const address = await db
          .get()
          .collection(collection.ADDRESS_COLLECTION)
          .find({ userId: userId })
          .toArray();
        const userDetails = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .find({ _id: ObjectId(userId) })
          .toArray();
        const orderDetails = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .find({ userId: userId })
          .toArray();
        const obj = {
          address: address,
          userDetails: userDetails,
          orderDetails: orderDetails,
        };
        return obj
   
    }catch (err){
      return err
    }
  },

  addressDelete: (addressId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ADDRESS_COLLECTION)
        .deleteOne({ _id: ObjectId(addressId) });
      resolve(true);
    });
  },
  orderRecords: (obj) => {
    return new Promise((resolve, reject) => {
      let result = db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .insertOne(obj);
      resolve(result);
    });
  },
  orderStatus: (id) => {
    return new Promise(async (resolve, reject) => {
      let status = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              status: "cancelled",
            
            },
          }
        );
      resolve(status);
    });
  },

  recentOrder: async (id) => {
    let recentOrder = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ _id: ObjectId(id) })
      .toArray();
    return recentOrder;
  },

  verifypayment: (obj) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

      hmac.update(
        obj["payment[razorpay_order_id]"] +
          "|" +
          obj["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == obj["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },

  changePaymentStatus: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne({ _id: ObjectId(orderId) }, { $set: { status: "placed" } })
        .then(() => {
          resolve();
        });
    });
  },

  changeName: async (userId, newName) => {
    await db
      .get()
      .collection(collection.USER_COLLECTION)
      .updateOne({ _id: ObjectId(userId) }, { $set: { name: newName } });
    return true;
  },
  getOrderDetails : async(id)=>{
  
    const orderDetails = await db.get().collection(collection.ORDER_COLLECTION).find({_id: ObjectId(id)}).toArray()
   return orderDetails

},
getUserDetails : async(id)=>{
  const userDetails = await db.get().collection(collection.USER_COLLECTION).find({_id: ObjectId(id)}).toArray()
  return userDetails
},

getOrderAddress : async(id)=>{
  const address = await db.get().collection(collection.ADDRESS_COLLECTION).find({_id: ObjectId(id)}).toArray()
  return address
},

AddtoWishlist : async(prodId,userId)=>{


 let userExist =  await db.get()
  .collection(collection.WISHLIST_COLLECTION)
  .updateOne({ user: ObjectID(userId) },
    { $addToSet: { products: ObjectID(prodId) } },
    { upsert: true })

    return true
  
},

getWishList : async (userId)=>{

  let result = await db.get().collection(collection.WISHLIST_COLLECTION)
  .aggregate([
    {
      $match: {
        "user": ObjectId(userId)
      }
      },
      {
        $lookup: {
          from: collection.PRODUCT_COLLECTION,
          localField: "products",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $project: {
          _id: 0,
          "productDetails._id": 1,
          "productDetails.productname": 1,
          "productDetails.price": 1,
          "productDetails.images": 1,
          // Add any other fields you want to retrieve from the product collection
        }
      }
  ]).toArray()

  return result

},

deleteWishlistItem : async(productId, userId)=>{

   await db.get().collection(collection.WISHLIST_COLLECTION)
  .updateOne(
    { user: ObjectId(userId) },
    { $pull: { products: ObjectId(productId) } }
  ).then(() => {
    return 
  });
   
},


getUserCoupons: async (userId)=>{
  try{
      
    let result = await db.get()
    .collection(collection.USABLE_COUPON_COLLECTION)
    .find({ userId : userId}).toArray()
  
    return result
  }catch (err){
   return err
  }
},

checkCoupon : async(couponCode, userId)=>{

  let result = await db.get().collection(collection.USABLE_COUPON_COLLECTION)
              .findOne({ code: couponCode, userId : userId})

              if(!result){
                return false
              }

              return result;
  
},

refundRequest : async(obj)=>{

  await db.get()
  .collection(collection.REFUND_REQUEST_COLLECTION)
  .insertOne(obj).then(()=>{
    return true
  })
},

userWallet : async (userId)=>{
  let data = await db.get().collection(collection.USER_WALLET_COLLECTION)
              .find({ userId : userId}).toArray()
              return data
},

changeCouponStatus : async (code)=>{

   await db.get()
   .collection(collection.USABLE_COUPON_COLLECTION)
   .updateOne(
    { code : code},
    { $set : { used : true}}
    )

    return
  
},

 WalletCheck :async (userId, amount)=>{
 
    try {
      amount = parseFloat(amount);
      let transaction = {
        type: "debit",
        amount: amount,
        date: new Date(),
      };

      let userWallet = await db
        .get()
        .collection(collection.USER_WALLET_COLLECTION)
        .findOne({ userId: userId });

      if (userWallet && amount <= userWallet?.amount ) {
        
        await db
          .get()
          .collection(collection.USER_WALLET_COLLECTION)
          .updateOne(
            { userId: userId },
            {
              $push: {
                Transaction: transaction,
              },
              $inc: {
                amount: -amount,
              },
            }
          );
        return { status : true, message : 'Transaction Done'}
      } else {
        return { status : false, message:  ' Insufficient Balance'}
      }
    } catch (err) {
      return err;
    }
  
 },

 getWallet :  async(userId)=>{
  try{

    let result = await db.get().collection(collection.USER_WALLET_COLLECTION).find({ userId : userId}).toArray()
    return result



  }catch (err){
    return err
  }

 },

 saveIPAddress : async (IP)=>{
  try{
    await db.get().collection(collection.VISITORS_IP_COLLECTION).updateOne(
    { IPAddress: IP },
    { $set: { visistedDate: new Date() } },
    { upsert: true }
 );
  
    return

    

  }catch( err){
    return err
  }

 },

};
