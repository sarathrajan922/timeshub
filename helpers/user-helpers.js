const db = require("../config/connection");
const collection = require("../config/collections");
const collections = require("../config/collections");
const ObjectId  = require("mongodb").ObjectId;
const { response } = require("../app");

module.exports = {
  userRegister: (obj) => {
    return new Promise(async (resolve, reject) => {
      let data = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .insertOne(obj, (err) => {
          if (err) console.log("data insert err");
          else console.log("1 document inserted");
        });
      resolve(data);
    });
  },

  doLogin: (logemail) => {
    return new Promise(async (resolve, reject) => {
      let data = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find({ email: logemail })
        .toArray();

        resolve(data)
      
    });
  },

  mobileExist : (mobile)=>{
    return new Promise(async (resolve, reject)=>{
        let data = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find({ phone: mobile }).toArray()
        console.log(data);
        resolve(data)

    })

  },

  getProduct : ()=>{
    return new Promise (async(resolve,reject)=>{
        let productData = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(productData);
    })
    },

    userExist : (email)=>{
      return new Promise (async (resolve,reject)=>{
        let status = await db.get().collection(collections.USER_COLLECTION).find({email : email}).toArray()
        resolve(status);
      })

    },
     
    viewProduct : (id) =>{
      return new Promise (async (resolve,reject)=>{
        let data = await db.get().collection(collections.PRODUCT_COLLECTION).find({ _id : ObjectId(id)}).toArray()
        resolve(data);
      })
    },

    addtoCart: (productId, userId) => {
      let product = {
          item: ObjectId(productId),
          quantity: 1
      }
      return new Promise(async (resolve, reject) => {
          let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ userId: ObjectId(userId) });
          console.log(userCart)
          console.log(ObjectId(productId))
          if (userCart) {
              console.log("user cart exist")
              let isProsuctExist = userCart?.products.findIndex(product => {
                  return product.item == productId
              })
              console.log(isProsuctExist);
              if (isProsuctExist != -1) {
                  console.log("product is already exist")
                  db.get().collection(collection.CART_COLLECTION)
                      .updateOne({ userId: ObjectId(userId), 'products.item': ObjectId(productId) },
                          {
                              $inc: { 'products.$.quantity': 1 }
                          }).then(() => {
                              resolve()
                          })
              } else {
                  db.get().collection(collection.CART_COLLECTION).updateOne({ userId: ObjectId(userId) }, {
                      $push: {
                          products: product
                      }
                  }).then((response) => {
                      console.log("updated user cart")
                      resolve(response);
                  })
              }
          }
          else {
              console.log("new cart created")
              let cart = {
                  userId: ObjectId(userId),
                  products: [product]
              }
              db.get().collection(collection.CART_COLLECTION).insertOne(cart).then((response) => {
                  console.log("added product into the cart");
                  resolve(response);
              })
          }
      })
  },

    
    getCartProduct : (userId)=>{
      return new Promise(async (resolve, reject) => {
        let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                "$match": {
                    "userId": ObjectId(userId)
                }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                "$lookup": {
                    "from": collection.PRODUCT_COLLECTION,
                    "localField": "item",
                    "foreignField": "_id",
                    "as": "product"
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    product: { $arrayElemAt: ['$product', 0] }
                }
            }
        ]
        ).toArray()
        // console.log(cartItems[0]);
        console.log(cartItems);
        // console.log(cartItems[0].product);
        resolve(cartItems);
        })

    },
};
