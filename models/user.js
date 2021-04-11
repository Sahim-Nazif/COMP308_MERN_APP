const mongoose = require('mongoose')
const crypto=require('crypto')
const uuidv1=require('uuid').v4

const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    lastName:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    address:{
        type:String,
        trim:true,
        required:true,
        
    },
    city:{
        type:String,
        trim:true,
        required:true,
        
    },
    phoneNumber:{
        type:String,
        required:true
    },
    studentNumber:{
        type:Number,
        required:true,
        unique:true,
        index:true
    },
    program:{
        type:String,
        trim:true,
        required:true,
        
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
   hashed_password:{
        type:String,
        required:true,
        
    },
  
        salt:String,
        role:{
            type:Number,
            default:1
        },
        history:{
            type:Array,
            default:[]
        }
}, {timestamps:true})

//virtual fields
userSchema.virtual('password')
            .set(function(password){
                this._password=password
                this.salt=uuidv1()
                this.hashed_password=this.encryptPassword(password)
            })
            .get(function (){

                return this._password
            })
userSchema.methods={
    authenticate:function(plantext) {
        return this.encryptPassword(plantext)===this.hashed_password
    },
    encryptPassword:function(password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex')
        } catch (error) {
            return '';
        }
    }
}
module.exports=mongoose.model('User', userSchema)