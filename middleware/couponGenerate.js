const db = require("../config/connection");
const collection = require("../config/collections");
const collections = require("../config/collections");
const ObjectId = require("mongodb").ObjectId;
const crypto = require('crypto')



const couponGenerator =  async(userId)=>{


   
    const collection = db.get().collection(collections.COUPON_COLLECTION)

     // Count the number of documents in the collection
     const count = await collection.countDocuments();
    // Generate a random number between 0 and the number of documents in the collection
    const randomIndex = Math.floor(Math.random() * count);
    // Find one document at the randomly generated index
    const randomCoupon = await collection.findOne({}, { skip: randomIndex });

 

   const codeLength = 4; 
   const code = crypto.randomBytes(codeLength).toString('hex').toUpperCase();
    

  const { _id, title , description, percentage, price_Limit, model } = randomCoupon

  const createDate = Date.now()
  let exp = new Date(createDate)
  exp.setDate(exp.getDate()+ 10)
  
     const obj = {
        coupon_Id : _id,
        userId : userId,
        title,
        description,
        percentage,
        price_Limit,
        model,
        used : false,
        code: code,
        createDate: createDate.toLocaleString(),
        exp: exp.toLocaleString(), 
     }

     //insert new useable coupon
    const newCoupon = await db
    .get()
    .collection(collections.USABLE_COUPON_COLLECTION)
    .insert(obj)
    .then(()=>{
        return 
    })
    

}


module.exports = { couponGenerator }