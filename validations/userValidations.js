let {check,validationResult}=require('express-validator');
module.exports={
    userSignupValidate:[
        check('username')
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({min:2})
        .withMessage("Name shoud have atleast two characters")
        .trim(),
        check('email')
        .notEmpty()
        .isEmail()
        .trim(),
        check('password')
        .notEmpty()
        .isLength({min:3,max:16})
        .matches(/\d/)
        // .matches(/[!@#$%^&*(),.?":{}|<>]/).
        .trim(),
        check('phone')
        .notEmpty()
        .isLength({min:10})
    //     .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    ] 
}