const {check,validationResult}=require("express-validator")
exports.useValidator=[
    check("name").trim().not().isEmpty().withMessage("Name is missing"),
    check("email").normalizeEmail().isEmail().withMessage("email is invalid"),
    check("password").trim().not().isEmpty().withMessage("Password is missing").isLength({min:8,max:20}).
    withMessage("Password must be 8 to 20 characters long!")

];
exports.signinvalidate=[
    check("email").normalizeEmail().isEmail().withMessage("email is invalid"),
    check("password").trim().not().isEmpty().withMessage("Password is missing")


];
exports.validatepassword=[
    check("newpassword").trim().not().isEmpty().withMessage("Password is missing").isLength({min:8,max:20}).
    withMessage("Password must be 8 to 20 characters long!")

];
exports.validate=(req,res,next)=>{
    const error=validationResult(req).array();
    if(error.length){
        return res.json({error:error[0].msg})
    }
    next();

}