const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");


module.exports ={

    adminLogin : (email)=>{
        return new Promise (async (resolve,reject)=>{
            let data = await db.get().collection(collection.ADMIN_COLLECTION).find({email: email.email})
            if(data) resolve(data)
            else resolve('error')
        })

    },

    addProduct : (obj)=>{
        return new Promise (async(resolve ,reject)=>{
            let data = await db.get().collection(collection.PRODUCT_COLLECTION).insertOne(obj)
            // console.log(data);
            resolve(data);
        }) 
    },
    getProduct : ()=>{
        return new Promise (async(resolve,reject)=>{
            let productData = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(productData);
        })
    },

    editProduct : (id) =>{
        return new Promise (async (resolve,reject)=>{
            let document = await db.get().collection(collection.PRODUCT_COLLECTION).find({ _id: ObjectId(id)}).toArray()
            let category = await db.get().collection(collection.CATEGORY_COLLECTION).find({}).toArray()

            resolve({
                document: document,
                category : category,
            });
        })
    },

    
    upDateProduct : (id, obj)=>{
        return new Promise (async (resolve, reject)=>{
            let status = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(id)},{$set: obj})
            if(status){
                resolve("success")
            }else{
                resolve('error')
            }

        })
    },
    deleteProduct : (id)=>{
        return new Promise (async (resolve, reject)=>{
            let status = await db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(id)})
            if(status) resolve("delete success")
            else resolve("delete failed")
        })
    },

    /*user details */ 


    getAllUsers : ()=>{
        return new Promise (async (resolve,reject)=>{
            let data = await db.get().collection(collection.USER_COLLECTION).find({}).toArray()
            resolve(data);
        })
    },

    block : (id)=>{
        return new  Promise (async (resolve,reject)=>{
            let status = await db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(id)},{$set:{active: false}})
            resolve(status)
        })
    },

    unBlock : (id)=>{
        return new Promise (async (resolve, reject)=>{
            let status = await db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(id)}, {$set:{active: true}})
            resolve(status)
        })
    },
     getAllCategory : () =>{
        return new Promise (async (resolve, reject)=>{
            let Digital =  await db.get().collection(collection.PRODUCT_COLLECTION).find({category: "Digital"}).toArray()
            let Dress = await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Dress"}).toArray()
            let GMT = await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"GMT"}).toArray()
            let  Ladies= await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Ladies"}).toArray()
            let Smart = await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Smart"}).toArray()
            let Pilot = await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Pilot's"}).toArray()
            let Dive = await db.get().collection(collection.PRODUCT_COLLECTION).find({category:"Dive"}).toArray()
            

            resolve({
                Digital: Digital,
                Dress: Dress,
                GMT: GMT,
                Ladies: Ladies,
                Smart: Smart,
                Pilot: Pilot,
                Dive: Dive
            });
        })
     },

     categoryList : ()=>{
        return new Promise(async (resolve,reject)=>{
            let data = await db.get().collection(collection.CATEGORY_COLLECTION).find({}).toArray();
            resolve(data)
        })
     },

     deleteCategory: (id)=>{
        return new Promise (async (resolve,reject)=>{
             await db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id: ObjectId(id)})
            resolve("success")
        })
     },

     addCategory : (obj)=>{
        return new Promise (async (resolve, reject)=>{
            await db.get().collection(collection.CATEGORY_COLLECTION).insertOne(obj);
            resolve("success")
        })
     }

}