module.exports ={
    //user login 
    userAuthentication : (req,res,next)=>{
        if(req.session.user){
            res.redirect() //uers home page
        }else{
            
        }
    },
    isUserExist:(req,res ,next)=>{
        if(!req.session.user){
            res.redirect('/')
        }else{
            next()
        }
        
    }
}