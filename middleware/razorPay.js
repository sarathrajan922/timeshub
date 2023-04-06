const key_id = process.env.RAZORPAY_KEY_ID
const key_secret = process.env.RAZORPAY_KEY_SECRET


const Razorpay = require("razorpay")


var instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret
});



 


const generateRazorPay =(orderId,total)=>{
   
    return new Promise((resolve, reject)=>{
        instance.orders.create({
            amount: total*100,
            currency: "INR",
            receipt: ""+orderId,
            notes: {
              key1: "value3",
              key2: "value2"
            }
          },(err,order)=>{
            if(err){
                console.log(err);
            }else{
                resolve(order)
            }

          })
    })
}


module.exports = { generateRazorPay }