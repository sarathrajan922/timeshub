const MongoClient = require('mongodb').MongoClient
const mongoDbUrl = process.env.MONGODB_URL

const state ={
    db:null
}

module.exports.connect = (done)=>{
    const url = mongoDbUrl
    const dbname =  'shop'

    MongoClient.connect(url, async(err,data)=>{
        if(err)
        return done(err)
        state.db=await data.db(dbname)
        done()
    })
}

module.exports.get =()=>{
    return state.db
}