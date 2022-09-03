const dotenv= require("dotenv");
dotenv.config();
const nodemailer=require("nodemailer");



let transporter= nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    service:"gmail",
    secure:false, //true for port= 465 and other port false
    auth:{
        user:"oleaver39@gmail.com",
        pass:"01991673055",
    }
   
})
module.exports={transporter};