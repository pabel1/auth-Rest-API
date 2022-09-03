const jwt= require("jsonwebtoken");

const authVarification=(req,res,next)=>{
    const {authorization}=req.headers;
    try {
        const token=authorization.split(" ")[1];
        const decoded= jwt.verify(token,process.env.JWT_TOKEN);
        const {email,id}=decoded;
        req.email=email;
        req.id=id;
        next();
        
    } catch (error) {
        next("Authentication Failed!");
    }
}

module.exports=authVarification;