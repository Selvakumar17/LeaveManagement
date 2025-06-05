const mongoose = require('mongoose');

const studSchema = new mongoose.Schema({
    name:{type:String,required:true},
    year:{type:String,required:true},
    ProfileImage:{type:String,required:true},
    dept:{type:String,required:true},
    sec:{type:String,required:true},
    email:{type:String,required:true},
    mobile:{type:String,required:true},
    rollno:{type:String,required:true},
    roomno:{type:String,required:true},
    wardenname:{type:String,required:true},
    password:{type:String,required:true},

    monthlyLeave: { type: Number, default: 10 },
    takenPerMonth:{type:Number,default:0},
    lastReset: { type: Date, default: new Date() }
});

const Student = mongoose.model("Student",studSchema);

module.exports = Student;