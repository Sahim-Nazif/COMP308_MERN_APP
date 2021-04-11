const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const courseSchema = new mongoose.Schema({

    courseCode:{
        type:String,
        required: true,
        unique:true
    },
    courseName:{
        type:String,
        required: true
    },
    section:{
        type:Number,
        required:true
    },
    semester:{
        type:String,
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       
    },
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)