const mongoose = require("mongoose");

const userSchema= mongoose.Schema({
    firstname:{
        type:String,
        required: true,
        trim: true
    },
    lastname:{
        type:String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim: true
    },
    password:{
        type:String,
        required: true,
    },
    // trams:{
    //     type:String,
    //     required: true,
    // },
})

// model
const UserModel= mongoose.model("User",userSchema);

module.exports=UserModel;