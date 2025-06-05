const mongoose = require("mongoose");


const leaveSchema = new mongoose.Schema({
    studId:{type:mongoose.Schema.Types.ObjectId},
    leavetype: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    start:{type:String,required:true},
    end:{type:String,required:true},
    days:{type:String,required:true},
    status: { type: String, default: "Pending" }, 
    appliedDate: { type: Date, default: Date.now },
    description:{type:String,required:true}
});

const leaveModel = mongoose.model("Leave",leaveSchema);

module.exports = leaveModel;